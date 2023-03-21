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
    <div className="container mt-4">
      <div className="border border-primary">
        <h1 className="mb-4">Edit Marker</h1>
        {notification && (
          <div className="card bg-light mb-3">
            <div className="card-header">Notification</div>
            <div className="card-body">
              <p className="card-text">
                A marker with ID <strong>{notification.id}</strong> has been
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
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={marker.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="place">Place</label>
            <input
              type="text"
              className="form-control"
              id="place"
              name="place"
              value={marker.place}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={marker.address}
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
              value={marker.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              type="text"
              name="type"
              id="type"
              className="form-control"
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
          <div className="form-check">
            <label htmlFor="enable" className="form-check-label">
              Enable
            </label>
            <input
              type="checkbox"
              name="enable"
              id="enable"
              className="form-check-input"
              checked={marker.enable}
              onChange={(e) =>
                setMarker((prevMarker) => ({
                  ...prevMarker,
                  enable: e.target.checked ? 1 : 0,
                }))
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="createtime">Create Time</label>
            <input
              type="datetime-local"
              name="createtime"
              id="createtime"
              className="form-control"
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
              className="form-control"
              value={marker.created_user}
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
      <div className="border border-danger">
        <label htmlFor="comments">Comments</label>
        <ul>
          {comments.map((comment, _) => (
            <li key={comment.comment_id}>
              {comment.content}
              <button
                className="btn btn-danger btn-sm ml-4"
                onClick={(e) => {
                  e.preventDefault();
                  deleteComments(comment.comment_id);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default EditMarker;
