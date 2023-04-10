import { useContext } from "react";
import UserInfo from "../../components/userinfo/UserInfo";
import AuthContext from "../../context/AuthContext";
import kmitl from "../../images/img/kmitl.png";
import { Link } from "react-router-dom";
import "./homePage.css";

const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="container text-center home-text mt-5">
      <img src = {kmitl} alt="" />
      <h3 className="mt-5">ยินดีต้อนรับสู่ระบบ Admin <br /> คุณ {user && <UserInfo user={user} />}</h3>
      {!user && <p>ยังไม่มี Account ใช่ไหม? <Link to="/register">ลงทะเบียน</Link><br /> มี Account อยู่แล้ว? <Link to="/login">เข้าสู่ระบบ</Link></p>}
    </div>
  );
};

export default Home;
