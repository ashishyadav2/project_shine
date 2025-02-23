import Home from "./Pages/Home";
//import About from "./Pages/About";
import Admin from "./Pages/Admin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import Projects from "./Pages/Projects";
import Navbar from "./components/Navbar";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </Router>
  );
}
export default App;
