// Run this server with: node server.js

var filename = "contents.txt",
    port     = 8080,
    wsserv   = require('ws').Server,
    wss      = new wsserv({port: port}),
    fs       = require('fs'),
    ee       = require('event-emitter'),
    emitter  = ee({}), listener;

// Watch the file, emit 'file-changed' event on change.
// Contents might not have changed. Could just be time.
// TODO Check for content difference
var watcher = fs.watch(filename, function (event, filename) {
  if (event == 'change') {
    emitter.emit('file-changed', filename);
  }
});

// Event handler for when the server recieves a connection
wss.on('connection', function connection(ws) {
  // Log all incoming messages to the console.
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  // When a client connects, log to console
  ws.on('open', function () {
    console.log("New client");
  });

  // When a client leaves, log to console.
  ws.on('close', function () {
    console.log("Client left.");
  });

  // Read the file and send its contents to all clients
  var rf = function() {
    fs.readFile(filename, 'utf8', function(err, data) {
      if (err) throw err;
      ws.send(data, function ack(error) {
        if (error) console.log(error);
      });
    });
  }

  // Send the current contents on a new connection
  rf();

  // Listens for the 'file-changed' event. Reads file and sends to clients.
  emitter.on('file-changed', function(filename) {
    rf();
  })
  
});
