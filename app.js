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
var easymidi = require('easymidi');
var colorMIDI = {
  m: 1,
  r: 0,
  g: 0,
  b: 0,
  s: 20000,
  e: "0",
  p1: 0,
  p2: 0,
  p3: 0,
  p4: 0,
  p5: 0,
  p6: 0,
  p7: 0,
  p8: 0,
}
var tempMIDI = {
 m: 0,
 r: 0,
 b: 0,
 s: 1,
 e: 0
}
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

//Enlistar dispositivos MIDI
if (easymidi.getInputs().length>1) {
  console.log("Dispositivo MIDI conectado:");
  console.log(easymidi.getInputs()[1]);
  var input = new easymidi.Input(easymidi.getInputs()[1]);
} else {
  console.log("No hay dispositivo MIDI para conectarse");
}

//Controlador MIDI. Asumo los CC, cuando los conozca reemplazo
if (typeof input !== 'undefined') {
input.on('cc', function (msg) {
  clearInterval(intervalo);
  switch(msg.controller) {
    case 0:
      colorMIDI.m = msg.value/127;

      colorMIDI.r = msg.value*2*colorMIDI.m;
      break;
    case 1:
      colorMIDI.r = msg.value*2*colorMIDI.m;
      break;
    case 2:
      colorMIDI.g = msg.value*2*colorMIDI.m;
      break;
    case 3:
      colorMIDI.b = msg.value*2*colorMIDI.m;
      break;
    case 16:
      colorMIDI.p1 = msg.value;
      break;
    case 17:
      colorMIDI.p2 = msg.value;
      break;
    case 18:
      colorMIDI.p3 = msg.value;
      break;
    case 19:
      colorMIDI.p4 = msg.value;
      break;
    case 20:
      colorMIDI.p5 = msg.value;
      break;
    case 21:
      colorMIDI.p6 = msg.value;
      break;
    case 22:
      colorMIDI.p7 = msg.value;
      break;
    case 23:
      colorMIDI.p8 = msg.value;
      break;
    case 33:
       if (msg.value > 0) {
        tempMIDI.e = colorMIDI.e;
        tempMIDI.r = colorMIDI.r;
        colorMIDI.r = 255;
        colorMIDI.e = "1";
      } else {
        colorMIDI.e = tempMIDI.e;
        colorMIDI.r = tempMIDI.r;
      }
      break;
    case 34:
       if (msg.value > 0) {
        tempMIDI.e = colorMIDI.e;
        tempMIDI.g = colorMIDI.g;
        colorMIDI.g = 255;
        colorMIDI.e = "1";
      } else {
        colorMIDI.e = tempMIDI.e;
        colorMIDI.g = tempMIDI.g;
      }
      break;
    case 35:
       if (msg.value > 0) {
        tempMIDI.e = colorMIDI.e;
        tempMIDI.b = colorMIDI.b;
        colorMIDI.b = 255;
        colorMIDI.e = "1";
      } else {
        colorMIDI.e = tempMIDI.e;
        colorMIDI.b = tempMIDI.b;
      }
      break;
    case 64:
      if (msg.value > 0) {
        tempMIDI.m = colorMIDI.m;
        colorMIDI.m = msg.value*2;
      } else {
        colorMIDI.m = tempMIDI.m;
      }
      break;
    case 48:
      if (msg.value > 0) {
        tempMIDI.m = colorMIDI.m;
        colorMIDI.m = 0;
      } else {
        colorMIDI.m = tempMIDI.m;
      }
      break;
    case 65:
      if (msg.value > 0) {
        tempMIDI.r = colorMIDI.r;
	colorMIDI.r = msg.value*2;
      } else {
	colorMIDI.r = tempMIDI.r;
      }
      break;
    case 49:
      if (msg.value > 0) {
        tempMIDI.r = colorMIDI.r;
        colorMIDI.r = 0;
      } else {
        colorMIDI.r = tempMIDI.r;
      }
      break;
    case 66:
      if (msg.value > 0) {
        tempMIDI.g = colorMIDI.g;
        colorMIDI.g = msg.value*2;
      } else {
        colorMIDI.g = tempMIDI.g;
      }
      break;
    case 50:
      if (msg.value > 0) {
        tempMIDI.g = colorMIDI.g;
        colorMIDI.g = 0;
      } else {
        colorMIDI.g = tempMIDI.g;
      }
      break;
    case 67:
      if (msg.value > 0) {
        tempMIDI.b = colorMIDI.b;
        colorMIDI.b = msg.value*2;
      } else {
        colorMIDI.b = tempMIDI.b;
      }
      break;
    case 51:
      if (msg.value > 0) {
        tempMIDI.b = colorMIDI.b;
        colorMIDI.b = 0;
      } else {
        colorMIDI.b = tempMIDI.b;
      }
      break;
    case 68:
      if (msg.value > 0) {
        tempMIDI.s = colorMIDI.s;
        colorMIDI.s = 20000/127;
      } else {
        colorMIDI.s = tempMIDI.s;
      }
      break;
    case 4:
      colorMIDI.s = 20000/(1+msg.value);
      break;
    case 69:
      if (msg.value > 0) {
        tempMIDI.e = colorMIDI.e;
        colorMIDI.e = "1";
      } else {
        colorMIDI.e = tempMIDI.e;
      }
      break;
    case 5:
      colorMIDI.e = (msg.value/25).toFixed(0);
      break;
    case 6:
      colorMIDI.e = (6+msg.value/25).toFixed(0);
      break;
  }
  switch(colorMIDI.e) {
    case "0":
      solid(colorMIDI);
      var color = rgbToHsl(colorMIDI);
      var data = ["1", colorMIDI.m,colorMIDI.s,color.h.toFixed(2),color.s.toFixed(2),color.l.toFixed(2)];
      var mensaje = data.join();
      console.log("Enviando mensaje a Arduino...");
      if ( typeof port !== 'undefined') {
        port.write(mensaje);
        read();
        console.log("Mensaje enviado")
      } else {
        console.log("No hay dispositivo al que enviarle los datos.");
      };
      break;
    case "1":
      strobe(colorMIDI,colorMIDI.s);
      var color = rgbToHsl(colorMIDI);
      var data = ["2", colorMIDI.m,colorMIDI.s,color.h.toFixed(2),color.s.toFixed(2),color.l.toFixed(2)];
      var mensaje = data.join();
      console.log("Enviando mensaje a Arduino...");
      if ( typeof port !== 'undefined') {
        port.write(mensaje);
        read();
        console.log("Mensaje enviado")
      } else {
        console.log("No hay dispositivo al que enviarle los datos.");
      };
      break;
    case "2":
      pulse(colorMIDI,colorMIDI.s);
      break;
    case "3":
      pulseSweep(colorMIDI,colorMIDI.s);
      break;
    case "5":
      rando(colorMIDI,colorMIDI.s);
      var color = rgbToHsl(colorMIDI);
      var data = ["3", colorMIDI.m,colorMIDI.s,color.h.toFixed(2),color.s.toFixed(2),color.l.toFixed(2)];
      var mensaje = data.join();
      console.log("Enviando mensaje a Arduino...");
      if ( typeof port !== 'undefined') {
        port.write(mensaje);
        read();
        console.log("Mensaje enviado")
      } else {
        console.log("No hay dispositivo al que enviarle los datos.");
      };

      break;
    case "4":
      rainbow(colorMIDI,colorMIDI.s);
      break;
    case "6":
      rotation(colorMIDI,colorMIDI.s,colorMIDI.p1);
      break;
  }
  console.log(colorMIDI.e);
 });
}
//QUE HAGO CUANDO EL CLIENTE POSTEA
io.on('connection', function(socket){
  socket.on('update', function(msg){
    var color = hexToHSL(msg.color);
    var data = [msg.secuencia, msg.brillo,msg.velocidad,color.h.toFixed(2),color.s.toFixed(2),color.l.toFixed(2)];
    var mensaje = data.join();
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
	solid(color);
        break;
      case "2":
        strobe(color,milis);
        break;
      case "3":
	pulse(color,milis);
	break;
      case "4":
	pulseSweep(color,milis);
	break;
      case "5":
	rainbow(color,milis);
	break;
      case "6":
	rando(color,milis);
	break;
    };
  });
});


