import { Link } from "react-router-dom";
interface NavbarProps {
  isActive?: string;
}
const Navbar = ({ isActive = "" }: NavbarProps) => {
  return (
    <nav className="font-body topNavbar">
      <Link
        to="/"
        className={
          "home" == isActive.toLowerCase()
            ? "activeActionBtn"
            : "inactiveNavLink"
        }
      >
        Home
      </Link>
      <Link
        to="/projects"
        className={
          "projects" == isActive.toLowerCase()
            ? "activeActionBtn"
            : "inactiveNavLink"
        }
      >
        Projects
      </Link>
      <Link
        to="/contact"
        className={
          "contact" == isActive.toLowerCase()
            ? "activeActionBtn"
            : "inactiveNavLink"
        }
      >
        Contact
      </Link>
      <Link
        to="/about"
        className={
          "about" == isActive.toLowerCase()
            ? "activeActionBtn"
            : "inactiveNavLink"
        }
      >
        About
      </Link>
    </nav>
  );
};

export default Navbar;
