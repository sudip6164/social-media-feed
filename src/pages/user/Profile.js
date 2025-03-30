import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getPostsByUser } from '../../utils/post.utils';
import { getUser } from '../../utils/user.utils';
import Post from '../../components/feed/Post';
import ProfileLeftSidebar from '../../components/profile/ProfileLeftSidebar';
import ProfileConnections from '../../components/profile/ProfileConnections';
import { UserContext } from '../context/user.context';

const Profile = () => {
  const { user } = useContext(UserContext); 
  const { userId } = useParams(); 
  const [targetUser, setTargetUser] = useState(null); 
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; 

    const fetchProfileData = async () => {
      try {
        const profileId = userId || user.id;
        const profileUser = await getUser(profileId);
        
        if (!profileUser) throw new Error("User not found");

        setTargetUser(profileUser);

        const posts = await getPostsByUser(profileId);
        const sortedPosts = posts.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUserPosts(sortedPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, userId]);

  const handlePostUpdate = (postId, updatedPost) => {
    setUserPosts((prevPosts) => {
      if (!updatedPost) {
        return prevPosts.filter((post) => post.id !== postId);
      }
      
      return prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            ...updatedPost,
            comments: updatedPost.commentList?.length || post.comments
          };
        }
        return post;
      });
    });
  };

  if (!user) return <div className="text-center mt-5">Please log in to view profiles.</div>;
  if (loading) return <div className="text-center mt-5">Loading profile...</div>;
  if (!targetUser) return <div className="text-center mt-5">User not found.</div>;

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-md-3">
          <ProfileLeftSidebar targetUser={targetUser} />
        </div>
        <div className="col-md-6">
          <div className="main-content">
            <h3>{user.id === targetUser.id ? 'My Posts' : `${targetUser.fullName}'s Posts`}</h3>
            {userPosts.length === 0 ? (
              <div className="text-center mt-5">
                {user.id === targetUser.id ? 'You haven\'t posted anything yet.' : 'This user hasn\'t posted anything yet.'}
              </div>
            ) : (
              userPosts.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  userId={post.userId}
                  username={post.username}
                  headline={post.headline}
                  createdAt={post.createdAt}
                  content={post.content}
                  image={post.image}
                  likes={post.likes}
                  comments={post.comments}
                  shares={post.shares}
                  likedBy={post.likedBy}
                  commentList={post.commentList || []} 
                  onUpdate={handlePostUpdate}
                />
              ))
            )}
          </div>
        </div>
        <div className="col-md-3">
          <ProfileConnections targetUser={targetUser} />
        </div>
      </div>
    </div>
  );
};

export default Profile;