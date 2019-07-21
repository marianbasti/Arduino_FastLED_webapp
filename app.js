var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Gpio = require('pigpio').Gpio; //include pigpio to interact with the GPIO
var fs = require('fs'); //require filesystem module
var port;
var intervalo;
var date = new Date();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

ledRed1 = new Gpio(2, {mode: Gpio.OUTPUT}), //use GPIO pin 4 as output for RED
ledGreen1 = new Gpio(3, {mode: Gpio.OUTPUT}), //use GPIO pin 17 as output for GREEN
ledBlue1 = new Gpio(4, {mode: Gpio.OUTPUT}), //use GPIO pin 27 as output for BLUE
ledRed2 = new Gpio(17, {mode: Gpio.OUTPUT}), //use GPIO pin 4 as output for RED
ledGreen2 = new Gpio(27, {mode: Gpio.OUTPUT}), //use GPIO pin 17 as output for GREEN
ledBlue2 = new Gpio(22, {mode: Gpio.OUTPUT}), //use GPIO pin 27 as output for BLUE
ledRed3 = new Gpio(10, {mode: Gpio.OUTPUT}), //use GPIO pin 4 as output for RED
ledGreen3 = new Gpio(9, {mode: Gpio.OUTPUT}), //use GPIO pin 17 as output for GREEN
ledBlue3 = new Gpio(11, {mode: Gpio.OUTPUT}), //use GPIO pin 27 as output for BLUE
ledRed4 = new Gpio(5, {mode: Gpio.OUTPUT}), //use GPIO pin 4 as output for RED
ledGreen4 = new Gpio(6, {mode: Gpio.OUTPUT}), //use GPIO pin 17 as output for GREEN
ledBlue4 = new Gpio(12, {mode: Gpio.OUTPUT}), //use GPIO pin 27 as output for BLUEledRed1 = new Gpio(2, {mode: Gpio.OUTPUT}), //use GPIO pin 4 as output for RED
ledRed5 = new Gpio(13, {mode: Gpio.OUTPUT}), //use GPIO pin 4 as output for RED
ledGreen5 = new Gpio(19, {mode: Gpio.OUTPUT}), //use GPIO pin 17 as output for GREEN
ledBlue5 = new Gpio(26, {mode: Gpio.OUTPUT}), //use GPIO pin 27 as output for BLUE
ledRed6 = new Gpio(16, {mode: Gpio.OUTPUT}), //use GPIO pin 4 as output for RED
ledGreen6 = new Gpio(20, {mode: Gpio.OUTPUT}), //use GPIO pin 17 as output for GREEN
ledBlue6 = new Gpio(21, {mode: Gpio.OUTPUT}), //use GPIO pin 27 as output for BLUE
ledRed7 = new Gpio(8, {mode: Gpio.OUTPUT}), //use GPIO pin 4 as output for RED
ledGreen7 = new Gpio(7, {mode: Gpio.OUTPUT}), //use GPIO pin 17 as output for GREEN
ledBlue7 = new Gpio(12, {mode: Gpio.OUTPUT}), //use GPIO pin 27 as output for BLUE
ledRed8 = new Gpio(23, {mode: Gpio.OUTPUT}), //use GPIO pin 4 as output for RED
ledGreen8 = new Gpio(24, {mode: Gpio.OUTPUT}), //use GPIO pin 17 as output for GREEN
ledBlue8 = new Gpio(25, {mode: Gpio.OUTPUT}), //use GPIO pin 27 as output for BLUEledRed1 = new Gpio(2, {mode: Gpio.OUTPUT}), //use GPIO pin 4 as output for RED

