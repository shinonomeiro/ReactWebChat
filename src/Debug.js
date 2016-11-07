import React, { Component } from 'react';

import { UserData } from './App';
import { MessageData } from './Chat';

import Utils from './Utils';
import Chat from './Chat';

class ModalSendMessageAsUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: null,
      text: ''
    };
  }

  handleUserChange(e) {
    this.setState({
      userName: e.target.value
    });
  }

  handleMessageChange(e) {
    this.setState({
      text: e.target.value
    });
  }

  handleSubmit(e) {
    const target = this.props.users.find(user => user.name === this.state.userName);
    this.props.onSendMessageAsUser(target, this.state.text);

    document.getElementById('send-message-modal-input').value = '';
  }

  getUserList() {
    return this.props.users.map(selected => {
      return (
        <option
          key={ selected.name }>
          { selected.name }
        </option>
      );
    });
  }

  render() {
    return(
      <div 
        id="send-message-modal" 
        className="modal fade" 
        role="dialog">
        <div className="modal-dialog modal-xs">

          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">[DEBUG] Send message as</h4>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="sel1">Select user:</label>
                <select 
                  className="form-control" 
                  id="sel1"
                  onChange={ this.handleUserChange.bind(this) }>
                  { this.getUserList() }
                </select>
              </div>
              <input 
                id="send-message-modal-input"
                type="text" 
                className="form-control" 
                placeholder="Input message..." 
                onChange={ this.handleMessageChange.bind(this) } />
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-default" 
                data-dismiss="modal">
                Close
              </button>
              <button 
                type="button" 
                className="btn btn-default" 
                data-dismiss="modal" 
                onClick={ this.handleSubmit.bind(this) }>
                Send
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

class ModalRemoveUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: ''
    };
  }

  handleUserChange(e) {
    this.setState({
      userName: e.target.value
    });
  }

  handleSubmit(e) {
    const target = this.props.users.find(user => user.name === this.state.userName);
    this.props.onUserRemove(target);
  }

  getUserList() {
    return this.props.users.map(selected => {
      return (
        <option
          key={ selected.name }>
          { selected.name }
        </option>
      );
    });
  }

  render() {
    return(
      <div 
        id="remove-user-modal" 
        className="modal fade" 
        role="dialog">
        <div className="modal-dialog modal-xs">

          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">[DEBUG] Remove user</h4>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="sel1">Select user:</label>
                <select 
                  className="form-control" 
                  id="sel1"
                  onChange={ this.handleUserChange.bind(this) }>
                  { this.getUserList() }
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-default" 
                data-dismiss="modal">
                Close
              </button>
              <button 
                type="button" 
                className="btn btn-default" 
                data-dismiss="modal" 
                onClick={ this.handleSubmit.bind(this) }>
                Remove
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

// Tabs for switching between rooms
class Debug extends Component {
  constructor(props) {
    super(props);

    this.addOffset = 0;
  }

  handleAddUsers(count) {
    for (let i=0; i<count; i++) {
      let name = `TestUser-${ this.addOffset + i }`;

      this.props.onAddUser(
        new UserData(name, `/avatars/00${ Utils.randomRange(0, 10) }.png`),
        Date.now()
      );
    }

    this.addOffset += 200;
  }

  handleRemoveUser(user) {
    this.props.onRemoveUser(user, Date.now());
  }

  handleSendMessageAsUser(user, message) {
    this.props.onSendMessage(user, message);
  }

  handleSendRandomMessages(count) {
    for (let i=0, text=''; i<count; i++) {

      for (let j=0; j<Utils.randomRange(10, 100); j++) {
        text += 'Boo ';
      }

      this.props.onSendMessage(this.props.myself, text + '!');
      text = '';
    }
  }

  render() {
    return(
      <div className="dropup">
        <button type="button" 
          className="btn btn-default dropdown-toggle" 
          data-toggle="dropdown">
          Debug
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          <li>
            <a 
              href="#" 
              onClick={ this.handleAddUsers.bind(this, 10) }>
              Add 10 users
            </a>
          </li>
          <li>
            <a 
              href='#'
              data-toggle="modal" 
              data-target="#remove-user-modal">
              Remove user
            </a>
          </li>
          <li>
            <a 
              href="#"
              data-toggle="modal" 
              data-target="#send-message-modal">
              Send message as user
            </a>
          </li>
          <li>
            <a 
              href='#' 
              onClick={ this.handleSendRandomMessages.bind(this, 10) }>
              Send 10 random messages
            </a>
          </li>
          <li>
            <a 
              href='#' 
              onClick={ this.handleSendRandomMessages.bind(this, 100) }>
              Send 100 random messages
            </a>
          </li>
        </ul>

        <ModalRemoveUser
          users={ this.props.data.current.users }
          onUserRemove={ this.handleRemoveUser.bind(this) } />

        <ModalSendMessageAsUser
          users={ this.props.data.current.users }
          onSendMessageAsUser={ this.handleSendMessageAsUser.bind(this) } />

      </div>
    )
  }
}

export default Debug;
