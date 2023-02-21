const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start">
      <div className="container p-4">
        <div className="row">
          <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
            <h5 className="text-uppercase">My Site</h5>
            <p>A simple and beautiful website built with React and Bootstrap 5</p>
          </div>
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Links</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="/" className="text-dark">Home</a>
              </li>
              <li>
                <a href="/login" className="text-dark">Login</a>
              </li>
              <li>
                <a href="/register" className="text-dark">Register</a>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Contact</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#!" className="text-dark">Email Us</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Call Us</a>
              </li>
              <li>
                <a href="#!" className="text-dark">Visit Us</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2021 My Site
      </div>
    </footer>
  );
};

export default Footer;
