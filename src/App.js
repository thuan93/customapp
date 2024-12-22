import React from 'react';
import _ from 'lodash';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { v4 as uuidv4 } from 'uuid';

import './App.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const items = [
  {
    id: uuidv4(),
    type: 'Type 1',
  },
  {
    id: uuidv4(),
    type: 'Type 2',
  },
  {
    id: uuidv4(),
    type: 'Type 3',
  },
];

function generateLayout(items) {
  return items.map(({ id, type }, i) => {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: Math.round(Math.random() * 5) * 2,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: id,
      type,
    };
  });
}

const toolboxItems = [
  { type: 'Box 0', w: 3, h: 3 },
  { type: 'Box zzz', w: 2, h: 2 },
  { type: 'Box a', w: 1, h: 1 },
];

const ToolboxItem = (props) => {
  const { toolboxItem, onDragStart } = props;
  const { type } = toolboxItem;
  return (
    <div
      draggable={true}
      className="toolbox-item"
      key={type}
      onDragStart={onDragStart}
    >
      {type}
    </div>
  );
};

function boxIntersect(box1, box2) {
  return (
    Math.max(box1.x, box2.x) < Math.min(box1.x + box1.w, box2.x + box2.w) &&
    Math.max(box1.y, box2.y) < Math.min(box1.y + box1.h, box2.y + box2.h)
  );
}

function bfs(items, newItem) {
  const q = [newItem];
  const newLayouts = [newItem];
  const visited = {};
  while (q.length) {
    for (let size = q.length; size > 0; --size) {
      const it = q.shift();
      for (let item of items) {
        if (boxIntersect(item, it) && !visited[item.i]) {
          visited[item.i] = true;
          const pushedItem = { ...item, y: it.y + it.h };
          q.push(pushedItem);
          newLayouts.push(pushedItem);
        }
      }
    }
  }
  for (let item of items) {
    if (!visited[item.i]) {
      newLayouts.push(item);
    }
  }
  return newLayouts;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      items,
      layouts: { lg: generateLayout(items) },
      toolboxItem: null,
      breakpoint: 'lg',
      nextId: uuidv4(),
    };
  }

  stopPropagation = (event) => {
    event.stopPropagation();
  };

  resolver = () =>
    JSON.stringify({
      layouts: this.state.layouts,
      isEditing: this.state.isEditing,
      breakpoint: this.state.breakpoint,
    });

  memoizedItems = _.memoize(() => {
    const { layouts, breakpoint } = this.state;
    return layouts[breakpoint].map(({ i, type }) => (
      <div key={i}>
        <div style={{ fontSize: 12 }}>id: {i}</div>
        <div style={{ fontWeight: 'bold' }}>I am {type}</div>
        <button onClick={this.onSelectedItem()} onTouchEnd={this.onSelectedItem}> Edit </button>
      </div>
    ));
  }, this.resolver);

    // Selected Item
  onSelectedItem = () => {
      console.log("Selected Item");
  };
  

  handleDrop = (layout, item, e) => {
    const { toolboxItem, layouts } = this.state;
    const { type } = toolboxItem;
    const newLayouts = _.cloneDeep(layouts);
    const newItem = {
      ...item,
      type,
      isDraggable: undefined,
      isResizable: undefined,
    };
    Object.keys(newLayouts).map((size) => {
      /*
      const items = newLayouts[size].map(item => {
        if (boxIntersect(item, newItem)) {
          return {...item, y: newItem.y+newItem.h};
        }
        return item;
      });
      newLayouts[size] = [newItem, ...items];
      */
      newLayouts[size] = bfs(newLayouts[size], newItem);
    });
    this.setState({ layouts: newLayouts, nextId: uuidv4() });
    this.dropping = true;
  };

  handleDragStart = (item, e) => {
    this.setState({ toolboxItem: item });
  };

  getDroppingItem = () => {
    const { toolboxItem, nextId } = this.state;
    if (!toolboxItem) {
      return null;
    }
    return { ...toolboxItem, i: nextId };
  };

  handleEditing = (e) => {
    this.setState({ isEditing: e.target.checked });
  };

  handleLayoutChange = (layout, layouts) => {
    if (this.dropping) {
      return;
    }

    const { nextId } = this.state;
    if (layout.find(({ i }) => i === nextId)) {
      return;
    }

    const newLayouts = _.cloneDeep(layouts);
    Object.keys(newLayouts).map((size) => {
      newLayouts[size] = newLayouts[size].map((item, index) => {
        const original = this.state.layouts[size] || this.state.layouts.lg;
        return { ...original[index], ...item };
      });
    });

    this.setState({ layouts: newLayouts });
  };

  handleBreakpointChange = (breakpoint) => this.setState({ breakpoint });

  render() {
    const { layouts, isEditing, breakpoint } = this.state;
    const droppingItem = this.getDroppingItem();
    this.dropping = false;
    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          <input
            type="checkbox"
            value={isEditing}
            onChange={this.handleEditing}
          />
          {isEditing ? 'Editing' : 'Not Allow To Edit'}
        </div>
        <div
          style={{
            marginBottom: 20,
            border: '1px solid skyblue',
            padding: 20,
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {toolboxItems.map((item) => (
            <ToolboxItem
              key={item.type}
              toolboxItem={item}
              onDragStart={(e) => this.handleDragStart(item, e)}
            />
          ))}
        </div>
        <ResponsiveReactGridLayout
          className="layout"
          rowHeight={60}
          layouts={layouts}
          isDroppable={true}
          isDraggable={isEditing}
          isResizable={isEditing}
          onDrop={this.handleDrop}
          droppingItem={droppingItem}
          // preventCollision={true}
          // isBounded={true}
          onLayoutChange={this.handleLayoutChange}
          onBreakpointChange={this.handleBreakpointChange}
        >
          {this.memoizedItems()}
          {/*layouts[breakpoint].map(({ i, type }) => (
            <div key={i}>
              <div style={{ fontSize: 12 }}>id: {i}</div>
              <div style={{ fontWeight: "bold" }}>I am {type}</div>
            </div>
          ))*/}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

export default App;
