// src/pages/user/Profile.jsx
import { useState, useEffect, useContext } from 'react';
import { getPostsByUser } from '../../utils/post.utils';
import Post from '../../components/feed/Post';
import ProfileLeftSidebar from '../../components/profile/ProfileLeftSidebar';
import ProfileConnections from '../../components/profile/ProfileConnections';
import { UserContext } from '../context/user.context';


const Profile = () => {
  const { user } = useContext(UserContext);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserPosts = async () => {
      try {
        const posts = await getPostsByUser(user.id);
        const sortedPosts = posts.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUserPosts(sortedPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user posts:", error);
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  const handlePostUpdate = (postId, updatedPost) => {
    console.log("Handling update for ID:", postId, "Updated post:", updatedPost);
    setUserPosts((prevPosts) => {
      if (!updatedPost) {
        return prevPosts.filter((post) => post.id !== postId);
      } else {
        return prevPosts.map((post) =>
          post.id === postId ? { ...post, ...updatedPost } : post
        );
      }
    });
  };

  if (!user) return <div className="text-center mt-5">Please log in to view your profile.</div>;

  if (loading) return <div className="text-center mt-5">Loading profile...</div>;

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        {/* Profile-specific Left Sidebar */}
        <div className="col-md-3">
          <ProfileLeftSidebar />
        </div>

        {/* User's Posts */}
        <div className="col-md-6">
          <div className="main-content">
            <h3>My Posts</h3>
            {userPosts.length === 0 ? (
              <div className="text-center mt-5">You haven’t posted anything yet.</div>
            ) : (
              userPosts.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  userId={post.userId}
                  username={post.username}
                  role={post.role}
                  createdAt={post.createdAt}
                  content={post.content}
                  image={post.image}
                  likes={post.likes}
                  comments={post.comments}
                  shares={post.shares}
                  likedBy={post.likedBy}
                  onUpdate={handlePostUpdate}
                />
              ))
            )}
          </div>
        </div>

        {/* Profile-specific Connections */}
        <div className="col-md-3">
          <ProfileConnections />
        </div>
      </div>
    </div>
  );
};

export default Profile;