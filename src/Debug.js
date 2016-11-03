import React, { Component } from 'react';
import { UserData } from './App';

// Tabs for switching between rooms
class Debug extends Component {
  handleAddUsers(count) {
    for (let i=0; i<count; i++) {
      this.props.addUser(new UserData('Test', '/avatars/004.png'));
    }
  }

  handleRemoveUser(user) {
    this.props.removeUser(user);
  }

  handleSendMessageFromUser(user, message) {
    this.props.sendMessageFromUser(user, message);
  }

  handleSendRandomMessages(count) {
    for (let i=0; i<count; i++) {
      this.props.sendMessageFromUser(this.props.myself, 'Boo!');
    }
  }

  render() {
    return(
      <div className="dropdown">
        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">Debug<span className="caret"></span></button>
        <ul className="dropdown-menu">
          <li><a href="#" onClick={ this.handleAddUsers.bind(this, 10) }>Add 10 users</a></li>
          <li><a href="#" onClick={ this.handleAddUsers.bind(this, 100) }>Add 100 users</a></li>
          <li><a href='#' onClick={ this.handleRemoveUser.bind(this, this.props.data.current.users[0]) }>Remove user</a></li>
          <li><a href="#" onClick={ this.handleSendMessageFromUser.bind(this, this.props.data.current.users[0], 'Foo!') }>Send message from user</a></li>
          <li><a href='#' onClick={ this.handleSendRandomMessages.bind(this, 10) }>Send x random messages</a></li>
        </ul>
      </div>
    )
  }
}

export default Debug;

//new UserData('Bob', '/avatars/002.png'), 'Lorem ipsum blabla...'