import { useState, useEffect } from 'react';
import defaultProfilePic from '../../assets/img/defaultProfile.jpg';

const Post = ({ 
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

  // Calculate time since post was created
  useEffect(() => {
    if (createdAt) {
      const calculateTimeAgo = () => {
        const postDate = new Date(createdAt);
        const now = new Date();
        const seconds = Math.floor((now - postDate) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
          setTimeAgo(`${interval} year${interval === 1 ? '' : 's'} ago`);
          return;
        }
        
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
          setTimeAgo(`${interval} month${interval === 1 ? '' : 's'} ago`);
          return;
        }
        
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          setTimeAgo(`${interval} day${interval === 1 ? '' : 's'} ago`);
          return;
        }
        
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          setTimeAgo(`${interval} hour${interval === 1 ? '' : 's'} ago`);
          return;
        }
        
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
          setTimeAgo(`${interval} minute${interval === 1 ? '' : 's'} ago`);
          return;
        }
        
        setTimeAgo('Just now');
      };

      calculateTimeAgo();
      // Update time ago every minute
      const timer = setInterval(calculateTimeAgo, 60000);
      return () => clearInterval(timer);
    }
  }, [createdAt]);

  return (
    <div className="card post-card mb-3">
      <div className="card-body">
        {/* Post Header - Exactly like before */}
        <div className="d-flex align-items-center mb-2">
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

        {/* Post Content - Same as original */}
        <p>{content}</p>

        {/* Post Image - Same styling */}
        {image && <img src={image} alt="Post" className="post-image" style={{ maxWidth: '100%' }} />}

        {/* Post Actions - Original styling */}
        <div className="d-flex justify-content-between mt-2">
          <span>
            <i className="fas fa-thumbs-up"></i> Liked ({likes})
          </span>
          <span>
            <i className="fas fa-comment"></i> Comments ({comments})
          </span>
          <span>
            <i className="fas fa-share"></i> Share ({shares})
          </span>
        </div>
      </div>
    </div>
  );
};

export default Post;