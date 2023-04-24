import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ImageUploading from "react-images-uploading";
import useAxios from "../../utils/useAxios";
import "./editMarkerPage.css";
import Swal from "sweetalert2";

const EditMarker = ({ match }) => {
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
          .put(`/updatemarkerreport/${notification.report_marker_id}`, {
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

  function deleteComments(id) {
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
          .delete(`/destroyComment/${id}`)
          .then(() => {
            setComments((prevComments) =>
              prevComments.filter((data, i) => data.comment_id !== id)
            );
            Swal.close();
            Swal.fire("อัพเดทข้อมูลสำเร็จ", "", "success");
          })
          .catch((e) => Swal.fire(" อัพเดทข้อมูลล้มเหลว", "", "error"));
      } else Swal.fire(" ยกเลิก", "", "error");
    });
  }

  const [marker, setMarker] = useState({
    id: "",
    name: "",
    place: "",
    address: "",
    description: "",
    type: "",
    enable: 1,
    createtime: "",
    created_user: "",
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
        api
          .delete(`/destroyImage/${id}`)
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

  async function handleImageUpload(image, markerId) {
    const formData = new FormData();
    formData.append("file", image.file);
    formData.append("marker_id", markerId);

    try {
      const response = await api.post("/uploadImages/", formData);
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

  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchMarker = async () => {
      const response = await api.get(`/marker/${match.params.id}`);
      response.data.marker.createtime = formatDateForInput(
        response.data.marker.createtime
      );
      setMarker(response.data.marker);
      setbImages(response.data.images);
      setComments(response.data.comments);
    };
    fetchMarker();
  }, [match.params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMarker((prevMarker) => ({
      ...prevMarker,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(marker);

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
          formData.append("name", marker.name);
          formData.append("place", marker.place);
          formData.append("address", marker.address);
          formData.append("description", marker.description);
          formData.append("type", marker.type);
          formData.append("enable", marker.enable);
          formData.append("created_user", marker.created_user);
          api
            .put(`/editMarker/${match.params.id}`, formData)
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
        Swal.fire("อัพเดทข้อมูลสำเร็จ", "", "success");
      } else Swal.fire(" ยกเลิก", "", "error");
    });
  };

  return (
    <>
      <div className="border-bottom">
        <div className="container protected-text mt-3">
          <h1 className="mb-4 edit-marker-header ps-3">แก้ไขปักหมุด</h1>
        </div>
      </div>

      <div className="d-flex flex-column justify-content-center align-items-center border-bottom mt-3">
        <ul class="nav nav-pills edit-list" id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              รายละเอียด
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
            >
              ความคิดเห็น
            </button>
          </li>
        </ul>
      </div>

      <div className="container mt-4 mb-5">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div class="col-8 edit-marker-text">
            <div class="tab-content" id="pills-tabContent">
              <div
                class="tab-pane fade show active"
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
              >
                <div>
                  {notification && (
                    <div className="card mb-3 bg-white">
                      <div className="card-body">
                        <p className="card-text">
                          <b>การรายงาน</b>
                        </p>
                        <p className="card-text">
                          ปักหมุด ID <strong>{notification.id}</strong>{" "}
                          ถูกรายงานด้วยเหตุผล:{" "}
                          <strong>{notification.reason}</strong>
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
                            {new Date(
                              notification.created_time
                            ).toLocaleString()}
                          </strong>
                        </p>
                        <div className="text-end">
                          {" "}
                          <button
                            onClick={updateReport}
                            className="kmitl-button p-3"
                          >
                            ยืนยันการตรวจสอบ
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className="border py-3 px-4 fw-bold"
                  >
                    <div className="form-group">
                      <label htmlFor="name">ชื่อ</label>
                      <input
                        type="text"
                        className="form-control placeholder-input"
                        id="name"
                        name="name"
                        value={marker.name}
                        placeholder="ชื่อปักหมุด"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="place">สถานที่</label>
                      <input
                        type="text"
                        className="form-control placeholder-input"
                        id="place"
                        name="place"
                        placeholder="สถานที่"
                        value={marker.place}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">ที่อยู่</label>
                      <input
                        type="text"
                        className="form-control placeholder-input"
                        id="address"
                        name="address"
                        placeholder="ที่อยู่"
                        value={marker.address}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">รายละเอียด</label>
                      <textarea
                        className="form-control placeholder-input"
                        id="description"
                        name="description"
                        placeholder="รายละเอียด"
                        rows="3"
                        value={marker.description}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="type">ประเภท</label>
                      <select
                        type="text"
                        name="type"
                        id="type"
                        className="form-control placeholder-input"
                        placeholder="ประเภทปักหมุด"
                        value={marker.type}
                        onChange={handleChange}
                      >
                        <option value="ทั่วไป">ทั่วไป</option>
                        <option value="อาคารเรียน">อาคารเรียน</option>
                        <option value="ร้านอาหาร">ร้านอาหาร</option>
                        <option value="ห้องเรียน">ห้องเรียน</option>
                        <option value="ตึก">ตึก</option>
                        <option value="หอพัก">หอพัก</option>
                        <option value="ร้านค้า">ร้านค้า</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="createtime">Create Time</label>
                      <input
                        type="datetime-local"
                        name="createtime"
                        id="createtime"
                        className="form-control placeholder-input"
                        value={marker.createtime}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="created_user">Created By</label>
                      <input
                        type="text"
                        name="created_user"
                        id="created_user"
                        className="form-control placeholder-input"
                        value={marker.created_user}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <p htmlFor="enable" className="my-0">
                        สถานะการเปิดใช้งาน
                      </p>
                      <input
                        type="checkbox"
                        name="enable"
                        id="enable"
                        className="form-check-input mx-2"
                        checked={marker.enable}
                        onChange={(e) =>
                          setMarker((prevMarker) => ({
                            ...prevMarker,
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
                </div>
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
                                  style={
                                    isDragging ? { color: "red" } : undefined
                                  }
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
                                  <img
                                    src={image["data_url"]}
                                    alt=""
                                    width="100"
                                  />
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
              <div
                class="tab-pane fade"
                id="pills-profile"
                role="tabpanel"
                aria-labelledby="pills-profile-tab"
              >
                <div className="border fw-bold">
                  <p htmlFor="comments" className="edit-marker-header">
                    ความคิดเห็นทั้งหมด
                  </p>
                  <ul>
                    {comments.map((comment, _) => (
                      <div className="row" key={comment.comment_id}>
                        <div className="col-3 kmitl-color ">
                          {comment.comment_student}
                        </div>
                        <div className="col-3">{comment.content}</div>
                        <div className="col-3">
                          {new Date(comment.createtime).toLocaleString()}
                        </div>
                        <div className="col-3">
                          <button
                            className="btn btn-danger btn-sm ml-4"
                            onClick={(e) => {
                              e.preventDefault();
                              deleteComments(comment.comment_id);
                            }}
                          >
                            ลบความคิดเห็น
                          </button>
                        </div>
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditMarker;
