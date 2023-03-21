import React, { useState, useEffect } from "react";
import useAxios from "../../utils/useAxios";
import ReactPaginate from "react-paginate";
import Notification_Card from "../../components/notificationcard/Notification_Card";
import "./AlertPage.css";

const AlertPage = () => {
  const api = useAxios();
  const [reportData, setReportData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(7);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = reportData.slice(indexOfFirstPost, indexOfLastPost);
  //console.log(`indexOfFirstPost = ${indexOfFirstPost} indexOfLastPost = ${indexOfLastPost} currentPost = ${currentPosts}`)

  const pageCount = Math.ceil(reportData.length / postsPerPage);

  const paginate = ({ selected }) => {
    setCurrentPage(selected + 1);
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
      {reportData
        ? currentPosts.map((item) => <Notification_Card data={item} />)
        : "Loading"}
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={paginate}
        containerClassName={"pagination"}
        previousLinkClassName={"page-link"}
        nextLinkClassName={"page-link"}
        disabledClassName={"disabled"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default AlertPage;
