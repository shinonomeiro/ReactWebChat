import React, { Component } from 'react';

import Login from './Login'
import Chat from './Chat';

import './App.css';

function Env() {

}

Env.pathToAvatars = '/avatars/';
Env.pathToStickers = '/stickers/';

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

  componentDidMount() {

    // FOR DEBUG //
    this.setState({
      isLoggedIn: true,
      userName: 'Frank',
      roomName: 'Buddies',
      avatar: '/avatars/001.png'  
    });
    // // // //
  }

  handleLogin(name, room, avatar) {
    this.setState({ 
      isLoggedIn: true,
      userName: name,
      roomName: room, 
      avatar: avatar
    });
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    const user = new UserData(this.state.userName, this.state.avatar);
    const roomName = this.state.roomName;
    const avatar = this.state.avatar;

    const panel = isLoggedIn ? 
    <Chat user={ user } roomName={ roomName } /> : 
    <Login onLogin={ this.handleLogin.bind(this) } />;
 
    return(panel);
  }
}

export default App;
export { Env };
export { UserData };
