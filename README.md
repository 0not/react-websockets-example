Simple React and WebSockets Example
=====================================
This is a little project I threw together to teach myself about reactjs and websockets.
It is a very simple server/client example. The client (web browser) connects to a
websockets server. That server is monitoring a file. Whenever that file changes, the
server sends the contents to all listening clients. The clients then display that raw
content in an html `pre` tag.

Dependencies
------------
This project depends on:

* [ReactJS](https://facebook.github.io/react/docs/getting-started.html) - Follow the _Using React from npm_ section
* [event-emitter](https://www.npmjs.com/package/event-emitter)
* [ws](https://github.com/websockets/ws) - websocket library
* [fs](https://nodejs.org/api/fs.html) (node File System functions)

Optional dependencies:

* [http-server](https://github.com/indexzero/http-server)

server.js
---------
Run this file with `node server.js`. This server will monitor a file named
`contents.txt` for changes. Whenever a change is detected, it will send the new
file contents to the clients.

client.js
---------
Build this file with: `browserify -t [ babelify --presets [ react ] ] client.js -o bundle.js`.
The output (`bundle.js`) is then included in `index.html`.

index.html
----------
This is a very basic template that includes the source to `bundle.js` and the `div`
that will hold the react component's content.

How to use
----------
Make sure that the server and port are correct in `client.js`. Build `client.js`
using the command above (or your normal CommonJS to JS tool). Place the files
`bundle.js` and `index.html` in a directory served by an HTTP server. Alternatively,
you can run a lightweight server with `http-server -p 80` in the repository directory.
Start the websockets server with `node server.js` (keep `contents.txt` with
`server.js`). Open your browser to `index.html`. You should see the contents of
`contents.txt`. Update `contents.txt` and watch `index.html` change almost
instantly!
