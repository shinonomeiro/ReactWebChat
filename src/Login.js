import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import Debug from './Debug'

// Login panel
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      userName: '',
      roomName: '' 
    };
  }

  handleNameChange(e) {
    this.setState({ userName: e.target.value })
  }

  handleRoomChange(e) {
    this.setState({ roomName: e.target.value })
  }

  handleSubmit(e) {
    this.props.onLogin(this.state.userName, this.state.roomName);
  }

  render() {
    return(
      <div className="container">
        <form>
          <div className="form-group">
            <label htmlFor="inputName">Name</label>
            <input 
              type="text" 
              className="form-control" 
              id="inputName" 
              // Need to bind for 'this' to refer to this Login instance
              // when called from the DOM element
              onChange={ this.handleNameChange.bind(this) }
              placeholder="Pick a name" />
          </div>
          <div className="form-group">
            <label htmlFor="chatroom">Chatroom</label>
            <input 
              type="text" 
              className="form-control" 
              id="chatroom"
              onChange={ this.handleRoomChange.bind(this) } 
              placeholder="Pick an initial room" />
          </div>
          <button 
            type="button" 
            className="btn btn-default" 
            onClick={ this.handleSubmit.bind(this) }>
            Join
          </button>
        </form>
      </div>
    );
  }
}

export default Login;