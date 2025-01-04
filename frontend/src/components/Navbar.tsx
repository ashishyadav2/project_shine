import { Link } from "react-router-dom";
const Navbar = () => {
  const websiteName = "Ashish Yadav";
  return (
    <>
      <nav>
        <Link to="/">Link 0 {websiteName}</Link>;<Link to="/btn1">Link 1</Link>;
        <Link to="/btn2">Link 2</Link>;
      </nav>
    </>
  );
};
export default Navbar;
