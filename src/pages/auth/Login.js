import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../pages/context/user.context';
import { checkLogin } from '../../utils/user.utils';

const Login = () => {
  const navigate = useNavigate();
  const { _setUser } = useContext(UserContext); // Access _setUser from context
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await checkLogin(formData.email, formData.password);
      if (user === null) {
        setError('Invalid email or password.');
        localStorage.setItem('is_login', '0');
      } else {
        _setUser(user); // Set the user in context
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card auth-card">
        <h3 className="text-center mb-4">Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="text"
              className="form-control rounded-pill"
              id="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
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