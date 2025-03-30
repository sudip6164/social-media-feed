import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../pages/context/user.context';
import { getPostsByUser } from '../../utils/post.utils';
import defaultProfilePic from '../../assets/img/defaultProfile.jpg';

const LeftSidebar = () => {
  const { user } = useContext(UserContext);
  const [postCount, setPostCount] = useState(0); 

  useEffect(() => {
    if (!user) return;

    const fetchUserPosts = async () => {
      try {
        const userPosts = await getPostsByUser(user.id);
        setPostCount(userPosts.length);
      } catch (error) {
        console.error("Error fetching user posts:", error);
        setPostCount(0);
      }
    };

    fetchUserPosts();
  }, [user]); 

  if (!user) return null;

  // Parse the joined date (YYYY-MM-DD) and format it as "Month Day, Year"
  let formattedJoinedDate = 'Not available';
  if (user.joined) {
    const date = new Date(user.joined);
    if (!isNaN(date)) {
      formattedJoinedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  }

  return (
    <div className="sidebar">
      <div className="text-center">
        <img src={user.profilePic || defaultProfilePic} alt="Profile Pic" className="profile-pic" />
        <h5 className="mt-3">{user.fullName}</h5>
        <p className="text-muted">{user.headline}</p>
        <p className="text-muted">"{user.bio}"</p>
        <p className="text-muted">Joined: {formattedJoinedDate}</p>
        <div className="d-flex justify-content-around mb-3">
          <div>
            <strong>{postCount}</strong><br />Post
          </div>
          <div>
            <strong>{user.followerCount || 0}</strong><br />Followers
          </div>
          <div>
            <strong>{user.followingCount || 0}</strong><br />Following
          </div>
        </div>
      </div>
      <nav className="nav flex-column">
        <Link className="nav-link" to="/">
          <i className="fas fa-home"></i> Feed
        </Link>
        <Link className="nav-link" to="/connections">
          <i className="fas fa-users"></i> Connections
        </Link>
        <Link className="nav-link" to="/news">
          <i className="fas fa-globe"></i> Latest News
        </Link>
        <Link className="nav-link" to="/notifications">
          <i className="fas fa-bell"></i> Notifications
        </Link>
        <Link className="nav-link" to="/settings">
          <i className="fas fa-cog"></i> Settings
        </Link>
      </nav>
      <Link to="/profile">
        <button className="btn btn-primary w-100 mt-3">View Profile</button>
      </Link>
      <div className="text-muted mt-4 small">
        <a href="/" className="text-muted me-2">About</a>
        <a href="/" className="text-muted me-2">Settings</a>
        <a href="/" className="text-muted me-2">Support</a>
        <a href="/" className="text-muted me-2">Docs</a>
        <a href="/" className="text-muted me-2">Help</a>
        <a href="/" className="text-muted me-2">Privacy & Terms</a>
        <p>© 2025</p>
      </div>
    </div>
  );
};

export default LeftSidebar;