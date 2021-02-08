const http = require("http");
const globalStore = new Map(), port = 8800;
const methods = {
    GET(url, resObj) {
        if (!url.search) resObj.data = Object.fromEntries(globalStore);
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
    DELETE:url=>[...url.searchParams.keys()].forEach(k=>globalStore.delete(k))
};

function unimplementedMethods(q,s){
    s.reason=q.method+" Not implemented."; s.committed = false;
}
http.createServer((request, response) => {
    const responseObj = {committed: true};
    const url = new URL(request.url,`http://${request.headers.host}`);
    if (request.method in methods) methods[request.method](url, responseObj);
    else unimplementedMethods(request,response);
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(responseObj));
}).listen(port);
console.log(`http://localhost:${port}`);
