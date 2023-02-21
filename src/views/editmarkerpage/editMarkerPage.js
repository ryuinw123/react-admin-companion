import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const EditMarker = ({ match }) => {
  const [marker, setMarker] = useState({
    id: "",
    name: "",
    place: "",
    address: "",
    description: "",
    type: "",
    enable: false,
    createtime: "",
    created_user: "",
  });

  const [images, setImages] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    console.log(match.params.id);
    const fetchMarker = async () => {
      const response = await axios.get(`/markers/${match.params.id}`);
      setMarker(response.data);
      setImages(response.data.image);
      setComments(response.data.comment);
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

  const handleImageChange = (e) => {
    const files = e.target.files;
    setImages([...images, ...files]);
  };

  const handleCommentDelete = (index) => {
    const newComments = [...comments];
    newComments.splice(index, 1);
    setComments(newComments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", marker.name);
      formData.append("place", marker.place);
      formData.append("address", marker.address);
      formData.append("description", marker.description);
      formData.append("type", marker.type);
      formData.append("enable", marker.enable);
      formData.append("created_user", marker.created_user);
      images.forEach((image) => {
        formData.append("image", image);
      });
      comments.forEach((comment) => {
        formData.append("comment", comment);
      });
      await axios.put(`/markers/${match.params.id}`, formData);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Edit Marker</h1>
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
          <input type="text"
name="type"
id="type"
className="form-control"
value={marker.type}
onChange={handleChange}
/>
</div>
<div className="form-group">
      <label htmlFor="enable">Enable</label>
      <input
        type="checkbox"
        name="enable"
        id="enable"
        className="form-control"
        checked={marker.enable}
        onChange={(e) =>
          setMarker((prevMarker) => ({
            ...prevMarker,
            enable: e.target.checked,
          }))
        }
      />
    </div>
    <div className="form-group">
      <label htmlFor="createtime">Create Time</label>
      <input
        type="text"
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
    <div className="form-group">
      <label htmlFor="images">Images</label>
      <input
        type="file"
        name="images"
        id="images"
        className="form-control"
        multiple
        onChange={(e) => {
          setImages(e.target.files);
        }}
      />
    </div>
    <div className="form-group">
      <label htmlFor="comments">Comments</label>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>
            {comment}
            <button
              className="btn btn-danger btn-sm ml-2"
              onClick={() => {
                setComments((prevComments) =>
                  prevComments.filter((_, i) => i !== index)
                );
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="d-flex">
        <input
          type="text"
          name="newComment"
          id="newComment"
          className="form-control"
          placeholder="Add new comment"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        <button
          className="btn btn-primary ml-2"
          onClick={() => {
            setComments((prevComments) => [
              ...prevComments,
              comments.trim(),
            ]);
            setComments("");
          }}
        >
          Add
        </button>
      </div>
    </div>
    <button type="submit" className="btn btn-primary">
      Submit
    </button>
    </form>
</div>); }
export default EditMarker;