import React, { Component } from "react";
import "react-grid-layout/css/styles.css";

export default class Compoment1 extends Component {

  render() {
    return (
      <div>
        <div>{this.props.name}</div>
        <input type="text" />
      </div>
    );
  }
}
