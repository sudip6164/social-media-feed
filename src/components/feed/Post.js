import { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import defaultProfilePic from '../../assets/img/defaultProfile.jpg';
import { deletePost, updatePost } from '../../utils/post.utils';
import { UserContext } from '../../pages/context/user.context';
import { getUser } from '../../utils/user.utils';

const Post = ({ 
  id, 
  userId,
  username, 
  headline, 
  createdAt, 
  content, 
  image, 
  likes, 
  comments: initialCommentsCount,
  shares,
  likedBy = [],
  commentList = [],
  onUpdate,
  profilePic
}) => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [timeAgo, setTimeAgo] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [thoughts, setThoughts] = useState(content || '');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(image || '');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes || 0);
  const [comments, setComments] = useState(commentList || []);
  const [newComment, setNewComment] = useState('');
  const [creatorProfilePic, setCreatorProfilePic] = useState(profilePic || defaultProfilePic);

  const commentCount = comments.length;

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

  useEffect(() => {
    if (user && likedBy) {
      setIsLiked(likedBy.includes(user.id));
      setLikeCount(likes);
    }
  }, [user, likedBy, likes]);

  useEffect(() => {
    const fetchCreatorProfilePic = async () => {
      if (!profilePic && userId) {
        try {
          const creator = await getUser(userId);
          setCreatorProfilePic(creator.profilePic || defaultProfilePic);
        } catch (error) {
          console.error("Error fetching creator's profile pic:", error);
          setCreatorProfilePic(defaultProfilePic);
        }
      }
    };
    fetchCreatorProfilePic();
  }, [userId, profilePic]);

  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleDelete = async () => {
    try {
      await deletePost(id);
      setShowDeleteModal(false);
      if (onUpdate) {
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
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageBase64 = image || '';
      if (photoFile) {
        imageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(photoFile);
        });
      }

      const updatedPost = {
        content: thoughts,
        image: imageBase64,
      };

      const result = await updatePost(id, updatedPost);
      setShowEditModal(false);
      setPhotoFile(null);
      setPhotoPreview(result.image || '');

      if (onUpdate) {
        onUpdate(id, result);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
      const newLikedBy = isLiked 
        ? likedBy.filter((id) => id !== user.id) 
        : [...likedBy, user.id];

      setIsLiked(!isLiked);
      setLikeCount(newLikeCount);

      const result = await updatePost(id, { 
        likes: newLikeCount,
        likedBy: newLikedBy
      });

      if (onUpdate) {
        onUpdate(id, result);
      }
    } catch (error) {
      console.error("Error updating like:", error);
      setIsLiked(isLiked);
      setLikeCount(likeCount);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      const newCommentObj = {
        id: Date.now().toString(),
        userId: user.id,
        username: user.fullName,
        content: newComment,
        createdAt: new Date().toISOString(),
        profilePic: user.profilePic || defaultProfilePic
      };

      const updatedComments = [...comments, newCommentObj];
      setComments(updatedComments);
      setNewComment('');

      const result = await updatePost(id, {
        commentList: updatedComments
      });

      if (onUpdate) {
        onUpdate(id, result);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const isOwnProfile = location.pathname === '/profile';
  const showOptions = isOwnProfile && user && user.id === userId;

  return (
    <div className="card post-card mb-3">
      <div className="card-body">
        <div className="d-flex align-items-center mb-2 justify-content-between">
          <div className="d-flex align-items-center">
            <Link to={`/profile/${userId}`}>
              <img
                src={creatorProfilePic}
                alt="Profile"
                className="profile-pic me-2"
                style={{ cursor: 'pointer', width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
              />
            </Link>
            <div>
              <strong>{username}</strong><br />
              <small className="text-muted">{headline} • {timeAgo}</small>
            </div>
          </div>
          {showOptions && (
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
          )}
        </div>

        <p>{content}</p>
        {image && (
          <img
            src={image}
            alt="Post"
            style={{
              width: '100%',
              maxHeight: '500px',
              objectFit: 'contain',
              borderRadius: '8px',
              marginTop: '10px'
            }}
          />
        )}

        <div className="d-flex justify-content-between mt-3 pt-2 border-top">
          <button 
            className="btn btn-sm btn-link text-decoration-none"
            onClick={handleLike}
            style={{ color: isLiked ? '#007bff' : '#6c757d' }}
          >
            <i className={`fas fa-thumbs-up ${isLiked ? 'text-primary' : ''}`}></i> Like ({likeCount})
          </button>
          <button 
            className="btn btn-sm btn-link text-decoration-none text-muted"
            onClick={() => setShowCommentModal(true)}
          >
            <i className="far fa-comment"></i> Comment ({commentCount})
          </button>
          <button className="btn btn-sm btn-link text-decoration-none text-muted">
            <i className="fas fa-share"></i> Share ({shares})
          </button>
        </div>
      </div>

      {/* Delete Modal */}
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

      {/* Edit Modal */}
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
                    src={creatorProfilePic}
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
                      className="img-fluid mt-2 rounded"
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

      {/* Comment Modal */}
      <div 
        className={`modal fade ${showCommentModal ? 'show d-block' : ''}`} 
        tabIndex="-1" 
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={() => setShowCommentModal(false)}
      >
        <div 
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Comments ({commentCount})</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowCommentModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-0" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {comments.length > 0 ? (
                <div className="list-group list-group-flush">
                  {comments.map((comment) => (
                    <div key={comment.id} className="list-group-item border-0">
                      <div className="d-flex">
                        <img
                          src={comment.profilePic}
                          alt="Profile"
                          className="rounded-circle me-2"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <strong>{comment.username}</strong>
                            <small className="text-muted">
                              {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </small>
                          </div>
                          <p className="mb-0 mt-1">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="far fa-comment-dots fa-2x mb-2"></i>
                  <p>No comments yet</p>
                </div>
              )}
            </div>
            <div className="modal-footer border-top-0">
              <form onSubmit={handleCommentSubmit} className="w-100">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    aria-label="Add comment"
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={!newComment.trim()}
                  >
                    Post
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