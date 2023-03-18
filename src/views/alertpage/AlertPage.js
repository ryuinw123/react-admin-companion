import React , {useState , useEffect} from "react";
import useAxios from "../../utils/useAxios";
import building from "../../images/icons/type_building.png";
import dorm from "../../images/icons/type_dorm.png";
import pin from "../../images/icons/type_pin.png";
import restaurant from "../../images/icons/type_restaurant.png";
import room from "../../images/icons/type_room.png";
import school from "../../images/icons/type_school.png";
import shop from "../../images/icons/type_shop.png";
import { Link } from "react-router-dom";

const AlertPage = () => {
  const api = useAxios();
  const [reportData, setReportData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = reportData.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

   //Get Marker Information
   useEffect(() => {
    const getReportData = async () => {
      try {
        const response = await api.get("/report/");
        console.log(response.data);

        setReportData(response.data);

      } catch (e) {
        console.log(e);
      }
    };
    getReportData();
  }, []);



  return (
    <div className="container">
      <h1>AlertPage</h1>
      <Link to="" className="row border p-4">
        <div className="col-1 text-center">
          <img src={dorm} />
        </div>
        <div className="col-11">
          <div className="row">
            <b className="m-0 p-0">Your financial report is overdue</b>
          </div>
          <div className="row">
            <p className="m-0 p-0">
              Please submit your quarterly figures for Q2 by EOB on August 15.
            </p>
          </div>
          <div className="row">
            <p className="m-0 p-0">SAP Analytics · Just now</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AlertPage;
