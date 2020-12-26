const http = require("http");
const globalStore = new Map(), port = 8800;
const methods = {
    GET(url, resObj) {
        if (url.search === '') resObj.data = Object.fromEntries(globalStore);
        else resObj.data = {}
        url.searchParams.forEach((_, k) => resObj.data[k] = globalStore.get(k));
    },
    POST(url, resObj) {
        resObj.data = {};
        [...url.searchParams.entries()].filter(v=>!!v[1]).forEach(([k, v]) => {
            resObj.data[k] = v;
            globalStore.set(k, v);
        });
    },
    DELETE:(url)=>[...url.searchParams.keys()].forEach(k=>globalStore.delete(k))
};

http.createServer((request, response) => {
    const responseObj = {committed: true};
    const url = new URL(`http://${request.headers.host}\\${request.url}`);
    if (methods[request.method]) methods[request.method](url, responseObj);
    else { //Unimplemented HTTP methods
        responseObj.reason = request.method + " Not implemented.";
        responseObj.committed = false;
    }
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(responseObj));
}).listen(port);
console.log(`http://localhost:${port}`);
