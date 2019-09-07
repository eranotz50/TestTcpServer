var net = require('net');
const readline = require('readline');

net.Socket.prototype.Send = function (str){
  
    var buffer = new Buffer(str, "binary");

    //create a buffer with +4 bytes
    var consolidatedBuffer = new Buffer(4 + buffer.length);

    //write at the beginning of the buffer, the total size
    consolidatedBuffer.writeInt32BE(buffer.length, 0);

    //Copy the message buffer to the consolidated buffer at position 4     (after the 4 bytes about the size)
    buffer.copy(consolidatedBuffer, 4);

    //Send the consolidated buffer
    this.write(consolidatedBuffer, function(err) {
      if (err) {
          console.log(err)
      }        
    });
}

readline.emitKeypressEvents(process.stdin);
//process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  console.log(str);
  console.log(key);

  process.exit();
})


var HOST = '127.0.0.1';
var PORT = 6969;


net.createServer(function(sock) {
   console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    
   sock.on('error',function(err){
        console.log('ERROR -> ' + err);
   });

    sock.on('data', function(data) {
      console.log('DATA ' + sock.remoteAddress + ': ' + data);
      sock.write('You said "' + data + '"');
    });
    
   sock.on('close', function(data) {
     console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
   });

   sock.Send("Hello World or a JSON String");
  
  }).listen(PORT, HOST);

  console.log('Server listening on ' + HOST +':'+ PORT);

 