const http = require("http");

const globalStorage = new Map(), port = 8800;
http.createServer((request, response) => {
    const responseObj = {};
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (request.method === 'GET') {
        let paramsNotExist = true;
        for (const e of url.searchParams.keys()) {
            responseObj[e] = globalStorage.get(e);
            paramsNotExist = false;
        }
        if (paramsNotExist) {
            globalStorage.forEach((v, k) => {
                responseObj[k] = v;
            });
        }
    } else if (request.method === 'POST') {
        for (const e of url.searchParams.entries()) {
            const valueList = url.searchParams.getAll(e[0]);
            if (valueList.length === 1)
                globalStorage.set(e[0], e[1]);
            else
                globalStorage.set(e[0], valueList);
        }
        responseObj = {committed: true};
    } else if (request.method === 'DELETE') {
        for (const e of url.searchParams.keys()) {
            globalStorage.delete(e);
        }
        responseObj = {committed: true};
    } else {
        throw request.method + " Not implemented.";
    }
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(responseObj));
    response.end();
}).listen(port);
console.log(`http://localhost:${port}`);
