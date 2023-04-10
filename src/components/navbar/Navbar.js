import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <nav className="navbar navbar-expand-lg navbar-light border-bottom">
      <div className="container-fluid">
        <div>
          <Link className="navbar-icon" to="/">
            Kmitl Companion Admin
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        <div className="collapse navbar-collapse float-end" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link navbar-text" to="/protected">
                    แผนที่
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link navbar-text" to="/alert">
                    แจ้งเตือน
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link logout-text" onClick={logoutUser}>
                    ออกจากระบบ
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link navbar-text" to="/login">
                    เข้าสู่ระบบ
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link navbar-text" to="/register">
                    สมัครสมาชิก
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link navbar-text" to="/about">
                    เกี่ยวกับเรา
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
