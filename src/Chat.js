import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { Env } from './App';
import { UserData } from './App'
import Debug from './Debug'

// Modal (popup) prompting user to input room name
class ModalRoomJoin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roomName: ''
        };
    }

    handleChange(e) {
        this.setState({
            roomName: e.target.value
        });
    }

    handleRoomJoin(e) {
        if (this.state.roomName) {

            /* There is a strange bug with this operation where the
            previous input remains visible but is in fact an empty string.
            It does no harm so I'm just leaving it here */
            this.setState({
            roomName: ''
        });

            // Perhaps because the modal closes itself before the next render routine ?

            // So force clear the input field instead
        document.getElementById('room-join-modal-input').value = '';

            this.props.onRoomJoin(this.state.roomName);
        }
    }

    render() {
        return(
            <div
                id="room-join-modal"
                className="modal fade"
                role="dialog">
              <div className="modal-dialog modal-xs">

                <div className="modal-content">
                  <div className="modal-header">
                    <button
                        type="button"
                        className="close"
                        data-dismiss="modal">
                        &times;
                    </button>
                    <h4 className="modal-title">Room</h4>
                  </div>
                  <div className="modal-body">
                    <input
                        id="room-join-modal-input"
                      type="text"
                      className="form-control"
                      placeholder="Room name..."
                      onChange={ this.handleChange.bind(this) } />
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
                        onClick={ this.handleRoomJoin.bind(this) }>
                        Join
                    </button>
                  </div>
                </div>

              </div>
            </div>
        );
    }
}

// Tabs for switching between rooms + room join/leave
class Tabs extends Component {
    constructor(props) {
        super(props);
    }

  handleRoomChange(room) {
    this.props.onRoomChange(room);
  }

  handleRoomLeave(e) {
    this.props.onRoomLeave();
  }

    getRoomNames() {
        let roomNames = this.props.rooms.map(room =>
      <li
        role="presentation"
        key={ room.name }
        className={ room === this.props.current ? "active" : "" }>
        <a href="#" onClick={ this.handleRoomChange.bind(this, room) }>{ room.name }</a>
      </li>);

        return roomNames;
    }

  getUserList() {
    const users = this.props.current.users;
    let users_li = [];

    users.map((user, index) => {
        const avatarImg =
            <img
                src={ user.avatar }
                alt="(´Д`|||)"
                width="30px"
                height="30px" />

        if (user.name === this.props.user.name) {
            users_li.push(
            <li
                key={ index }>
                { avatarImg }
                <strong>
                    { user.name }
                </strong>
            </li>);
        } else {
            users_li.push(
            <li
                key={ index }>
                { avatarImg }
                { user.name }
            </li>);
        }
    });

    return users_li;
    }

  render() {
    return(
        <div>
          <ul className="nav nav-tabs">
            { this.getRoomNames() }
            <li
              role="presentation"
              key={ 'join' }>
              <a href="#"
                    data-toggle="modal"
                    data-target="#room-join-modal">
                [+]
              </a>
          </li>
          <li
              role="presentation"
              key={ 'leave' }
              className={ this.props.rooms.length > 0 ? "" : "disabled" }
                    onClick={ this.handleRoomLeave.bind(this) }>
              <a href="#">[-]</a>
          </li>
            <li
                role="presentation"
                className="dropdown pull-right"
                key={ 'userlist' }>
            <a
                href="#"
                data-toggle="dropdown">
                <span className="glyphicon glyphicon-user"></span>
            </a>
            <ul className="dropdown-menu userlist">
              { this.getUserList() }
            </ul>
            </li>
          </ul>
      </div>
    )
  }
}

// Chat view (message list, scrollable)
class ChatPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
      <div
        className="body-panel"
        id="scrollable">
        <ReactCSSTransitionGroup
          transitionName="messageFade"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={100}>
          { this.props.messagesAsJsx }
        </ReactCSSTransitionGroup>
      </div>
    );
    }
}

ChatPanel.updateScrollBar = (messageId) => {
  const s = document.getElementById('scrollable');
  const scrollBottom = s.scrollHeight - s.scrollTop - s.clientHeight;
  const m = document.getElementById('message-' + messageId);

  // If scrollview is already at the bottom
  if (scrollBottom < m.clientHeight + 20) {
    // Move alongside to display the new message
    s.scrollTop = s.scrollHeight;
  }
}

function formatTimestamp(time) {
  let label;
  if (time >= 60 * 24) {
    label = 'day';
  } else if (time >= 60) {
    label = 'hour';
  } else if (time >= 1) {
    label = 'min'
  } else {
    return 'now'; // Bail out early
  }

    if (time >= (60 * 24)) {
    time = Math.floor(time / (60 * 24)); // mins -> days
  } else if (time >= 60) {
    time = Math.floor(time / 60); // mins -> hours
  }

  if (time > 1) {
    label += 's';
  }

  return `${time} ${label} ago`;
}

function Message(props) {
    return(
        <div
      className={ 'media ' + props.type }
      id={ "message-" + props.id }>
      { props.children }
    </div>
    );
}

