# ~ * ~ Fun Forecast ~ * ~

This webapp tells you when is the best time to do the things you love to do outside.

- Run the backend with `go run main.go`
- Run the frontend with `cd frontend; yarn start`

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

## GO Notes

- Read & (as in `&var`) as "address of".
- if `p := &var` that makes `p` a pointer
- `fmt.Print(p)` would print the address of `var`, and `fmt.Print(*p)` would print the value of `var`
- `*p` is also called dereferencing
- `*p = 41` changes the value of `var` to 41 (assuming type int)
- `*int` or any other type of * before a struct, is a pointer base. it can be used passed into arguments to pass the pointer rather than the copied value of the thing
- Given a struct, it can be initialized like: 
```
type person struct {
    name  string
    age   int
}

m := person{name:"Kaylee", age:11}
```

# Jobs to be done

- [ ] Convert zipcode to lat/lng
- [ ] create, read loc_ref to db with location_name, lat, lng, zipcode, nickname

- [ ] Translate given zipcode to lat/lng
- [ ] 

## worker pools


- worker_0: url,type >> jsondata
- worker_1: verb,jsondata >> 

# Gear/Affiliates implementation 

- graph data, < gear.tags >---< hour.conditions >