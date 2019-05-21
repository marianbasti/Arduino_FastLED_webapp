var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

//Crear puerto serie
const SerialPort = require('serialport')
const port = new SerialPort("COM11", {
  baudRate: 9600
});

//SERIAL
//Enlistar puertos disponibles
SerialPort.list(function (err, results) {
    if (err) {
        throw err;
    }
    //console.log(results);
    console.log("Buscando controlador para conectarse.");
    var i = 0;
    while (results[i].productId != 8037){
      i++;
      if (i == 40) {
        console.log("Controlador no encontrado.");
        throw err;
        break;
      }
    }
    console.log("Contolador encontrado en puerto " + results[i].comName);
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

function read () // for reading
{
    port.on('data', function(data)
    {
        console.log(data.toString());
    });
}



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



//Express
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/background-image.png', function (req, res) {
  res.sendFile(__dirname + '/background-image.png');
});



app.listen(4000, function () {
  console.log('Server corriendo en puerto 4000, bien hecho!');
});

//QUE HAGO CUANDO EL CLIENTE POSTEA
app.post('/', function(req, res) {
  //logueo que secuencia, velocidad y color pide el usuario
  console.log("Secuencia: " + req.body.secuencia);
  console.log("brillo: " + req.body.brillo);
  var brillo = req.body.brillo/100;
  console.log("Velocidad " + req.body.velocidad + "BPM");
  var color = hexToHSL(req.body.color)
  console.log(color);
  var data = [req.body.secuencia,brillo.toFixed(2),req.body.velocidad,color.h.toFixed(2),color.s.toFixed(2),color.l.toFixed(2)];
  var mensaje = data.join();
  //console.log(mensaje);
  port.write(mensaje);
  read();
  res.status(204).send();
});
