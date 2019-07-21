var pulsebrillo;
intervalo = setInterval(function() {
  var date = new Date();
  pulsebrillo = -Math.abs(Math.sin(date.getTime()/1000))+1;
  console.log(pulsebrillo);
}, 1);
