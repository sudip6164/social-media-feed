import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../pages/context/user.context';
import { createUser, getUsers } from '../../utils/user.utils';

const Signup = () => {
  const navigate = useNavigate();
  const { _setUser } = useContext(UserContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    dob: '',
    bio: '',
    joined: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateStep = (step) => {
    let valid = true;
    if (step === 1) {
      const { username, email, password } = formData;
      if (!username) {
        document.getElementById('username').classList.add('is-invalid');
        valid = false;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('email').classList.add('is-invalid');
        valid = false;
      }
      if (!password) {
        document.getElementById('password').classList.add('is-invalid');
        valid = false;
      }
    } else if (step === 2) {
      const { fullName, dob } = formData;
      if (!fullName) {
        document.getElementById('fullName').classList.add('is-invalid');
        valid = false;
      }
      if (!dob) {
        document.getElementById('dob').classList.add('is-invalid');
        valid = false;
      }
    }
    return valid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      try {
        const users = await getUsers();
        const userExists = users.some(
          (u) => u.username === formData.username || u.email === formData.email
        );

        if (userExists) {
          setError('Username or email already exists.');
          return;
        }

        const currentDate = new Date();
        const joinedDate = currentDate.toISOString().split('T')[0];

        const newUser = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          dob: formData.dob,
          bio: formData.bio || 'Not provided',
          joined: joinedDate,
          followers: [],           
          following: [],          
          followerCount: 0,       
          followingCount: 0,      
        };

        await createUser(newUser);

        const updatedUsers = await getUsers();
        const createdUser = updatedUsers.find((u) => u.email === formData.email);

        _setUser(createdUser);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const progress = ((currentStep - 1) / 2) * 100;

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 signup-card auth-card">
        <h3 className="text-center mb-4">Sign Up</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="progress mb-3" style={{ height: '5px' }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <form id="signupForm" onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          <div className={`form-step ${currentStep === 1 ? 'active' : ''}`} data-step="1">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control rounded-pill"
                id="username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Please enter a username.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control rounded-pill"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Please enter a valid email.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control rounded-pill"
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Please enter a password.</div>
            </div>
            <button type="button" className="btn btn-primary w-100 next-btn" onClick={handleNext}>
              Next
            </button>
          </div>

          {/* Step 2: Personal Details */}
          <div className={`form-step ${currentStep === 2 ? 'active' : ''}`} data-step="2">
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control rounded-pill"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Please enter your full name.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="dob" className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control rounded-pill"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Please select your date of birth.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="bio" className="form-label">Bio (Optional)</label>
              <textarea
                className="form-control"
                id="bio"
                name="bio"
                rows="3"
                placeholder="Tell us about yourself"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-outline-primary prev-btn" onClick={handlePrevious}>
                Previous
              </button>
              <button type="button" className="btn btn-primary next-btn" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>

          {/* Step 3: Confirmation */}
          <div className={`form-step ${currentStep === 3 ? 'active' : ''}`} data-step="3">
            <div className="text-center mb-3">
              <h5>Review Your Info</h5>
              <p className="text-muted">Please confirm your details below:</p>
            </div>
            <div className="mb-3">
              <p><strong>Username:</strong> <span>{formData.username}</span></p>
              <p><strong>Email:</strong> <span>{formData.email}</span></p>
              <p><strong>Full Name:</strong> <span>{formData.fullName}</span></p>
              <p><strong>Date of Birth:</strong> <span>{formData.dob}</span></p>
              <p><strong>Bio:</strong> <span>{formData.bio || 'Not provided'}</span></p>
              <p><strong>Joined:</strong> <span>{formData.joined || 'Will be set on signup'}</span></p>
            </div>
            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-outline-primary prev-btn" onClick={handlePrevious}>
                Previous
              </button>
              <button type="submit" className="btn btn-primary">Sign Up</button>
            </div>
          </div>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login" className="text-primary">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;