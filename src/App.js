import React, { Component } from 'react';

import Login from './Login'
import Chat from './Chat';

import './App.css';

// App
class App extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      isLoggedIn: false,
      userName: '',
      roomName: ''
    };
  }

  handleLogin(name, room) {
    this.setState({ 
      isLoggedIn: true,
      userName: name,
      roomName: room 
    });
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    const userName = 'Frank';//this.state.userName;
    const roomName = 'Buddies';//this.state.roomName;

    const panel = !isLoggedIn ? // FIXME
    <Chat userName={ userName } roomName={ roomName } /> : // FIXME
    <Login onLogin={ this.handleLogin.bind(this) } />;
 
    return(panel);
  }
}

export default App;
