# KV Store In 40 Lines
## Purpose
It's a challenge in [More challenging projects every programmer should try](https://web.eecs.utk.edu/~azh/blog/morechallengingprojects.html). This repo proves that a KV store web api can be easily implemented in a "batteries-included" programming language.

## Features
- HTTP methods to query, update, delete keys and values.
  - GET for query keys and related values.
  - POST for append and update keys and related values.
  - DELETE for delete keys.
- String to string key-value support.
- Use JSON as representation format.
- Fault-tolerant when parameters isn't fit method

## Examples
```
> curl -X POST 'http://localhost:8800/?a=1&a=2&b=3&c'
{"committed":true}

> curl -X GET 'http://localhost:8800/'
{"a":["1","2"],"b":"3","c":""}

> curl -X GET 'http://localhost:8800/?a&b=1'
{"a":["1","2"],"b":"3"}

> curl -X POST 'http://localhost:8800/?a=2&a=3'
{"committed":true}

> curl -X GET 'http://localhost:8800/'
{"a":["2","3"],"b":"3","c":""}
```

## License
BSD