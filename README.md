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
- Fault-tolerant when parameters don't fit the HTTP methods.

## Usage
Use `node index.js` to start the server. Default host is localhost and port is 8800.

### GET method
Use GET method and URL parameters to query keys and their values. Only the **keys** in the query string matter. The server return existed keys and values.
For example: `?a=1&a=2&b=3&c` querys a,b,c and will return each value in `data` if the value exists : `{"a":"2","b":"3"}`.

### POST method
Use POST method and URL parameters to create or update keys and their values. Only keys with **not-null value** will be created or updated. If a key appeared multiple times, the **last not-null** value will be the value of the key.
For example: `?a=1&a=2&b=3&c` will create or update a,b but no c, because the value of c is null. Then the value of a will become **2**. Then the server will return each updated value in `data`: `{"a":2,"b":3}`.

### DELETE method
Use DELETE method and URL parameters to delele keys and their values. Only the **keys** in the query string matter. The server will return no `data`.
For example: `?a=1&a=2&b=3&c` will delete a,b and c and their value.

## Examples
```
> curl -X POST 'http://localhost:8800/?a=1&a=2&b=3&c'
{"committed":true,"data":{"a":"2","b":"3"}}

> curl -X GET 'http://localhost:8800/'
{"committed":true,"data":{"a":"2","b":"3"}}

> curl -X POST 'http://localhost:8800/?a=1'
{"committed":true,"data":{"a":"1"}}

> curl -X DELETE 'http://localhost:8800/?a'
{"committed":true}

> curl -X GET 'http://localhost:8800/'
{"committed":true,"data":{"b":"3"}}
```

## License
BSD

