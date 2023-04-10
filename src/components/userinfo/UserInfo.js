function UserInfo({ user }) {
  return (
    <div className="d-inline-block">
      <h3 className="fw-bold">{user.username}</h3>
    </div>
  );
}

export default UserInfo;
