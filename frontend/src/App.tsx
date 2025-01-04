// import Alert from "./components/Alert";
import Button from "./components/Button";
import Navbar from "./components/Navbar";
// import ListGroup from "./components/ListGroup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
function App() {
  // let items = ["Mumbai", "Tokyo", "New york", "Paris", "London"];
  // const handleSelectItem = (item: string) => {
  //   console.log(item);
  // };
  const handleButtonFunction = () => {
    console.log("Clicked");
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Button buttonText="Click me" />,
    },
    {
      path: "/btn1",
      element: <Button buttonText="Click me" />,
    },
    {
      path: "/btn2",
      element: <Button buttonText="Click me 2" />,
    },
  ]);
  return (
    <>
      <Navbar />
      <RouterProvider router={router} />
    </>
  );
  // return (
  //   <div>
  //     <Button
  //       buttonColor="danger"
  //       buttonText="Click Me"
  //       buttonFunction={handleButtonFunction}
  //     />
  //     <div className="rounded-lg">Hello world</div>
  //   </div>
  // );
  // return (
  //   <div>
  //     <Alert>
  //       <h1>Hello world</h1>
  //     </Alert>
  //     {/* <Alert message="Something went wrong" /> */}
  //   </div>
  // );
  // return (
  //   <div>
  //     <ListGroup
  //       items={items}
  //       heading="Heading 1"
  //       onSelectItem={handleSelectItem}
  //     />
  //   </div>
  // );
}
export default App;
