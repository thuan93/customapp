import React, { Component } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";

export default class Compoment1 extends Component {

  render() {
    const layout = [];
    return (
      <GridLayout
        className="layout1"
        layout={layout}
        cols={12}
        rowHeight={30}
        isDraggable={true}
        width={1000}
        style={{ backgroundColor: "lightgray" }}
      >
        <div>test</div>
        <div data-grid={{ x: 1, y: 1, w: 12, h: 12 }}>
          <div>test</div>
          <input type="text" />
        </div>
      </GridLayout>
    );
  }
}
