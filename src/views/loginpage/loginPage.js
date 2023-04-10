import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import "./loginPage.css";

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    username.length > 0 && loginUser(username, password);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div class="col-4 text-center">
          <h1 className="login-text mt-5">เข้าสู่ระบบ</h1>
          <form className="default-login-text fw-bold" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label float-start">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                className="form-control placeholder-input"
                id="username"
                aria-describedby="userHelp"
                placeholder="ชื่อผู้ใช้"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label float-start">
                รหัสผ่าน
              </label>
              <input
                type="password"
                className="form-control placeholder-input"
                id="password"
                placeholder="รหัสผ่าน"
              />
            </div>
            <button type="submit" className="btn kmitl-button">
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
