import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { Env } from './App'

// Login panel
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      userName: '',
      roomName: '',
      avatar: Env.pathToAvatars + '000.png'
    };
  }

  componentDidMount() {
    window.initBS();
  }

  handleNameChange(e) {
    this.setState({ userName: e.target.value })
  }

  handleRoomChange(e) {
    this.setState({ roomName: e.target.value })
  }

  handleAvatarChange(e) {
    const file = e.target.src.split('/').pop(); // Split absolute path (http://...)
    this.setState({ avatar: Env.pathToAvatars + file });
  }

  handleSubmit(e) {
    if (  this.state.userName
      &&  this.state.roomName
      &&  this.state.avatar) {

      this.props.onLogin(
        this.state.userName, 
        this.state.roomName, 
        this.state.avatar
      );
    }
  }

  getAvatarList() {
    let list = [];
    let cols = [[], [], []];

    for(let i=0; i<9; i++) {
      const path = Env.pathToAvatars + `00${ i }.png`;

      cols[Math.floor(i / 3)].push(
        <img 
          src={ path } 
          className="avatar-item"
          width="70px" 
          height="70px"
          key={ i } 
          onClick={ this.handleAvatarChange.bind(this) } />
      );
    }

    for(let j=0; j<3; j++) {
      list.push(
        <div 
          className="row"
          key={ j }>
          <div 
            className="col-xs-12">
            { cols[j] }
          </div>
        </div>
      );
    }

    return list;
  }

  render() {
    const avatar = this.state.avatar;

    return(
      <form>
        <div className="form-group">
          <label htmlFor="inputName">Name</label>
          <input 
            type="text" 
            className="form-control" 
            id="inputName" 
            onChange={ this.handleNameChange.bind(this) }
            placeholder="Pick a name..." />
        </div>
        <div className="form-group">
          <label htmlFor="chatroom">Chatroom</label>
          <input 
            type="text" 
            className="form-control" 
            id="chatroom"
            onChange={ this.handleRoomChange.bind(this) } 
            placeholder="Input room name..." />
        </div>
        <div className="form-group">
          <label htmlFor="chatroom">Avatar</label>
            <div className="dropdown">
              <img 
                src={ avatar }
                width="100px"
                height="100px"
                className="avatar-select dropdown-toggle" 
                data-toggle="dropdown" />
              <div className="dropdown-menu">
                { this.getAvatarList() }
              </div>
            </div>
        </div>
        <button 
          type="button" 
          className="btn btn-default" 
          onClick={ this.handleSubmit.bind(this) }>
          Join
        </button>
      </form>
    );
  }
}

export default Login;