function UserTextMessage(props) {
  return(
    <div className="well message-text">{ props.message }</div>
  );
}

function UserStampMessage(props) {
  return(
    <div>
      <img
        src={ props.message }
        alt="(´Д`|||)"
        className="message-stamp" />
    </div>
  );
}

class UserMessage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    ChatPanel.updateScrollBar(this.props.id);
  }

  render() {
    const MessageType = this.props.type;

    return(
        <Message
        type="user-message"
        id={ this.props.id }>
        { !this.props.isMyMessage &&
        <div className="media-left">
          <img
            src={ this.props.user.avatar }
            alt="(´Д`|||)"
            className="img-circle avatar" />
        </div>
        }
        <div className="media-body">
          <span><strong>{ this.props.user.name }</strong></span>
          <small className="pull-right text-muted">
            <span className="glyphicon glyphicon-time"></span>
            { formatTimestamp(this.props.time) }
          </small>
          <MessageType
            message={ this.props.message } />
        </div>
        { this.props.isMyMessage &&
        <div className="media-right">
          <img
            src={ this.props.user.avatar }
            alt="(´Д`|||)"
            className="img-circle avatar" />
        </div>
        }
      </Message>
    );
  }
}

function JoinEventMessage(props) {
  return(
    <span style={{ color: 'green' }}>{ props.name } has joined the room.</span>
  );
}

function QuitEventMessage(props) {
  return(
    <span style={{ color: 'gray' }}>{ props.name } has left the roonm.</span>
  );
}

// Chat events such as join, quit, etc.
class EventMessage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        ChatPanel.updateScrollBar(this.props.id);
    }

    render() {
    const MessageType = this.props.type;

        return(
      <Message
        type="event-message"
        id={ this.props.id }>
        <div className="media-body">
          <img
            src={ this.props.user.avatar }
            alt="(´Д`|||)"
            width="30px"
            height="30px" />
          <MessageType
            name={ this.props.user.name } />
        </div>
      </Message>
    );
    }
}

