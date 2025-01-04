import { MouseEvent, useState } from "react";
interface ListGroupProps {
  items: string[];
  heading: string;
  onSelectItem: (item: string) => void;
}
function ListGroup(props: ListGroupProps) {
  // {items,heading}: ListGroupProps;
  //   let items = ["Mumbai", "Tokyo", "New york", "Paris", "London"];
  //   let selectedIndex = -1;
  //   items = [];
  //   const message = items.length === 0 ? <p> No item found</p> : null;
  const getMessage = () => {
    return props.items.length === 0 ? <p> No item found</p> : null;
  };
  const handleClick = (event: MouseEvent) => console.log(event);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  return (
    <>
      <h1>{props.heading}</h1>
      {/* {message} */}
      {/* {getMessage()} */}
      {/* if first condition is true second is rendered otherwise false */}
      {props.items.length === 0 && <p>No item found</p>}
      <ul className="list-group">
        {props.items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
              props.onSelectItem(item);
            }}
          >
            {" "}
            {item}
          </li>
        ))}
        {/* {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={handleClick}
          >
            {" "}
            {item}
          </li>
        ))} */}
        {/* {items.map((item, index) => (
          <li
            className="list-group-item"
            key={item}
            onClick={() => console.log(`Clicked: ${item} ${index}`)}
          >
            {" "}
            {item}
          </li>
        ))} */}
        {/* <li className="list-group-item">An item</li>
        <li className="list-group-item">A second item</li>
        <li className="list-group-item">A third item</li>
        <li className="list-group-item">A fourth item</li>
        <li className="list-group-item">And a fifth one</li> */}
      </ul>
    </>
  );
}
export default ListGroup;
