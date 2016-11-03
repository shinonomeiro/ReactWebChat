import React, { Component } from 'react';

// Tabs for switching between rooms
class Debug extends Component {
  render() {
    return(
      <div className="dropdown">
        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">Debug<span className="caret"></span></button>
        <ul className="dropdown-menu">
          <li><a href="#">Debug 1</a></li>
          <li><a href="#">Debug 2</a></li>
        </ul>
      </div>
    )
  }
}

export default Debug;