//RESET RGB LED
ledRed1.digitalWrite(0); // Turn RED LED off
ledGreen1.digitalWrite(0); // Turn GREEN LED off
ledBlue1.digitalWrite(0); // Turn BLUE LED off
ledRed2.digitalWrite(0); // Turn RED LED off
ledGreen2.digitalWrite(0); // Turn GREEN LED off
ledBlue2.digitalWrite(0); // Turn BLUE LED off
ledRed3.digitalWrite(0); // Turn RED LED off
ledGreen3.digitalWrite(0); // Turn GREEN LED off
ledBlue3.digitalWrite(0); // Turn BLUE LED off
ledRed4.digitalWrite(0); // Turn RED LED off
ledGreen4.digitalWrite(0); // Turn GREEN LED off
ledBlue4.digitalWrite(0); // Turn BLUE LED off
ledRed5.digitalWrite(0); // Turn RED LED off
ledGreen5.digitalWrite(0); // Turn GREEN LED off
ledBlue5.digitalWrite(0); // Turn BLUE LED off
ledRed6.digitalWrite(0); // Turn RED LED off
ledGreen6.digitalWrite(0); // Turn GREEN LED off
ledBlue6.digitalWrite(0); // Turn BLUE LED off
ledRed7.digitalWrite(0); // Turn RED LED off
ledGreen7.digitalWrite(0); // Turn GREEN LED off
ledBlue7.digitalWrite(0); // Turn BLUE LED off
ledRed8.digitalWrite(0); // Turn RED LED off
ledGreen8.digitalWrite(0); // Turn GREEN LED off
ledBlue8.digitalWrite(0); // Turn BLUE LED off

//Crear puerto serie
const SerialPort = require('serialport')

//SERIAL
//Enlistar puertos disponibles
SerialPort.list(function (err, results) {
    if (err) {
        throw err;
    }
    //console.log(results);
    console.log("Buscando controlador para conectarse...");
    //console.log(results);
    var i = 0;
    if (results.length > 0) {
      //Busco productId del Arduino Micro
      while (results[i].productId != 8037){
        i++;
        if (i == results.length) {
          console.log("Controlador no encontrado.");
          comPort = "undefined";
          throw err;
          break;
        }
      }
      var comPort = results[i].comName;
      console.log("Contolador encontrado en puerto " + results[i].comName);
      serialConnect (comPort);
    } else {
      console.log("No se han encontrado dispositivos");
    }
});


function serialConnect (com) {
  port = new SerialPort(com, {
    baudRate: 9600
  });
  //Mensaje al conectarse
  port.on('open', function() {
    //Despierto al Arduino
    port.write("Hola bebe hermoso");
    read();
    console.log("Conectado exitosamente. Esperando instrucciones beep boop");
  });

  port.on('close', function() {
    console.log("Se ha desconectado el controlador. Esta todo bien?");
    console.log("Reiniciar server para recuperar funcionalidad");
  });
}

function read () // for reading
{
    port.on('data', function(data)
    {
        console.log(data.toString());
    });
};


// Convierto el color a HSL (gracias xenozauros)
function hexToHSL(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    r = parseInt(result[1], 16);
    g = parseInt(result[2], 16);
    b = parseInt(result[3], 16);
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if(max == min){
      h = s = 0; // achromatic
    }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  var HSL = new Object();
  HSL['h']=h;
  HSL['s']=s;
  HSL['l']=l;
  return HSL;
}

function hexToRgb(hex,brillo) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16)*(brillo/100),
    g: parseInt(result[2], 16)*(brillo/100),
    b: parseInt(result[3], 16)*(brillo/100)
  } : null;
}


//Express
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/acercade', function (req, res) {
  res.sendFile(__dirname + '/acercade.html');
});
app.get('/altGUI_1', function (req, res) {
  res.sendFile(__dirname + '/altGUI_botones.html');
});
app.get('/RGB', function (req, res) {
  res.sendFile(__dirname + '/RGB.html');
});
app.get('/detailed', function (req, res) {
  res.sendFile(__dirname + '/detailed.html');
});
app.get('/background-image.png', function (req, res) {
  res.sendFile(__dirname + '/background-image.png');
});
app.get('/preloader.gif', function (req, res) {
  res.sendFile(__dirname + '/preloader.gif');
});
app.get('/threelines.png', function (req, res) {
  res.sendFile(__dirname + '/threelines.png');
});
app.get('/site.webmanifest', function (req, res) {
  res.sendFile(__dirname + '/site.webmanifest');
});
app.get('/favicon-32x32.png', function (req, res) {
  res.sendFile(__dirname + '/favicon-32x32.png');
});
app.get('/favicon-16x16.png', function (req, res) {
  res.sendFile(__dirname + '/favicon-16x16.png');
});
app.get('/apple-touch-icon.png', function (req, res) {
  res.sendFile(__dirname + '/apple-touch-icon.png');
});
app.get('/safari-pinned-tab.svg', function (req, res) {
  res.sendFile(__dirname + '/safari-pinned-tab.svg');
});


