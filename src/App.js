import React, { Component } from 'react';

import Login from './Login'
import Chat from './Chat';

import './App.css';

function UserData(name, avatar) {
  this.name = name;
  this.avatar = avatar;
}

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
    const user = new UserData('Frank', '/avatars/001.png'); // TODO this.state.userName, this.state.avatar;
    const roomName = 'Buddies'; // TODO this.state.roomName;

    const panel = !isLoggedIn ? // FIXME
    <Chat user={ user } roomName={ roomName } /> : // FIXME
    <Login onLogin={ this.handleLogin.bind(this) } />;
 
    return(panel);
  }
}

export default App;
export { UserData };
