const Navbar = () => {
  return (
    <nav className="topNavbar">
      <a href="/" className="activeActionBtn">
        Home
      </a>
      <a href="/" className="inactiveNavLink">
        Projects
      </a>
      <a href="/" className="inactiveNavLink">
        Blog
      </a>
      <a href="/" className="inactiveNavLink">
        About
      </a>
    </nav>
  );
};

export default Navbar;