function strobe(color,time) {
  var toggle;
  intervalo = setInterval(function() {
    var date = new Date();
    toggle = Math.sin(10*date.getTime()/(1+time));
    if(toggle<0.9) {
      setLED(0,0,0,0);
      setLED(1,0,0,0);
      setLED(2,0,0,0);
      setLED(3,0,0,0);
      setLED(4,0,0,0);
      setLED(5,0,0,0);
      setLED(6,0,0,0);
      setLED(7,0,0,0);
    }
    if(toggle>0.9){
      setLED(0,color.r,color.g,color.b);
      setLED(1,color.r,color.g,color.b);
      setLED(2,color.r,color.g,color.b);
      setLED(3,color.r,color.g,color.b);
      setLED(4,color.r,color.g,color.b);
      setLED(5,color.r,color.g,color.b);
      setLED(6,color.r,color.g,color.b);
      setLED(7,color.r,color.g,color.b);

    }
  }, 16);
}

function pulseSweep(color,time) {
  var pulsebrillo;
  intervalo = setInterval(function() {
    var date = new Date();
    pulsebrillo1 = -Math.abs(Math.sin(date.getTime()/time*2))+1;
    setLED(0,color.r*pulsebrillo1,color.g*pulsebrillo1,color.b*pulsebrillo1);
    pulsebrillo2 = -Math.abs(Math.sin(0.785+date.getTime()/time*2))+1;
    setLED(1,color.r*pulsebrillo2,color.g*pulsebrillo2,color.b*pulsebrillo2);
    pulsebrillo3 = -Math.abs(Math.sin(1.57+date.getTime()/time*2))+1;
    setLED(2,color.r*pulsebrillo3,color.g*pulsebrillo3,color.b*pulsebrillo3);
    pulsebrillo4 = -Math.abs(Math.sin(2.356+date.getTime()/time*2))+1;
    setLED(3,color.r*pulsebrillo4,color.g*pulsebrillo4,color.b*pulsebrillo4);
    pulsebrillo5 = -Math.abs(Math.sin(3.1415+date.getTime()/time*2))+1;
    setLED(4,color.r*pulsebrillo5,color.g*pulsebrillo5,color.b*pulsebrillo5);
    pulsebrillo6 = -Math.abs(Math.sin(3.927+date.getTime()/time*2))+1;
    setLED(5,color.r*pulsebrillo6,color.g*pulsebrillo6,color.b*pulsebrillo6);
    pulsebrillo7 = -Math.abs(Math.sin(4.712+date.getTime()/time*2))+1;
    setLED(6,color.r*pulsebrillo7,color.g*pulsebrillo7,color.b*pulsebrillo7);
    pulsebrillo8 = -Math.abs(Math.sin(5.498+date.getTime()/time*2))+1;
    setLED(7,color.r*pulsebrillo8,color.g*pulsebrillo8,color.b*pulsebrillo8);
  }, 16);
}

