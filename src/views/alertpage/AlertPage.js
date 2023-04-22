import React, { useState, useEffect } from "react";
import useAxios from "../../utils/useAxios";
import ReactPaginate from "react-paginate";
import Notification_Card from "../../components/notificationcard/Notification_Card";
import "./AlertPage.css";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import SortIcon from "@material-ui/icons/Sort";

const AlertPage = () => {
  const api = useAxios();
  const [reportData, setReportData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(7);
  const [activeData, setActiveData] = useState([]);
  const [searchWord, setSearchWord] = useState("");

  const [sort, setSort] = useState(false);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = activeData.slice(indexOfFirstPost, indexOfLastPost);
  //console.log(`indexOfFirstPost = ${indexOfFirstPost} indexOfLastPost = ${indexOfLastPost} currentPost = ${currentPosts}`)

  const pageCount = Math.ceil(activeData.length / postsPerPage);

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
        setActiveData(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    getReportData();
  }, []);

  useEffect(() => {
    setActiveData(activeData.reverse());
  }, [sort]);

  useEffect(() => {
    setActiveData(
      reportData.filter((data) => {
        return (
          data.report_marker_id
            ?.toString()
            .toLowerCase()
            .includes(searchWord.toLowerCase()) ||
          data.reason?.toLowerCase().includes(searchWord.toLowerCase()) ||
          data.id
            ?.toString()
            .toLowerCase()
            .includes(searchWord.toLowerCase()) ||
          data.details?.toLowerCase().includes(searchWord.toLowerCase()) ||
          data.created_user
            ?.toString()
            .toLowerCase()
            .includes(searchWord.toLowerCase()) ||
          data.report_event_id
            ?.toString()
            .toLowerCase()
            .includes(searchWord.toLowerCase()) ||
          data.event
            ?.toString()
            .toLowerCase()
            .includes(searchWord.toLowerCase())
        );
      })
    );
  }, [searchWord]);

  return (
    <>
      <h1 className="alert-text ms-5">การแจ้งเตือนรายงาน</h1>
      <div className="container alert-text">
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="reset-style"
            onClick={(e) => {
              e.preventDefault();
              setSort(!sort);
            }}
          >
            <span>
              <SortIcon
                style={{ transform: sort ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </span>{" "}
            ปักหมุด
          </button>
          <div className="my-3">
            <div className="searchInputs">
              <div className="left-input">
                {searchWord.length === 0 && <SearchIcon />}
              </div>
              <input
                className="border-0"
                type="text"
                placeholder="ค้นหา"
                value={searchWord}
                onChange={(e) => {
                  setSearchWord(e.target.value);
                }}
              />
              <div className="right-input">
                {searchWord.length !== 0 && (
                  <CloseIcon
                    id="clearBtn"
                    onClick={(e) => {
                      e.preventDefault();
                      setSearchWord("");
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {activeData
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
    </>
  );
};

export default AlertPage;
