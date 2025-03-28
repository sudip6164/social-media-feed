// src/pages/user/EditProfile.jsx
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import { updateUser } from '../../utils/user.utils';
import defaultProfilePic from '../../assets/img/defaultProfile.jpg';

const EditProfile = () => {
  const { user, _setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    headline: '',
    bio: '',
    profilePic: '', // Base64 string or empty
  });
  const [photoFile, setPhotoFile] = useState(null); // Raw file for upload
  const [photoPreview, setPhotoPreview] = useState(null); // Preview URL
  const [error, setError] = useState('');

  // Load user data into form on mount
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        headline: user.headline || '',
        bio: user.bio || '',
        profilePic: user.profilePic || '',
      });
      setPhotoPreview(user.profilePic || defaultProfilePic); // Show current pic or default
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file)); // Temporary preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let profilePicBase64 = formData.profilePic;
      if (photoFile) {
        // Convert new photo to base64
        profilePicBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(photoFile);
        });
      }

      const updatedUserData = {
        fullName: formData.fullName,
        headline: formData.headline,
        bio: formData.bio,
        profilePic: profilePicBase64,
      };

      await updateUser(user.id, updatedUserData);
      const updatedUser = { ...user, ...updatedUserData };
      _setUser(updatedUser); // Update context
      navigate('/profile'); // Redirect back to profile
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  if (!user) return <div className="text-center mt-5">Please log in to edit your profile.</div>;

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card auth-card" style={{ width: '400px' }}> {/* Same width as Login */}
        <h3 className="text-center mb-4">Edit Profile</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="mb-3 text-center">
            <img
              src={photoPreview || defaultProfilePic}
              alt="Profile Preview"
              className="profile-pic mb-2"
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <label htmlFor="profilePicUpload" className="btn btn-outline-primary btn-sm rounded-pill">
                Change Photo
                <input
                  type="file"
                  id="profilePicUpload"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control rounded-pill"
              id="fullName"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Headline */}
          <div className="mb-3">
            <label htmlFor="headline" className="form-label">Headline</label>
            <input
              type="text"
              className="form-control rounded-pill"
              id="headline"
              name="headline"
              placeholder="Enter headline (e.g., Software Engineer)"
              value={formData.headline}
              onChange={handleChange}
            />
          </div>

          {/* Bio */}
          <div className="mb-3">
            <label htmlFor="bio" className="form-label">Bio</label>
            <textarea
              className="form-control rounded"
              id="bio"
              name="bio"
              placeholder="Tell us about yourself"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              style={{ resize: 'none' }}
            />
          </div>

          {/* Buttons */}
          <button type="submit" className="btn btn-primary w-100 rounded-pill mb-2">
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary w-100 rounded-pill"
            onClick={() => navigate('/profile')}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;