# ~ * ~ Fun Forecast ~ * ~

This webapp tells you when is the best time to do the things you love to do outside.

# Backend

`go run main.go`

To see an example output, go to `localhost:1323/example`
## Commands

- `go run main.go`
- `gofmt -w .` to format all files

## Resources

- [Go concurrency patterns](https://youtu.be/f6kdp27TYZs)

## Things to know about Golang in 2022

when you just want to keep your code well-organized, but don't want to manage multiple modules

- create your main folder _outside_ of \$GOPATH
- `go mod init whatever/site`
- create package main in root
- mkdir server; touch server/server.go <-- package server
- TODO: does this work with heroku?
