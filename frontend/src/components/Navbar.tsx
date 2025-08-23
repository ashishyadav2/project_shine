import { Link } from "react-router-dom";

interface NavbarProps {
  isActive?: string;
  isDesktopMode?: boolean;
  phoneModeHideShow?: boolean;
}

const Navbar = ({
  isActive = "",
  isDesktopMode = false,
  phoneModeHideShow = false,
}: NavbarProps) => {
  return (
    <>
      {isDesktopMode ? (
        <nav className="font-ui topNavbar">
          <Link
            to="/"
            className={
              isActive.toLowerCase() === "home"
                ? "activeActionBtn"
                : "inactiveNavLink"
            }
          >
            Home
          </Link>
          <Link
            to="/projects"
            className={
              isActive.toLowerCase() === "projects"
                ? "activeActionBtn"
                : "inactiveNavLink"
            }
          >
            Projects
          </Link>
          <Link
            to="/contact"
            className={
              isActive.toLowerCase() === "contact"
                ? "activeActionBtn"
                : "inactiveNavLink"
            }
          >
            Contact
          </Link>
          <Link
            to="/about"
            className={
              isActive.toLowerCase() === "about"
                ? "activeActionBtn"
                : "inactiveNavLink"
            }
          >
            About
          </Link>
        </nav>
      ) : (
        <div className={phoneModeHideShow ? "phoneNavbar" : "phoneNavbarHide"}>
          <nav className="font-ui topNavbar">
            <Link
              to="/"
              className={
                isActive.toLowerCase() === "home"
                  ? "activeActionBtn"
                  : "inactiveNavLink"
              }
            >
              Home
            </Link>
            <Link
              to="/projects"
              className={
                isActive.toLowerCase() === "projects"
                  ? "activeActionBtn"
                  : "inactiveNavLink"
              }
            >
              Projects
            </Link>
            <Link
              to="/contact"
              className={
                isActive.toLowerCase() === "contact"
                  ? "activeActionBtn"
                  : "inactiveNavLink"
              }
            >
              Contact
            </Link>
            <Link
              to="/about"
              className={
                isActive.toLowerCase() === "about"
                  ? "activeActionBtn"
                  : "inactiveNavLink"
              }
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
