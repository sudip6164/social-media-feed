import { useState, useEffect } from 'react';
import defaultProfilePic from '../../assets/img/defaultProfile.jpg';
import { deletePost, updatePost } from '../../utils/post.utils';

const Post = ({ 
  id, // String ID (e.g., "a87d")
  userId, 
  username, 
  role, 
  createdAt, 
  content, 
  image, 
  likes, 
  comments, 
  shares,
  onUpdate // Callback to update feed without refresh
}) => {
  const [timeAgo, setTimeAgo] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [thoughts, setThoughts] = useState(content || ''); // Pre-filled content
  const [photoFile, setPhotoFile] = useState(null); // New file if updated
  const [photoPreview, setPhotoPreview] = useState(image || ''); // Existing or new image preview

  useEffect(() => {
    if (createdAt) {
      const calculateTimeAgo = () => {
        const postDate = new Date(createdAt);
        const now = new Date();
        const seconds = Math.floor((now - postDate) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return setTimeAgo(`${interval} year${interval === 1 ? '' : 's'} ago`);
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return setTimeAgo(`${interval} month${interval === 1 ? '' : 's'} ago`);
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return setTimeAgo(`${interval} day${interval === 1 ? '' : 's'} ago`);
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return setTimeAgo(`${interval} hour${interval === 1 ? '' : 's'} ago`);
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return setTimeAgo(`${interval} minute${interval === 1 ? '' : 's'} ago`);
        setTimeAgo('Just now');
      };

      calculateTimeAgo();
      const timer = setInterval(calculateTimeAgo, 60000);
      return () => clearInterval(timer);
    }
  }, [createdAt]);

  const handleDelete = async () => {
    try {
      await deletePost(id);
      setShowDeleteModal(false);
      if (onUpdate) {
        console.log("Deleting post with ID:", id);
        onUpdate(id, null);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      console.log("Photo uploaded:", file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageBase64 = image; // Default to existing image
      if (photoFile) {
        // Convert new file to Base64
        imageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(photoFile);
        });
        console.log("New image Base64:", imageBase64.substring(0, 50)); // Log start of Base64
      } else {
        console.log("No new photo, using existing image:", imageBase64);
      }

      const updatedPost = {
        content: thoughts,
        image: imageBase64 || '', // Use new Base64 or existing if unchanged
      };

      console.log("Sending update for post ID:", id, "Data:", updatedPost);
      const result = await updatePost(id, updatedPost);
      console.log("Update result:", result);

      setShowEditModal(false);
      setPhotoFile(null); // Reset after successful update
      setPhotoPreview(result.image || ''); // Update preview to match result

      if (onUpdate) {
        onUpdate(id, result);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="card post-card mb-3">
      <div className="card-body">
        <div className="d-flex align-items-center mb-2 justify-content-between">
          <div className="d-flex align-items-center">
            <img
              src={defaultProfilePic}
              alt="Profile"
              className="profile-pic me-2"
            />
            <div>
              <strong>{username}</strong><br />
              <small className="text-muted">{role} • {timeAgo}</small>
            </div>
          </div>
          <div className="position-relative">
            <button
              className="btn btn-link p-0"
              onClick={() => setShowMenu(!showMenu)}
            >
              <i className="fas fa-ellipsis-h"></i>
            </button>
            {showMenu && (
              <div className="dropdown-menu show" style={{ position: 'absolute', right: 0 }}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowEditModal(true);
                    setShowMenu(false);
                  }}
                >
                  Edit Post
                </button>
                <button
                  className="dropdown-item text-danger"
                  onClick={() => {
                    setShowDeleteModal(true);
                    setShowMenu(false);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <p>{content}</p>
        {image && (
          <img
            src={image}
            alt="Post"
            style={{
              width: '300px',
              height: '200px',
              objectFit: 'contain',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        )}

        <div className="d-flex justify-content-between mt-2">
          <span><i className="fas fa-thumbs-up"></i> Liked ({likes})</span>
          <span><i className="fas fa-comment"></i> Comments ({comments})</span>
          <span><i className="fas fa-share"></i> Share ({shares})</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className={`modal fade ${showDeleteModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Post</h5>
              <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Post Modal */}
      <div className={`modal fade ${showEditModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Post</h5>
              <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit}>
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
                    rows="3"
                    value={thoughts}
                    onChange={(e) => setThoughts(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editPhotoUpload" className="form-label">Update Photo</label>
                  <input
                    type="file"
                    id="editPhotoUpload"
                    accept="image/*"
                    className="form-control"
                    onChange={handlePhotoUpload}
                  />
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      style={{
                        width: '300px',
                        height: '100px',
                        objectFit: 'contain',
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: '10px',
                      }}
                    />
                  )}
                </div>
                <div className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;