// Input field for message
class InputField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ''
    }
  }

  handleChange(e) {
    this.setState({
      message: e.target.value
    });
  }

  handleSendMessage(e) {
    e.preventDefault();
    if (this.state.message) {

      this.props.onSendMessage(
        this.props.myself,
        UserTextMessage,
        this.state.message,
        this.handleSendSuccess.bind(this));
    }
  }

  getStampList() { // Same as Login screen's, consider refactoring
    let list = [];
    let cols = [[], [], []];

    for(let i=0; i<9; i++) {
      const path = Env.pathToStickers + `00${ i }.png`;

      cols[Math.floor(i / 3)].push(
        <img
          src={ path }
          className="avatar-item"
          width="70px"
          height="70px"
          key={ i }
          onClick={ this.handleSendStamp.bind(this) } />
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

  handleSendStamp(e) {
    const stamp = e.target.src.split('/').pop();
    const path = Env.pathToStickers + stamp;

    this.props.onSendMessage(
      this.props.myself,
      UserStampMessage,
      path,
      null);
  }

  // Callback handler, called by <Chat>
  handleSendSuccess(success) {
    if (success) {
      // Clear input field
        this.setState({
            message: ''
        });
    }
  }

  render() {
    return(
      <form action="#" onSubmit={ this.handleSendMessage.bind(this) }>
        <div className={ 'input-group' + (this.props.rooms.length > 0 ? '' : ' hidden') }>
          <input
            type="text"
            className="form-control"
            placeholder="Write a message..."
            value={ this.state.message }
            onChange={ this.handleChange.bind(this) } />
          <span className="input-group-btn dropup">
            <button
              type="button"
              className="btn btn-default"
              data-toggle="dropdown">
              <span className="glyphicon glyphicon-star"></span>
            </button>
            <button
              type="submit"
              className="btn btn-default">
              Send
            </button>
            <div className="dropdown-menu pull-right">
              { this.getStampList() }
            </div>
          </span>
        </div>
      </form>
    )
  }
}

function RoomData(name, users, scrollState) {
  this.name = name;
  this.users = users;
  this.messages = [];
  this.messagesAsJsx = [];

  // Offset in px from bottom of scroll view
  this.scrollState = scrollState || 0;
}

function MessageData(sender, type, text, time) {
  this.sender = sender;
  this.type = type;
  this.text = text;
  this.time = time;
}

// Chat view controller
class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rooms: [],
      // Dummy room needed for proper initialization
      current: new RoomData(null, []),
      now: Date.now()
    };

    this.timer = null;
  }

  componentDidMount() {
    // Initialize Bootstrap's tooltips and popovers (required)
    window.initBS();

    // Join the room user has picked on Login screen
    this.handleRoomJoin(this.props.roomName);

    // Timer to refresh the message timestamps
    this.timer = setInterval(() => this.setState({ now: Date.now() }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleRoomChange(room) {
    let s = document.getElementById('scrollable');
    const current = this.state.current;

    // Save the state
    current.scrollState = s.scrollHeight - s.scrollTop - s.clientHeight;

    this.setState({
      current: room
    });

    // Restore the scrollbar position to its saved position

    // Got to use the hack below because React doesn't
    // seem to provide any "post-render" facility.

    let updateScrollBar = () => {
        s = document.getElementById('scrollable');
          s.scrollTop = s.scrollHeight - this.state.current.scrollState - s.clientHeight;
      };

      // Hard-coded value, could do better but for now it works
    setTimeout(updateScrollBar, 50);

    //                      Current
    // Previous room ----> [ New room ]
  }

  handleRoomJoin(roomName) {
    /*
    Should in practice be querying for an existing room
    and create an empty one only if the former can't be found.
    But for the sake of this exercice, let's just init a new one every time.
    */

    // Failsafe (validation handled by <ModalRoomJoin>)
    if (this.state.rooms.find(room => room.name === roomName)) {
        console.error('[Chat] Room already joined');
        return;
    }

    const room = new RoomData(roomName, [this.props.user]);
    const roomsList = this.state.rooms;
    roomsList.push(room);

    this.setState({
      rooms: roomsList,
      current: room
    });
  }

  handleRoomLeave() {
    // Failsafe (validation handled by <Tab>)
    if (this.state.rooms.length < 1) {
        console.error('[Chat] No room to leave');
        return;
    }

    const current = this.state.current;
    const roomsList = this.state.rooms;
    const index = roomsList.indexOf(current);
    roomsList.splice(index, 1);

    let newCurrent;

    if (roomsList.length === 0) {
        // Create dummy room
            newCurrent = new RoomData(null, []);
        } else if (index === 0) {
            newCurrent = roomsList[0];
        } else if (index === roomsList.length - 1) {
            // Switch to the room that was to the right
            newCurrent = roomsList[index];
        } else {
            // Switch to the room that was to the left
            newCurrent = roomsList[index - 1];
        }

    this.setState({
        rooms: roomsList,
        current: newCurrent
    });
  }

  handleUserJoin(user, time) {
    const current = this.state.current;
    current.users.push(user);

    const message = new MessageData(user, JoinEventMessage, null, Date.now());
    current.messages.push(message);

    this.setState({
        current: current
    });
  }

  handleUserLeave(user, time) {
    const current = this.state.current;
    const userIndex = current.users.indexOf(user);
    current.users.splice(userIndex, 1);

    const message = new MessageData(user, QuitEventMessage, null, Date.now());
    current.messages.push(message);

    this.setState({
        current: current
    });
  }

  // Defined to accomodate messages sent from other users as well

  handleSendMessage(sender, type, text, callback) {
    const current = this.state.current;

    const message = new MessageData(sender, type, text, Date.now());
    current.messages.push(message);

    this.setState({
      current: current
    });

    if (callback) {
        callback(true);
    }
  }

  timestampInMin(time) {
    return Math.floor((this.state.now - time) / 1000 / 60);
  }

  // Should eventually be moved to <ChatPanel>
  getMessageList() {
    const current = this.state.current;
    const messagesAsJsx = [];

    current.messages.forEach((message, index) => {
      switch(message.type) {

        case UserTextMessage:
        case UserStampMessage:
          messagesAsJsx.push(
            <UserMessage
              type={ message.type }
              user={ message.sender }
              message={ message.text }
              time={ this.timestampInMin(message.time) }
              isMyMessage={ message.sender.name === this.props.user.name }
              key={ index }
              id={ index } />
          );
          break;

        case JoinEventMessage:
        case QuitEventMessage:
          messagesAsJsx.push(
            <EventMessage
              type={ message.type }
              user={ message.sender }
              time={ this.timestampInMin(message.time) }
              key={ index }
              id={ index } />
          );
          break;
      }
    });

    return messagesAsJsx;
  }

  render() {
    const rooms = this.state.rooms;
    const current = this.state.current;
    const now = this.state.now;

    return(
        <div>
          <div className="panel panel-default">
            <div className="panel-heading">
              <Tabs
                user={ this.props.user }
                rooms={ rooms }
                current={ current }
                onRoomChange={ this.handleRoomChange.bind(this) }
                onRoomLeave={ this.handleRoomLeave.bind(this) } />
            </div>
            <div className="panel-body">
              <ChatPanel
              messagesAsJsx={ this.getMessageList() } />
            </div>
            <div className="panel-footer">
              <InputField
                myself={ this.props.user }
                rooms={ rooms }
                onSendMessage={ this.handleSendMessage.bind(this) } />
            </div>
          </div>

          <Debug
            myself={ this.props.user }
            data={ this.state }
            onAddUser={ this.handleUserJoin.bind(this) }
            onRemoveUser={ this.handleUserLeave.bind(this) }
            onSendMessage={ this.handleSendMessage.bind(this) } />

          <ModalRoomJoin
            onRoomJoin={ this.handleRoomJoin.bind(this) }/>

      </div>
    );
  }
}

export default Chat;
export { MessageData };
export { UserTextMessage };
