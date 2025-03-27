import { useState } from 'react';
import { Link } from 'react-router-dom'; // For navigation links

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login form submitted:', formData);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card auth-card">
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username or Email</label>
            <input
              type="text"
              className="form-control rounded-pill"
              id="username"
              name="username"
              placeholder="Enter username or email"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control rounded-pill"
              id="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 rounded-pill">Login</button>
          <p className="text-center mt-3">
            {/* <a href="/" className="text-muted">Forgot Password?</a> */}
          </p>
          <p className="text-center">
            Don't have an account? <Link to="/signup" className="text-primary">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;