// Browserify command to build client.js:
//     browserify -t [ babelify --presets [ react ] ] client.js -o bundle.js
var server    = 'bendito',
    port      = '8080',
    WebSocket = require('ws'),
    ws        = new WebSocket('ws://' + server + ':' + port),
    React     = require('react'),
    ReactDOM  = require('react-dom'),
    ee        = require('event-emitter'),
    emitter   = ee({}), listener;



// Websockets event handlers
// Send a simple message when the client connects
ws.onopen = function open() {
  ws.send('I connected.');
};

// Handle receiving a new message
ws.onmessage = function(data, flags) {
  // Emit a 'new-message' event so that the React class can intercept it
  // and update
  emitter.emit('new-message', data);
  // Log the new message for debugging, as well.
  console.log("New message", data);
};

// Our one and only React component. It handles spitting out the raw message
// data to the user.
var RawData = React.createClass({
  // This initial empty state is necessary. Without declaring som initial state
  // for data, the render function would fail.
  getInitialState: function () {
    return {data: []};
  },
  // This is called when the component is created for the first time. Here we
  // declare a 'new-message' event handler. Whenever this function intercepts
  // a 'new-message' event, it calls 'this.handleNewMessage'
  componentDidMount: function() {
    emitter.on('new-message', this.handleNewMessage);
  },
  // Here we set the state variable 'this.state.data' to contain 'message.data'.
  // If we wanted any of the message metadata, we could use that too.
  // When the state changes, React will re-render this component.
  handleNewMessage: function (message) {
    this.setState({data: message.data});
  },
  // This is called once when the component is removed. We turn off the event
  // handler since we don't want the event system to try and invoke
  // 'this.handleNewMessage' (since this component won't exist anymore).
  componentWillUnmount: function() {
    emitter.off('new-message', this.handleNewMessage);
  },
  // This is how React renders the component. In this case, the raw data is
  // rendered inside of <pre> tags. This is using the JSX syntax.
  render: function() {
    return <pre>{this.state.data}</pre>;
  }
});

// Putting together our component and telling React to render it as DOM.
// We are saying to React, "Render RawData inside the element with ID 'example'."
ReactDOM.render(
  <RawData />,
  document.getElementById('example')
);

