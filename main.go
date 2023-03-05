package main

import (
	"chelshaw/funforecast/server"
	"fmt"
	"time"
)

// evolved from https://gobyexample.com/worker-pools
// TODO: How to return schema struct not string
func exampleWorker(id int, jobs <-chan string, results chan<- string) {
    for j := range jobs {
        fmt.Println("worker", id, "started  job", j)
        time.Sleep(time.Second)
        fmt.Println("worker", id, "finished job", j)
        results <- fmt.Sprintf("job done: %s", j)
    }
}
func example() { // get forecast per verb
    const numJobs = 3 // must match verbs.len
	verbs := [3]string{"hike", "motorcycle", "run"}
    jobs := make(chan string, numJobs)
    results := make(chan string, numJobs)

    for w := 1; w <= 3; w++ {
        go exampleWorker(w, jobs, results)
    }

    for j := 0; j < numJobs; j++ {
        jobs <- verbs[j]
    }
    close(jobs)

    for a := 1; a <= numJobs; a++ {
        <-results
    }
}


func main() {
	fmt.Println("Hey cutie ;)")
	server.StartServer()
	example()
}