function pulse(color,time) {
  var pulsebrillo;
  intervalo = setInterval(function() {
    var date = new Date();
    pulsebrillo = -Math.abs(Math.sin(date.getTime()/time*2))+1;
    setLED(0,color.r*pulsebrillo,color.g*pulsebrillo,color.b*pulsebrillo);
    setLED(1,color.r*pulsebrillo,color.g*pulsebrillo,color.b*pulsebrillo);
    setLED(2,color.r*pulsebrillo,color.g*pulsebrillo,color.b*pulsebrillo);
    setLED(3,color.r*pulsebrillo,color.g*pulsebrillo,color.b*pulsebrillo);
    setLED(4,color.r*pulsebrillo,color.g*pulsebrillo,color.b*pulsebrillo);
    setLED(5,color.r*pulsebrillo,color.g*pulsebrillo,color.b*pulsebrillo);
    setLED(6,color.r*pulsebrillo,color.g*pulsebrillo,color.b*pulsebrillo);
    setLED(7,color.r*pulsebrillo,color.g*pulsebrillo,color.b*pulsebrillo);
  }, 16);
}

function rainbow(color,time) {
  var pulseR, pulseG, pulseB;
  intervalo = setInterval(function() {
    var date = new Date();
    pulseR = -Math.abs(Math.sin(date.getTime()/time*2))+1;
    pulseG = -Math.abs(Math.sin(2.094+date.getTime()/time*2))+1;
    pulseB = -Math.abs(Math.sin(4.189+date.getTime()/time*2))+1;
    pulsebrillo1 = -Math.abs(Math.sin(date.getTime()/time*2))+1;
    setLED(0,color.r*pulseR,color.g*pulseG,color.b*pulseB);
    pulsebrillo2 = -Math.abs(Math.sin(0.785+date.getTime()/time*2))+1;
    setLED(1,color.r*pulseR,color.g*pulseG,color.b*pulseB);
    pulsebrillo3 = -Math.abs(Math.sin(1.57+date.getTime()/time*2))+1;
    setLED(2,color.r*pulseR,color.g*pulseG,color.b*pulseB);
    pulsebrillo4 = -Math.abs(Math.sin(2.356+date.getTime()/time*2))+1;
    setLED(3,color.r*pulseR,color.g*pulseG,color.b*pulseB);
    pulsebrillo5 = -Math.abs(Math.sin(3.1415+date.getTime()/time*2))+1;
    setLED(4,color.r*pulseR,color.g*pulseG,color.b*pulseB);
    pulsebrillo6 = -Math.abs(Math.sin(3.927+date.getTime()/time*2))+1;
    setLED(5,color.r*pulseR,color.g*pulseG,color.b*pulseB);
    pulsebrillo7 = -Math.abs(Math.sin(4.712+date.getTime()/time*2))+1;
    setLED(6,color.r*pulseR,color.g*pulseG,color.b*pulseB);
    pulsebrillo8 = -Math.abs(Math.sin(5.498+date.getTime()/time*2))+1;
    setLED(7,color.r*pulseR,color.g*pulseG,color.b*pulseB);
  }, 16);
}

