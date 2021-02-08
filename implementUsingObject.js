const http = require("http");
const globalStorage = Object.create(null), port = 8800;
function GET(url, responseObj) {
    if (url.search === '') responseObj.data = globalStorage;
    else
        for (const k of url.searchParams.keys())
            responseObj.data[k] = globalStorage[k];
}
function POST(url) {
    for (const [k, v] of url.searchParams.entries()) {
        const valueList = url.searchParams.getAll(k);
        globalStorage[k] = v;
        if (valueList.length >= 1)
            globalStorage[k] = valueList;
    }
}
function DELETE(url) {
    for (const k of url.searchParams.keys()) delete globalStorage[k];
}
function BAD_METHOD(request, responseObj) {
    responseObj.reason = request.method + " Not implemented.";
    responseObj.committed = false;
}
http.createServer((request, response) => {
    const url = new URL(`http://${request.headers.host}\\${request.url}`);
    const responseObj = {committed: true};
    if (request.method === 'GET') GET(url, responseObj);
    else if (request.method === 'POST') POST(url);
    else if (request.method === 'DELETE') DELETE(url);
    else BAD_METHOD(request, responseObj);
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(responseObj));
}).listen(port);
console.log(`http://localhost:${port}`);
