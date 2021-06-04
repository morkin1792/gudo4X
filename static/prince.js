var newhtml = `
<head>
  <style>
    .dosbox-container {
    	height: 100%;
    }
    #jsdos {
        position: fixed;
        top: 50%;
        left: 50%;
	height: 100%;
        transform: translate(-50%, -50%);
    }
    body {
        background-color: black;
    }
  </style>
</head>
<body>
  <canvas id="jsdos"></canvas>
</body>
`
document.getElementsByTagName('html')[0].innerHTML = newhtml

var script= document.createElement('script');
script.src= 'https://js-dos.com/6.22/current/js-dos.js';

function play() {
  Dos(document.getElementById("jsdos"), { 
    wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js" 
  }).ready((fs, main) => {
    fs.extract("https://cors.archive.org/cors/msdos_Prince_of_Persia_1990/Prince_of_Persia_1990.zip").then(() => {
      main(["-c", "cd Ppersia" , "-c", "PRINCE.EXE"])
    });
  })
}

script.onload = play
document.getElementsByTagName('head')[0].appendChild(script);
