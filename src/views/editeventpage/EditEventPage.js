import React, { useState, useEffect } from "react";
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
    event_type: "0",
    url: ""
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
        console.log(id);
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
      return;
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
      let uImages = [];

      if (result.isConfirmed) {
        try {
          for (let i = 0; i < images.length; i++) {
            let data = await handleImageUpload(images[i], match.params.id);
            uImages.push(data);
          }
          setbImages([...bImages, ...uImages]);
          setImages([]);
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
      console.log(response.data)
      setEvent(response.data.event);
      setbImages(response.data.images);
    };
    fetchEvent();
  }, [match.params.id]);

  const handleChange = (e) => {
    console.log(`Enter handlechange ${e.target.name} ${e.target.value}`);
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
      return;
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
          console.log(event)
          console.log(event.event_type);
          const formData = new FormData();
          formData.append("eventname", event.eventname);
          formData.append("endtime", event.endtime);
          formData.append("description", event.description);
          formData.append("starttime", event.starttime);
          formData.append("enable", event.enable);
          formData.append("student", event.student);
          formData.append("event_type" , event.event_type);
          formData.append("url" , event.url);
          for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
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
    <>
      <div className="border-bottom">
        <div className="container protected-text mt-3">
          <h1 className="mb-4 edit-marker-header ps-3">แก้ไขอีเวนท์</h1>
        </div>
      </div>
      <div className="container mt-4 mb-5">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div class="col-8 edit-marker-text">
            {notification && (
              <div className="card mb-3 bg-white">
                <div className="card-body">
                  <p className="card-text">
                    <b>การรายงาน</b>
                  </p>
                  <p className="card-text">
                    อีเวนท์ ID <strong>{notification.event}</strong>{" "}
                    ถูกรายงานด้วยเหตุผล: <strong>{notification.reason}</strong>
                  </p>
                  <p className="card-text">
                    รายละเอียด: <strong>{notification.details}</strong>
                  </p>
                  <p className="card-text">
                    โดยผู้ใช้ <strong>{notification.created_user}</strong>
                  </p>
                  <p className="card-text">
                    เมื่อเวลา:{" "}
                    <strong>
                      {new Date(notification.created_time).toLocaleString()}
                    </strong>
                  </p>
                  <div className="text-end">
                    {" "}
                    <button onClick={updateReport} className="kmitl-button p-3">
                      ยืนยันการตรวจสอบ
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="border py-3 px-4 fw-bold">
              <div className="form-group">
                <label htmlFor="eventname">Event Name</label>
                <input
                  type="text"
                  className="form-control placeholder-input"
                  id="eventname"
                  name="eventname"
                  value={event.eventname}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  className="form-control placeholder-input"
                  id="description"
                  name="description"
                  rows="3"
                  value={event.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="event_type">Event Type</label>
                <select
                  className="form-control placeholder-input"
                  id="event_type"
                  name="event_type"
                  value={event.event_type}
                  onChange={handleChange}
                >
                  <option value={0}>ประเภทปักหมุด</option>
                  <option value={1}>ประเภทลิงค์ภายนอก</option>
                </select>
              </div>


              {parseInt(event.event_type) ===  1 && (
                <div className="form-group">
                  <label htmlFor="url">Event Link</label>
                  <input
                    type="text"
                    name="url"
                    id="url"
                    className="form-control placeholder-input"
                    value={event.url}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="starttime">StartTime</label>
                <input
                  type="datetime-local"
                  name="starttime"
                  id="starttime"
                  className="form-control placeholder-input"
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
                  className="form-control placeholder-input"
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
                  className="form-control placeholder-input"
                  value={event.student}
                  onChange={handleChange}
                />
              </div>

              <div className="form-check">
                <p htmlFor="enable" className="my-0">
                  สถานะการเปิดใช้งาน
                </p>
                <input
                  type="checkbox"
                  name="enable"
                  id="enable"
                  className="form-check-input  mx-2"
                  checked={event.enable}
                  onChange={(e) =>
                    setEvent((prevEvent) => ({
                      ...prevEvent,
                      enable: e.target.checked ? 1 : 0,
                    }))
                  }
                />
              </div>

              <div className="text-end">
                <button type="submit" className="kmitl-button p-3">
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
            <div className="border py-3 px-4">
              <div>
                <div>
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
                      <div>
                        <div className="d-flex justify-content-between edit-marker-text fw-bold">
                          <p htmlFor="images">รูปภาพ</p>
                          <div className="upload__image-wrapper">
                            <button
                              className="default-kmitl-button py-3 px-2 mx-2"
                              style={isDragging ? { color: "red" } : undefined}
                              onClick={onImageUpload}
                              {...dragProps}
                            >
                              เพิ่มรูปภาพ หรือ ลากวาง
                            </button>
                            <button
                              className="default-kmitl-button py-3 px-2 mx-2"
                              onClick={onImageRemoveAll}
                            >
                              ลบรูปภาพทั้งหมด
                            </button>
                            <button
                              type="submit"
                              className="kmitl-button py-3 px-2 mx-2"
                              onClick={(e) => {
                                e.preventDefault();
                                uploadimage();
                              }}
                            >
                              บันทึกรูปภาพ
                            </button>
                          </div>
                        </div>
                        <div className="row">
                          <h3>ส่วนที่เพิ่ม</h3>
                          {imageList.map((image, index) => (
                            <div key={index} className="image-item col-12 col-md-6 col-lg-3">
                              <img src={image["data_url"]} alt="" width="100" />
                              <div className="image-item__btn-wrapper">
                                <button
                                  className="default-kmitl-button p-2"
                                  onClick={() => onImageRemove(index)}
                                >
                                  ลบรูปภาพนี้
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </ImageUploading>
                </div>
                <div className="row">
                  {bImages?.map((image) => (
                    <div key={image.id} className="image-item col-12 col-md-6 col-lg-3">
                      <div className="col-3">
                        <img src={image.dataURL} alt="" width="100" />
                      </div>
                      <div className="image-item__btn-wrapper">
                        <button
                          className="default-kmitl-button p-2 my-2"
                          onClick={() => onBImageRemove(image.id)}
                        >
                          ลบรูปภาพนี้
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditEvent;
