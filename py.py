from wsgiref import simple_server;import json as JSON
port = 8800, globalstorage = {}

def GET(query, obj):
    if len(query) == 0: obj['data'] = globalstorage
    else: obj['data'] = {}
    for e in query:
        obj['data'][e[0]] = globalstorage[e[0]]

def POST(query, obj):
    obj['data'] = {}
    for e in filter(lambda e: len(e)>1, query):
        obj['data'][e[0]] = e[1]
        globalstorage[e[0]] = e[1]

def DELETE(query, obj):
    for e in query:
        del globalstorage[e[0]]

def BAD(query, obj):
    obj['reason'] = "Not implemented."
    obj['committed'] = False

methods = {'GET': GET, 'POST': POST, 'DELETE': DELETE}
def application(ev, res):
    resObj = {'committed': True}
    query = [e.split('=') for e in filter(None, ev['QUERY_STRING'].split('&'))]
    methods.get(ev['REQUEST_METHOD'], BAD)(query, resObj)

    res('200 OK', [('Content-Type', 'application/json')])
    return [JSON.dumps(resObj).encode('utf-8')]

with simple_server.make_server('', port, application) as httpd:
    print('http://localhost:{}'.format(port))
    httpd.serve_forever()