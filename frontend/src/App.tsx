import Home from "./Pages/Home";
//import About from "./Pages/About";
import Admin from "./Pages/Admin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import Projects from "./Pages/Projects";
import Navbar from "./components/Navbar";
import Projects from "./Pages/Projects";
import Login from "./Pages/Login";
import PrivateAdminRoute from "./Pages/PrivateAdminRoute";
import NotFound from "./Pages/NotFound";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/admin"
          element={
            <PrivateAdminRoute>
              <Admin />
            </PrivateAdminRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/projects" element={<Projects />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
export default App;
