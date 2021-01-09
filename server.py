from flask import Flask, request, make_response
from datetime import datetime
import sys, os, re

port = 443
log_dir='./logs'
scripts_location = './scripts'


if not os.path.exists(log_dir):
    os.makedirs(log_dir)

class myFlask(Flask):
    def process_response(self, response):
        response.headers['server'] = 'Generic'
        return(response)

app = myFlask(__name__, static_url_path='')

@app.route('/<name>', methods=['GET'])
def script(name):
    host = request.headers.get('host')
    if len(host) < 1:
        host = request.headers.get('Host')
    name = re.search('[a-zA-Z0-9]+', name)
    if name:
        name = name.group()
        script = open(scripts_location + '/' + name).read()
        if len(host) > 0:
            script = script.replace('myserverhere', host)
        resp = make_response(script)
        resp.headers['Content-Type'] = 'application/javascript; charset=utf-8'
        return resp

@app.route('/', methods= ['POST'])
def infos():
    client_ip = request.remote_addr
    forwarded = request.headers.get('X-Forwarded-For')
    if client_ip == '127.0.0.1' and re.match('^[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}$', forwarded):
        client_ip = forwarded
    log = open(log_dir + '/' + client_ip + '__' + datetime.now().strftime('%d.%m.%Y__%H.%M.%S__%f') + '.log', 'w')
    log.write('* [' + datetime.now().strftime('%d/%m/%Y %H:%M:%S') + '] connection from: ' + client_ip + '\n')
    log.write(request.get_data().decode() + '\n')
    log.close()
    resp = make_response('1')
    origin = request.headers.get('Origin')
    if len(origin) < 1:
        origin = request.headers.get('origin')
    if len(origin) > 0:
        resp.headers['Access-Control-Allow-Origin'] = origin
    return resp


if len(sys.argv) > 1:
    port = sys.argv[1]
app.run(port=port, host='0.0.0.0', ssl_context=('cert.pem', 'key.pem'))

