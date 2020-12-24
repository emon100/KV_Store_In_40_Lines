const http = require("http");

const globalStorage = new Map(), port = 8800;
function GET(url, resObj) {
    if (url.search === '') resObj.data = Object.fromEntries(globalStorage);
    else resObj.data = {}
    url.searchParams.forEach((_, k) => resObj.data[k] = globalStorage.get(k));
}

function POST(url, resObj) {
    resObj.data = {};
    [...url.searchParams.entries()].filter(v => !!v[1]).forEach(([k, v]) => {
        resObj.data[k] = v;
        globalStorage.set(k, v);
    });
}

function DELETE(url) {
    for (const k of url.searchParams.keys()) globalStorage.delete(k);
}

http.createServer((request, response) => {
    const responseObj = {committed: true};
    const url = new URL(`http://${request.headers.host}\\${request.url}`);

    if (request.method === 'GET') GET(url, responseObj);
    else if (request.method === 'POST') POST(url, responseObj);
    else if (request.method === 'DELETE') DELETE(url);
    else { //Unimplemented HTTP methods
        responseObj.reason = request.method + " Not implemented.";
        responseObj.committed = false;
    }

    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(responseObj));
}).listen(port);
console.log(`http://localhost:${port}`);