function solid(color) {
  setLED(0,color.r,color.g,color.b);
  setLED(1,color.r,color.g,color.b);
  setLED(2,color.r,color.g,color.b);
  setLED(3,color.r,color.g,color.b);
  setLED(4,color.r,color.g,color.b);
  setLED(5,color.r,color.g,color.b);
  setLED(6,color.r,color.g,color.b);
  setLED(7,color.r,color.g,color.b);
}

function rando(color,milis) {
  intervalo = setInterval(function() {
    var tira = Math.floor(Math.random() * 8);
    switch(tira) {
      case 0:
        setLED(0,color.r,color.g,color.b);
        setLED(1,0,0,0);
        setLED(2,0,0,0);
        setLED(3,0,0,0);
        setLED(4,0,0,0);
        setLED(5,0,0,0);
        setLED(6,0,0,0);
        setLED(7,0,0,0);
        break;
      case 1:
        setLED(1,color.r,color.g,color.b);
        setLED(0,0,0,0);
        setLED(2,0,0,0);
        setLED(3,0,0,0);
        setLED(4,0,0,0);
        setLED(5,0,0,0);
        setLED(6,0,0,0);
        setLED(7,0,0,0);
        break;
      case 2:
        setLED(2,color.r,color.g,color.b);
        setLED(1,0,0,0);
        setLED(0,0,0,0);
        setLED(3,0,0,0);
        setLED(4,0,0,0);
        setLED(5,0,0,0);
        setLED(6,0,0,0);
        setLED(7,0,0,0);
        break;
      case 3:
        setLED(3,color.r,color.g,color.b);
        setLED(1,0,0,0);
        setLED(2,0,0,0);
        setLED(0,0,0,0);
        setLED(4,0,0,0);
        setLED(5,0,0,0);
        setLED(6,0,0,0);
        setLED(7,0,0,0);
        break;
      case 4:
        setLED(4,color.r,color.g,color.b);
        setLED(1,0,0,0);
        setLED(2,0,0,0);
        setLED(3,0,0,0);
        setLED(0,0,0,0);
        setLED(5,0,0,0);
        setLED(6,0,0,0);
        setLED(7,0,0,0);
        break;
      case 5:
        setLED(5,color.r,color.g,color.b);
        setLED(1,0,0,0);
        setLED(2,0,0,0);
        setLED(3,0,0,0);
        setLED(4,0,0,0);
        setLED(0,0,0,0);
        setLED(6,0,0,0);
        setLED(7,0,0,0);
        break;
      case 6:
        setLED(6,color.r,color.g,color.b);
        setLED(1,0,0,0);
        setLED(2,0,0,0);
        setLED(3,0,0,0);
        setLED(4,0,0,0);
        setLED(5,0,0,0);
        setLED(0,0,0,0);
        setLED(7,0,0,0);
        break;
      case 7:
        setLED(7,color.r,color.g,color.b);
        setLED(1,0,0,0);
        setLED(2,0,0,0);
        setLED(3,0,0,0);
        setLED(4,0,0,0);
        setLED(5,0,0,0);
        setLED(6,0,0,0);
        setLED(0,0,0,0);
        break;
      case 8:
        setLED(0,0,0,0);
        setLED(1,0,0,0);
        setLED(2,0,0,0);
        setLED(3,0,0,0);
        setLED(4,0,0,0);
        setLED(5,0,0,0);
        setLED(6,0,0,0);
        setLED(7,0,0,0);
        break;
    }
    setTimeout(function() {
      setLED(0,0,0,0);
      setLED(1,0,0,0);
      setLED(2,0,0,0);
      setLED(3,0,0,0);
      setLED(4,0,0,0);
      setLED(5,0,0,0);
      setLED(6,0,0,0);
      setLED(7,0,0,0);
    }, 16);
  }, milis/4);
}

