import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultProfilePic from '../../assets/img/defaultProfile.jpg';
import { deletePost } from '../../utils/post.utils';

const Post = ({ 
  id, // Add id prop
  userId, 
  username, 
  role, 
  createdAt, 
  content, 
  image, 
  likes, 
  comments, 
  shares 
}) => {
  const [timeAgo, setTimeAgo] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

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
      window.location.reload(); // Refresh to update feed (could be improved with state management)
    } catch (error) {
      console.error("Error deleting post:", error);
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
                  onClick={() => navigate(`/edit-post/${id}`)}
                >
                  Edit Post
                </button>
                <button
                  className="dropdown-item text-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <p>{content}</p>
        {image && <img src={image} alt="Post" className="post-image" style={{ maxWidth: '100%' }} />}

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
    </div>
  );
};

export default Post;