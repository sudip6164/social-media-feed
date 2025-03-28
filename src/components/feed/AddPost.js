import { useState, useContext } from 'react';
import { UserContext } from '../../pages/context/user.context';
import defaultProfilePic from '../../assets/img/defaultProfile.jpg';

const AddPost = ({ onPostSubmit }) => {
  const { user } = useContext(UserContext);
  const [thoughts, setThoughts] = useState('');
  const [photoFile, setPhotoFile] = useState(null); // Store the file
  const [photoPreview, setPhotoPreview] = useState(null); // For preview

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file); // Store the raw file
      setPhotoPreview(URL.createObjectURL(file)); // Temporary preview
      console.log("File selected:", file); // Debug log
    }
  };

  const handleSubmit = () => {
    if (!thoughts && !photoFile) return;
    if (!user) return;

    const newPost = {
      username: user.fullName,
      role: "Web Developer at Stackbros",
      time: "Just now",
      content: thoughts,
      image: photoFile, // Pass the file to the parent
      likes: 0,
      comments: 0,
      shares: 0,
    };

    onPostSubmit(newPost);
    setThoughts('');
    setPhotoFile(null);
    setPhotoPreview(null);
    const modal = window.bootstrap.Modal.getInstance(document.querySelector('#shareThoughtsModal'));
    modal.hide();
  };

  return (
    <div className="share-thoughts-card">
      <div className="d-flex align-items-center mb-2">
        <img
          src={defaultProfilePic}
          alt="Profile"
          className="profile-pic me-2"
          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
        />
        <input
          type="text"
          className="form-control rounded-pill"
          placeholder="Share your thoughts..."
          readOnly
          data-bs-toggle="modal"
          data-bs-target="#shareThoughtsModal"
        />
      </div>
      <div className="d-flex justify-content-between mt-2">
        <button
          className="btn btn-sm text-white"
          style={{ backgroundColor: '#28a745' }}
          data-bs-toggle="modal"
          data-bs-target="#shareThoughtsModal"
        >
          <i className="fas fa-camera me-1"></i> Photo
        </button>
        {/* Other buttons unchanged */}
      </div>

      {/* Share Thoughts Modal */}
      <div className="modal fade" id="shareThoughtsModal" tabIndex="-1" aria-labelledby="shareThoughtsModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="shareThoughtsModalLabel">Add post photo</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form id="shareThoughtsForm">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={defaultProfilePic}
                    alt="Profile"
                    className="profile-pic me-2"
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
                  />
                  <textarea
                    className="form-control"
                    placeholder="Share your thoughts..."
                    rows="2"
                    style={{ resize: 'none' }}
                    value={thoughts}
                    onChange={(e) => setThoughts(e.target.value)}
                  />
                </div>
                <div className="upload-area mb-3">
                  <div className="drag-drop-area text-center p-4" style={{ border: '2px dashed #ccc' }}>
                    <i className="fas fa-images fa-2x mb-2"></i>
                    <p>Drag here or click to upload photo.</p>
                    <label htmlFor="photoUpload" style={{ cursor: 'pointer', display: 'block' }}>
                      <input
                        type="file"
                        id="photoUpload"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }} // Hidden but clickable via label
                      />
                      Click here to select a file
                    </label>
                    {photoPreview && <img src={photoPreview} alt="Uploaded" style={{ maxWidth: '100%', marginTop: '10px' }} />}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-danger" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn btn-primary" id="postButton" onClick={handleSubmit}>
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;