import { useContext } from "react";
import UserInfo from "../../components/userinfo/UserInfo";
import AuthContext from "../../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="container">
      <h1>Welcome to the Home Page {user && <UserInfo user={user} />}</h1>
      <p>This is a simple and beautiful homepage built with React and Bootstrap 5</p>
    </div>
  );
};

export default Home;
