const SerialPort = require('serialport')
const port = new SerialPort("COM11", {
  baudRate: 9600
});

function write(msg) //for writing
{
    port.on('data', function (data)
    {
        port.write(msg);
    });
}

function read () // for reading
{
    port.on('data', function(data)
    {
        console.log(data);
    });
}

port.on("open", function () {
    port.write(0x80);
    port.write('123456\r');
});
