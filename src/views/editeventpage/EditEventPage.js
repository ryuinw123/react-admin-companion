import React, { useState, useEffect  } from "react";
import { useLocation } from "react-router-dom";
import ImageUploading from "react-images-uploading";
import useAxios from "../../utils/useAxios";
import Swal from "sweetalert2";

const EditEvent = ({ match }) => {
  const api = useAxios();
  function formatDateForInput(dateString) {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const formattedDate = date.toISOString().slice(0, 16);
    return formattedDate;
  }

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [notification, setNotification] = useState(
    JSON.parse(queryParams.get("notification"))
  );


  function updateReport() {
    Swal.fire({
      title: "ยืนยันการกระทำ",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      icon: "warning",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        api
          .put(`/updateeventreport/${notification.report_event_id}`, {
            enable: 0,
          })
          .then(() => {
            setNotification("");
            Swal.close();
            Swal.fire("อัพเดทข้อมูลสำเร็จ", "", "success");
          })
          .catch((e) => Swal.fire(" อัพเดทข้อมูลล้มเหลว", "", "error"));
      } else Swal.fire(" ยกเลิก", "", "error");
    });
  }


  const [event, setEvent] = useState({
    event_id: "",
    eventname: "",
    endtime: "",
    description: "",
    polygon: "",
    enable: 1,
    starttime: "",
    student: "",
  });

  const onBImageRemove = (id) => {
    Swal.fire({
      title: "ยืนยันการกระทำ",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      icon: "warning",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log(id)
        api
          .delete(`/destroyImageEvent/${id}`)
          .then(() => {
            setbImages((prevBImage) =>
              prevBImage.filter((data, i) => data.id !== id)
            );
            Swal.fire("อัพเดทข้อมูลสำเร็จ", "", "success");
          })
          .catch((e) => Swal.fire(" อัพเดทข้อมูลล้มเหลว", "", "error"));
      } else Swal.fire(" ยกเลิก", "", "error");
    });
  };

  const [bImages, setbImages] = useState([]);
  const [images, setImages] = useState([]);

  async function handleImageUpload(image, event_id) {
    const formData = new FormData();
    formData.append("file", image.file);
    formData.append("event_id", event_id);
  
    try {
      const response = await api.post("/uploadImagesEvent/", formData);
      return response.data;
    } catch (error) {
      console.error("Image upload error:", error);
      return { error: error.message }; // or any other value that represents an error
    }
  }

  function uploadimage() {
    if (bImages.length + images.length > 5) {
      Swal.fire("ห้ามเพิ่มเกิน 5 รูป", "", "error");
      return
    }
    Swal.fire({
      title: "ยืนยันการกระทำ",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      icon: "warning",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      let uImages = []

      if (result.isConfirmed) {
        try {
          for (let i = 0; i < images.length; i++) {
            let data = await handleImageUpload(images[i], match.params.id);
            uImages.push(data)
          }
          setbImages([...bImages, ...uImages])
          setImages([])

        } catch (error) {
          Swal.fire("อัพเดทข้อมูลล้มเหลว", "", "error");
        }
        Swal.fire("อัพเดทข้อมูลสำเร็จ", "", "success");
      } else Swal.fire(" ยกเลิก", "", "error");
    });
  }

  const maxNumber = 69;

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList);
    setImages(imageList);
  };


  useEffect(() => {
    const fetchEvent = async () => {
      const response = await api.get(`/event/${match.params.id}`);
      response.data.event.starttime = formatDateForInput(
        response.data.event.starttime
      );
      response.data.event.endtime = formatDateForInput(
        response.data.event.endtime
      );
      setEvent(response.data.event);
      setbImages(response.data.images);
    };
    fetchEvent();
  }, [match.params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (event.starttime >= event.endtime) {
        Swal.fire("ใส่เวลาให้ถูกต้อง", "", "error");
        return
    }



    Swal.fire({
      title: "ยืนยันการกระทำ",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      icon: "warning",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        try {
          const formData = new FormData();
          formData.append("eventname", event.eventname);
          formData.append("endtime", event.endtime);
          formData.append("description", event.description);
          formData.append("starttime", event.starttime);
          formData.append("enable", event.enable);
          formData.append("student", event.student);
          api
            .put(`/editEvent/${match.params.id}`, formData)
            .then(() => {
              Swal.fire("อัพเดทข้อมูลสำเร็จ", "", "success");
            })
            .catch((e) => {
              Swal.fire(" อัพเดทข้อมูลล้มเหลว", "", "error");
            });
        } catch (e) {
          console.log(e);
          Swal.fire(" อัพเดทข้อมูลล้มเหลว", "", "error");
        }
      } else Swal.fire(" ยกเลิก", "", "error");
    });
  };

  return (
    <div className="container mt-4">
      <div className="border border-primary">
        <h1 className="mb-4">Edit Event</h1>

        {notification && (
          <div className="card bg-light mb-3">
            <div className="card-header">Notification</div>
            <div className="card-body">
              <p className="card-text">
                An Event with ID <strong>{notification.event}</strong> has been
                reported for the following reason:{" "}
                <strong>{notification.reason}</strong>
              </p>
              <p className="card-text">
                Details: <strong>{notification.details}</strong>
              </p>
              <p className="card-text">
                Reported by user <strong>{notification.created_user}</strong>
              </p>
              <p className="card-text">
                Created on:{" "}
                <strong>
                  {new Date(notification.created_time).toLocaleString()}
                </strong>
              </p>
              <button onClick={updateReport} className="btn btn-success">
                Complete
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="eventname">Event Name</label>
            <input
              type="text"
              className="form-control"
              id="eventname"
              name="eventname"
              value={event.eventname}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={event.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-check">
            <label htmlFor="enable" className="form-check-label">
              Enable
            </label>
            <input
              type="checkbox"
              name="enable"
              id="enable"
              className="form-check-input"
              checked={event.enable}
              onChange={(e) =>
                setEvent((prevEvent) => ({
                  ...prevEvent,
                  enable: e.target.checked ? 1 : 0,
                }))
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="starttime">StartTime</label>
            <input
              type="datetime-local"
              name="starttime"
              id="starttime"
              className="form-control"
              value={event.starttime}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endtime">EndTime</label>
            <input
              type="datetime-local"
              name="endtime"
              id="endtime"
              className="form-control"
              value={event.endtime}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="student">Created By</label>
            <input
              type="text"
              name="student"
              id="student"
              className="form-control"
              value={event.student}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
      <div className="border border-success">
        <div>
          {bImages.length > 0 && <label htmlFor="images">Images</label>}
          {bImages?.map((image) => (
            <div key={image.id} className="image-item">
              <img src={image.dataURL} alt="" width="100" />
              <div className="image-item__btn-wrapper">
                <button onClick={() => onBImageRemove(image.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <label htmlFor="images">Upload Images</label>
          <ImageUploading
            multiple
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (
              // write your building UI
              <div className="upload__image-wrapper">
                <button
                  className="btn btn-success"
                  style={isDragging ? { color: "red" } : undefined}
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  Click or Drop here
                </button>
                &nbsp;
                <button className="btn btn-success" onClick={onImageRemoveAll}>
                  Remove all images
                </button>
                {imageList.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image["data_url"]} alt="" width="100" />
                    <div className="image-item__btn-wrapper">
                      <button
                        className="btn btn-success"
                        onClick={() => onImageUpdate(index)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => onImageRemove(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ImageUploading>
          <button
            type="submit"
            className="btn btn-success"
            onClick={(e) => {
              e.preventDefault();
              uploadimage();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditEvent;
