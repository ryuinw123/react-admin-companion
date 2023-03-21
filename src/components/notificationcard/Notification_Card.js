import React, { useState } from "react";
import pin from "../../images/icons/type_pin.png";
import event from "../../images/icons/type_event.png";
import { Link, useHistory } from "react-router-dom";

const Notification_Card = ({ data }) => {
  const history = useHistory();
  const [isHovered, setIsHovered] = useState(false);

  const handleLinkClick = () => {
    const queryString = new URLSearchParams({
      notification: JSON.stringify(data),
    }).toString();
    history.push(
      data.report_event_id
        ? `event/${data.event}?${queryString}`
        : `marker/${data.id}?${queryString}`
    );
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const cardStyle = {
    cursor: "pointer",
    color : "#0d6efd",
    backgroundColor: isHovered ? "#f5f5f5" : "#fff",
  };

  return (
    <div
      onClick={handleLinkClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="row border p-4"
      style={cardStyle}
    >
      <div className="col-1 text-center">
        <img src={data.report_event_id ? event : pin} alt="" />
      </div>
      <div className="col-11">
        <div className="row">
          <b className="m-0 p-0">{data.reason}</b>
        </div>
        <div className="row">
          <p className="m-0 p-0">
            {data.created_user} · {new Date(data.created_time).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notification_Card;
