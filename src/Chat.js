import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import Debug from './Debug'

// Tabs for switching between rooms
class Tabs extends Component {
	constructor(props) {
		super(props);
	}

  handleRoomChange(room) {
    this.props.onRoomChange(room);
  }

  handleRoomJoin() {
    // TODO Better way
    const roomName = prompt('Room name to join:');
    if (roomName) this.props.onRoomJoin(roomName);
  }

  handleUserList() {
  	const users = this.props.current.users;
  	console.log(users.toString());
  	let users_li = '';
  	users.map(user => users_li += `<li>${user}</li>`);
  	document.getElementById('userlist-toggle').setAttribute('data-content', users_li);
	}

  render() {
    let roomNames = this.props.rooms.map(
      room => 
      <li 
        role="presentation" 
        key={ room.name } 
        className={ room === this.props.current ? "active" : "" }>
        <a href="#" onClick={ this.handleRoomChange.bind(this, room) }>{ room.name }</a>
      </li>);

    return(
    	<div>
    		<div className="row">
    			<div className="col-xs-12">
			      <ul className="nav nav-tabs">
			        { roomNames }
			        <li 
			          role="presentation" 
			          key={ 'join' }>
			          <a href="#"
				          data-toggle="tooltip" 
		      				data-placement="bottom" 
		      				title="Join" 
			          	onClick={ this.handleRoomJoin.bind(this) }>
			          		[+]
			          	</a>
		          </li>
	          	<li
	          		role="presentation"
	          		key={ 'userlist' }
	          		className="pull-right">
		          		<a href="#" 
				      			id="userlist-toggle" 
				      			data-toggle="popover" 
			      				data-placement="bottom"
			      				data-html="true" 
			      				data-trigger="focus" 
			      				title="Users"
			      				data-content=""
				      			onClick={ this.handleUserList.bind(this) }>
				      			<span 
				      				className="glyphicon glyphicon-user" 
				      				data-toggle="tooltip" 
				      				data-placement="bottom" 
				      				title="Users">
				      			</span>
			      			</a>
	          	</li> 
			      </ul>
		      </div>
	      </div>
	      <div className="row">
	      	<div className="col-xs-12">
	      		
	      	</div>
	      </div>
      </div>
    )
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

// Chat message
class Message extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const s = document.getElementById('scrollable');
		const scrollBottom = s.scrollHeight - s.scrollTop - s.clientHeight;
		const m = document.getElementById('message-' + this.props.id);

		// If scrollview is already at the bottom
		if (scrollBottom < m.clientHeight + 20) {
			// Move alongside to display the new message
			s.scrollTop = s.scrollHeight;
		}
	}

  render() {
    return(
      <div className="media message" id={ "message-" + this.props.id }>
        { !this.props.isMyMessage && 
        <div className="media-left media-middle">
          <img 
            src={ this.props.avatar } 
            alt="(´Д`|||)"
            className="img-circle avatar" />
        </div>
        }
        <div className="media-body">
          <span><strong>{ this.props.name }</strong></span>
          <small className="pull-right text-muted">
            <span className="glyphicon glyphicon-time"></span>
            { formatTimestamp(this.props.time) }
          </small>
          <div className="well message-text">{ this.props.message }</div>
        </div>
        { this.props.isMyMessage && 
        <div className="media-right media-middle">
          <img 
            src={ this.props.avatar } 
            alt="(´Д`|||)"
            className="img-circle avatar" />
        </div>
        }
      </div>
    )
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
    if (this.state.message.length > 0) {
      this.props.onSendMessage(this.state.message, this.handleMessageSent.bind(this));
    }
  }

  handleMessageSent(success) {
  	if (success) {
    	this.setState({
    		message: ''
    	});
    }
  }

  render() {
    return(
      <div className="input-group">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Write a message..." 
          value={ this.state.message } 
          onChange={ this.handleChange.bind(this) } />
        <span className="input-group-btn">
        	<button 
            type="button" 
            className="btn btn-default" 
            onClick={ this.handleSendMessage.bind(this) }>
            S
          </button>
          <button 
            type="button" 
            className="btn btn-default" 
            onClick={ this.handleSendMessage.bind(this) }>
            Send
          </button>
        </span>
      </div>
    )
  }
}

function RoomData(name, users, messages) {
  this.name = name;
  this.users = users;
  this.messages = messages;
}

function MessageData(sender, avatar, text, time) {
  this.sender = sender;
  this.avatar = avatar;
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
      current: new RoomData('', [], []),
      now: Date.now()
    };

    this.timer = null;
  }

  componentDidMount() {
  	
    // Join the room user has picked on Login screen
    this.handleRoomJoin('Buddies') // this.props.roomName

    // Timer to refresh the message timestamps
    this.timer = setInterval(() => this.setState({ now: Date.now() }), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleRoomChange(room) {
    this.setState({
      current: room
    });
  }

  handleRoomJoin(roomName) {

  	// Should be in practice be querying for an existing room
  	// and create an empty one only if the former can't be found. 
  	// But for the sake of this exercice, let's just init a new one every time.

    const room = new RoomData(roomName, [], []);
    const roomList = this.state.rooms;
    roomList.push(room);

    this.setState({
      rooms: roomList,
      current: room
    });
  }

  handleSendMessage(text, callback) {
    const current = this.state.current;
    current.messages.push(new MessageData(this.props.userName, this.props.avatar, text, Date.now()));

    this.setState({
      current: current
    });

    callback(true);
  }

  render() {
    const rooms = this.state.rooms;
    const current = this.state.current;
    const now = this.state.now;

    const messages = 
      current.messages.map(
        (message, index) =>
        <Message 
          name={ message.sender } 
          avatar={ message.avatar }
          message={ message.text } 
          time={ Math.floor((now - message.time) / 1000 / 60) } 
          isMyMessage={ message.sender === this.props.userName }
          key={ index }
          id={ index } /* 'key' seems to be a hidden prop */ />
      );

    return(
      <div className="container-fluid">
        <div className="panel panel-default">
          <div className="panel-heading">
            <Tabs 
              rooms={ rooms } 
              current={ current } 
              onRoomChange={ this.handleRoomChange.bind(this) }
              onRoomJoin={ this.handleRoomJoin.bind(this) } />
          </div>
          <div className="panel-body body-panel" id="scrollable">
            <ReactCSSTransitionGroup
			      transitionName="messageFade"
			      transitionEnterTimeout={200}
			      transitionLeaveTimeout={100}>
            	{ messages }
            </ReactCSSTransitionGroup>
          </div>
          <div className="panel-footer">
            <InputField onSendMessage={ this.handleSendMessage.bind(this) }/>
          </div>
        </div>
        <Debug data={ this.state }/>
      </div>
    );
  }
}

export default Chat;