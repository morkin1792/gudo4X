from flask import Flask, request, make_response
from datetime import datetime
import sys, os, re, magic

log_directory='./logs'
static_directory = './static'

app = Flask(__name__, static_url_path='')
plain_text_urls = False

@app.after_request
def remove_header(response):
    response.headers['Server'] = 'generic'
    return response

@app.route('/')
def home():
    return ':p'

@app.errorhandler(Exception)
def handle(e):
    return ':o'

def get_content_type(filepath):
    mime = magic.Magic(mime=True)
    if '.js' in filepath:
        return 'application/javascript'
    else:
        return mime.from_file(filepath)

@app.route('/<name>', methods=['GET'])
def load_static(name):
    try:
        host = request.headers.get('host')
        if len(host) < 1:
            host = request.headers.get('Host')
        name = re.search('[a-zA-Z0-9_.-]+', name)
        name = name.group()
        filepath = static_directory + '/' + name
        content = open(filepath, 'rb').read()
        if len(host) > 0:
            content = content.replace(b'myserver', bytes(host, 'utf8'))
            if plain_text_urls:
                content = content.replace(b'https', b'http')
        response = make_response(content)
        response.headers['Content-Type'] = get_content_type(filepath)
        response.headers['Cache-Control'] = 'no-cache'
        return response
    except Exception: 
        return ':p'

@app.route('/', methods= ['POST'])
def infos():
    try:
        metadata = request.args.get('meta')
        if metadata == None:
            raise
        client_ip = request.remote_addr
        ip_rgx = '^[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}$'
        if client_ip == '127.0.0.1':
            client_ip = request.headers.get('X-Forwarded-For')
        client_ip = re.match(ip_rgx, client_ip).group()
        log = open(log_directory + '/' + client_ip + '__' + datetime.now().strftime('%d.%m.%Y__%H.%M.%S__%f') + '.log', 'wb') 
        log.write(bytes('* [' + datetime.now().strftime('%d/%m/%Y %H:%M:%S') + ' @ ' + client_ip + '] ' + metadata + '\n', 'utf-8'))
        log.write(request.get_data())
        log.close()
        resp = make_response('1') 
        origin = request.headers.get('Origin')
        if len(origin) < 1:
            origin = request.headers.get('origin')
        if len(origin) > 0:
            resp.headers['Access-Control-Allow-Origin'] = origin
        return resp
    except Exception:
        return ':p'

def get_port(port):
    if len(sys.argv) > 1:
        return sys.argv[1]
    return str(port)

def main():
    if not os.path.exists(log_directory):
        os.makedirs(log_directory)
    try:
        if os.path.isfile('cert.pem') and os.path.isfile('key.pem'):
            app.run(port=get_port(443), host='0.0.0.0', ssl_context=('cert.pem', 'key.pem'))
        else:
            print(' * ssl cert files not found, it will run in plaintext')
            global plain_text_urls
            plain_text_urls = True
            app.run(port=get_port(80), host='0.0.0.0')
    except PermissionError:
        print('\n[!] permission error, try execute as root or change the port')
            
if __name__ == '__main__':
    main()