function rotation(color,time,param) {
  intervalo = setInterval(function() {
    var date = new Date();
    setLED(0,0,0,0);
    setLED(1,0,0,0);
    setLED(2,0,0,0);
    setLED(3,0,0,0);
    setLED(4,0,0,0);
    setLED(5,0,0,0);
    setLED(6,0,0,0);
    setLED(7,0,0,0);
    var led = ((date.getTime()/time*4)%7).toFixed(0);
    setLED(Number(led),color.r,color.g,color.b);
  }, time/4);
}

function setLED(tira,colorR,colorG,colorB) {
  switch (tira) {
    case 0:
      ledRed1.pwmWrite(colorR.toFixed(0));
      ledGreen1.pwmWrite(colorG.toFixed(0));
      ledBlue1.pwmWrite(colorB.toFixed(0));
      break;
    case 1:
      ledRed2.pwmWrite(colorR.toFixed(0));
      ledGreen2.pwmWrite(colorG.toFixed(0));
      ledBlue2.pwmWrite(colorB.toFixed(0));
      break;
    case 2:
      ledRed3.pwmWrite(colorR.toFixed(0));
      ledGreen3.pwmWrite(colorG.toFixed(0));
      ledBlue3.pwmWrite(colorB.toFixed(0));
      break;
    case 3:
      ledRed4.pwmWrite(colorR.toFixed(0));
      ledGreen4.pwmWrite(colorG.toFixed(0));
      ledBlue4.pwmWrite(colorB.toFixed(0));
      break;
    case 4:
      ledRed5.pwmWrite(colorR.toFixed(0));
      ledGreen5.pwmWrite(colorG.toFixed(0));
      ledBlue5.pwmWrite(colorB.toFixed(0));
      break;
    case 5:
      ledRed6.pwmWrite(colorR.toFixed(0));
      ledGreen6.pwmWrite(colorG.toFixed(0));
      ledBlue6.pwmWrite(colorB.toFixed(0));
      break;
    case 6:
      ledRed7.pwmWrite(colorR.toFixed(0));
      ledGreen7.pwmWrite(colorG.toFixed(0));
      ledBlue7.pwmWrite(colorB.toFixed(0));
      break;
    case 7:
      ledRed8.pwmWrite(colorR.toFixed(0));
      ledGreen8.pwmWrite(colorG.toFixed(0));
      ledBlue8.pwmWrite(colorB.toFixed(0));
      break;
    default:
      console.log( tira + " no es tira");
      break;
  }
}

