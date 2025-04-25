package tracehttp

import (
	"context"
	"fmt"
	"io"
	"net/http"

	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/trace"
)

type TracingHTTPClient struct {
	client *http.Client
}

func NewTracingClient() *TracingHTTPClient {
	return &TracingHTTPClient{
		client: &http.Client{
			Transport: otelhttp.NewTransport(http.DefaultTransport),
		},
	}
}

func (c *TracingHTTPClient) Get(ctx context.Context, url string, headers map[string]string) (*http.Response, error) {
	span := trace.SpanFromContext(ctx)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, "failed to create request")
		return nil, err
	}

	// Set headers
	for key, value := range headers {
		req.Header.Set(key, value)
	}

	resp, err := c.client.Do(req)

	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, err.Error())
		return nil, err
	}

	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		errMsg := fmt.Sprintf("status %d: %s", resp.StatusCode, string(body))

		span.RecordError(fmt.Errorf("%s", errMsg))
		span.SetStatus(codes.Error, errMsg)
		span.SetAttributes(attribute.Int("http.status_code", resp.StatusCode))
	}

	return resp, err
}
