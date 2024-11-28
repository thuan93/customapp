import "./App.css";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React, { useState, useEffect } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import Compoment1 from "./Components/Compoment1";

const ItemTypes = {
  NAVBAR_ITEM: "navbarItem",
};

const DraggableNavbarItem = ({ id, name, style }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.NAVBAR_ITEM,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      {name}
    </div>
  );
};

const DroppableGridItem = ({ id, onDrop, children, style }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.NAVBAR_ITEM,
    drop: (item) => onDrop(item.id, id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        height: "100%",
        backgroundColor: style.backgroundColor,
      }}
    >
      {children}
    </div>
  );
};

function App() {
  const layout = [];
  const numberOfItems = 10; // Define the number of items
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrag, setIsDrag] = useState(true);
  const [navbarItems, setNavbarItems] = useState([
    { id: 1, name: "item1" },
    { id: 2, name: "item2" },
    { id: 3, name: "item3" },
    { id: 4, name: "item4" },
    { id: 5, name: "item5" },
    { id: 6, name: "item6" },
    { id: 7, name: "item7" },
    { id: 8, name: "item8" },
    { id: 9, name: "item9" },
    { id: 10, name: "item10" },
  ]);

  useEffect(() => {
    var newItems = [];
    for (let i = 0; i < numberOfItems; i++) {
      newItems.push({
        name: "Item " + i,
        style: {
          backgroundColor: i % 2 === 0 ? "lightblue" : "lightgreen",
        },
      });
    }
    setItems(newItems);
  }, []);

  const handleDrop = (draggedId, droppedId) => {
    const draggedItem = navbarItems.find((item) => item.id === draggedId);
    const newItems = items.map((item) => {
      if (item.id === droppedId) {
        return { ...item, name: draggedItem.name };
      }
      return item;
    });
    setItems(newItems);
  };

  const convertToJson = () => {
    // Hàm để lấy thông tin vị trí, kích thước, loại thẻ HTML và màu sắc của các widget và in ra JSON
    const items = document.querySelectorAll(".react-grid-layout");
    const itemsArray = Array.from(items).map((node) => {
      const rect = node.getBoundingClientRect();
      const backgroundColor = window.getComputedStyle(node).backgroundColor;

      return {
        x: parseInt(node.getAttribute("data-grid-x")),
        y: parseInt(node.getAttribute("data-grid-y")),
        width: rect.width,
        height: rect.height,
        backgroundColor: backgroundColor,
      };
    });
    const layoutJson = JSON.stringify(itemsArray, null, 2);
    console.log(layoutJson);
  };

  // Hàm để lấy thông tin chi tiết của tất cả các widget có cùng tên và các phần tử con bên trong
  const getItemDetails = (name) => {
    const elements = Array.from(document.querySelectorAll(".react-grid-item"));
    const itemsDetails = elements.map((element) => {
      const rect = element.getBoundingClientRect();
      const tagName = element.tagName.toLowerCase();
      const backgroundColor = window.getComputedStyle(element).backgroundColor;

      // Tạo object chứa thông tin chi tiết của thẻ cha
      const itemDetails = {
        id: element.id,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        tagName: tagName,
        backgroundColor: backgroundColor,
        children: [], // Mảng chứa thông tin các thẻ con
      };

      // Lấy thông tin chi tiết của các phần tử con
      const children = element.querySelectorAll(".resizable");
      children.forEach((child) => {
        const childRect = child.getBoundingClientRect();
        const childTagName = child.tagName.toLowerCase();
        const childBackgroundColor =
          window.getComputedStyle(child).backgroundColor;

        // Tính toán vị trí của thẻ con dựa trên thẻ cha
        const childTop = childRect.top - rect.top;
        const childBottom = childRect.bottom - rect.top;
        const childLeft = childRect.left - rect.left;
        const childRight = childRect.right - rect.left;

        // Thêm thông tin của thẻ con vào mảng children
        itemDetails.children.push({
          tagName: childTagName,
          width: childRect.width,
          height: childRect.height,
          top: childTop,
          bottom: childBottom,
          left: childLeft,
          right: childRight,
          backgroundColor: childBackgroundColor,
        });
      });

      return itemDetails;
    });

    // In object dưới dạng JSON
    console.log(JSON.stringify(itemsDetails, null, 2));
  };

  const setDrag = () => {
    setIsDrag(!isDrag);
  };

  // Selected Item in GridLayout
  const onSelectedItem = (item, i) => {
    var newItem = item;
    newItem.style.backgroundColor = "red";
    var newItems = items.map((item, index) => (i === index ? newItem : item));
    setItems(newItems);
    setSelectedItem(i);
    console.log("Selected Item: ", item);
    console.log("items: ", items);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="parent">
        <div className="navbar">
          {navbarItems.map((item) => (
            <div className="navbar vertical" key={item.id}>
              <DraggableNavbarItem id={item.id} name={item.name} />
            </div>
          ))}
        </div>
        <div style={{ width: "1200px" }}>
          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={30}
            isDraggable={isDrag}
            width={1200}
            style={{ backgroundColor: "lightgray" }}
          >
            {items.map((item, i) => (
              <div
                style={item.style}
                onClick={() => onSelectedItem(item, i)}
                key={i}
                data-grid={{ x: 1, y: 1, w: 2, h: 2 }}
              >
                <DroppableGridItem style={item.style} id={item.id} onDrop={handleDrop}>
                  <Compoment1 name={item.name} />
                </DroppableGridItem>
              </div>
            ))}
          </GridLayout>
          <button onClick={convertToJson}>GetParent</button>
          <button onClick={getItemDetails}>GetAllItems</button>
          <button onClick={setDrag}>SetDrag</button>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
