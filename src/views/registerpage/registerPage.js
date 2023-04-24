import { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./registerPage.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [secret,setSecret] = useState("");
  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    registerUser(username, password, password2,secret);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div class="col-4 text-center">
          <section>
          <h1 className="register-text mt-5">สมัครสมาชิก</h1>
            <form onSubmit={handleSubmit} className="default-register-text fw-bold">
              <div className="my-3">
                <label htmlFor="username" className="form-label float-start">
                  ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ชื่อผู้ใช้"
                  className="form-control placeholder-input"
                  required
                />
              </div>
              <div className="my-3">
                <label htmlFor="password" className="form-label float-start">
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="รหัสผ่าน"
                  className="form-control placeholder-input"
                  required
                />
              </div>
              <div className="my-3">
                <label
                  htmlFor="confirm-password"
                  className="form-label float-start"
                >
                  ยืนยันรหัสผ่าน
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder="ยืนยันรหัสผ่าน"
                  className="form-control placeholder-input"
                  required
                />
                <p>{password2 !== password ? "Passwords do not match" : ""}</p>
              </div>
              <div className="my-3">
                <label
                  htmlFor="confirm-password"
                  className="form-label float-start"
                >
                  รหัสลับ
                </label>
                <input
                  type="text"
                  id="secret"
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="รหัสลับ"
                  className="form-control placeholder-input"
                  required
                />
              </div>
              <button type="submit" className="btn kmitl-button">
                สมัครสมาชิก
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Register;