//Password check and cookie giver
app.post('/log', function (req, res) {
  var galleta = req.cookies;
  if (galleta.logged !== true) {
    //Should encrypt this
    if (req.body.log == 'colores') {
      console.log("Successful log");
      res.cookie('logged', 'true', { maxAge: 21600000, httpOnly: false });
      res.redirect(req.get('referer'));
    } else {
      console.log('Failed login attempt: ' + req.body.log);
      res.redirect(req.get('referer'));
    }
  } else {
    // yes, cookie was already present
    console.log('cookie exists', galleta);
    res.status(204).send();
  }
});



http.listen(4000, function () {
  console.log('Server corriendo en puerto 4000, bien hecho!');
});

//QUE HAGO CUANDO EL CLIENTE POSTEA
io.on('connection', function(socket){
  socket.on('update', function(msg){
    var color = hexToHSL(msg.color);
    var data = [msg.secuencia, msg.brillo,msg.velocidad,color.h.toFixed(2),color.s.toFixed(2),color.l.toFixed(2)];var mensaje = data.join();
    console.log("Enviando mensaje...");
    console.log(msg);
    if ( typeof port !== 'undefined') {
      port.write(mensaje);
      read();
      console.log("Mensaje enviado")
    } else {
      console.log("No hay dispositivo al que enviarle los datos.");
    };
  });

  socket.on('updateRGB', function(msg){
    var color = hexToRgb(msg.color,msg.brillo);
    var milis = 60000/msg.velocidad;
    console.log(msg);
    clearInterval(intervalo);
    switch (msg.secuencia) {
      case "1":
        ledRed1.pwmWrite(color.r.toFixed(0)); //set RED LED to specified value
        ledGreen1.pwmWrite(color.g.toFixed(0)); //set GREEN LED to specified value
        ledBlue1.pwmWrite(color.b.toFixed(0)); //set BLUE LED to specified value
        break;
      case "2":
        strobe(color,milis);
        break;
      case "3":
        pulse(color,milis);
      case "4":
        strobe2(color,milis);
    };
  });
});

function strobe(color,time) {
  intervalo = setInterval(function() {
    setTimeout(function() {
        ledRed1.pwmWrite(0); //set RED LED to specified value
        ledGreen1.pwmWrite(0); //set GREEN LED to specified value
        ledBlue1.pwmWrite(0); //set BLUE LED to specified value
    }, 10)
    setTimeout(function(){
      ledRed1.pwmWrite(color.r.toFixed(0)); //set RED LED to specified value
      ledGreen1.pwmWrite(color.g.toFixed(0)); //set GREEN LED to specified value
      ledBlue1.pwmWrite(color.b.toFixed(0)); //set BLUE LED to specified value
    }, time-10)
  }, time);

}

function strobe2(color,time) {
  intervalo = setInterval(function() {
    setInterval(function() {
      setTimeout(function() {
          ledRed1.pwmWrite(0); //set RED LED to specified value
          ledGreen1.pwmWrite(0); //set GREEN LED to specified value
          ledBlue1.pwmWrite(0); //set BLUE LED to specified value
      }, time/10);
      setTimeout(function(){
          ledRed1.pwmWrite(color.r.toFixed(0)); //set RED LED to specified value
          ledGreen1.pwmWrite(color.g.toFixed(0)); //set GREEN LED to specified value
          ledBlue1.pwmWrite(color.b.toFixed(0)); //set BLUE LED to specified value
      }, time/10);
    }, time/2);
  }, time);
}

function pulse(color,time) {
  clearInterval(intervalo);
  var pulsebrillo;
  intervalo = setInterval(function() {
    var date = new Date();
    pulsebrillo = -Math.abs(Math.sin(date.getTime()/time*2))+1;
    ledRed1.pwmWrite((color.r*pulsebrillo).toFixed(0)); //set RED LED to specified value
    ledGreen1.pwmWrite((color.g*pulsebrillo).toFixed(0)); //set GREEN LED to specified value
    ledBlue1.pwmWrite((color.b*pulsebrillo).toFixed(0)); //set BLUE LED to specified value
  }, 5);
}
