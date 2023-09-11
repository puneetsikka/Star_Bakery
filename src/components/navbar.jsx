import '../staticFiles/navbar.css'
import HomeIcon from '@mui/icons-material/Home';
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
      <h1>Star Bakery Analytics Dashboard</h1>
      </div>
      <div className="navbar-right">
        <HomeIcon />
      </div>
    </nav>
  );
};

export default Navbar;