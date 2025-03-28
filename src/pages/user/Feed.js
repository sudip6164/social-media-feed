import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../pages/context/user.context';
import { getPosts, createPost } from '../../utils/post.utils';
import LeftSidebar from '../../components/feed/LeftSidebar';
import AddPost from '../../components/feed/AddPost';
import Post from '../../components/feed/Post';
import RightSidebar from '../../components/feed/RightSidebar';

const Feed = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getPosts();
        const sortedPosts = postsData.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostSubmit = async (newPost) => {
    if (!user) return;

    try {
      const postData = {
        userId: user.id,
        username: user.fullName,
        role: "Web Developer at Stackbros",
        createdAt: new Date().toISOString(),
        content: newPost.content,
        image: newPost.image, // File object
        likes: 0,
        comments: 0,
        shares: 0,
      };

      const createdPost = await createPost(postData);
      setPosts([createdPost, ...posts]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading posts...</div>;
  }

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-md-3">
          <LeftSidebar />
        </div>
        <div className="col-md-6">
          <div className="main-content">
            {user && <AddPost onPostSubmit={handlePostSubmit} />}
            {posts.length === 0 ? (
              <div className="text-center mt-5">No posts yet. Be the first to post!</div>
            ) : (
              posts.map((post) => (
                <Post
                  key={post.id}
                  userId={post.userId}
                  username={post.username}
                  role={post.role}
                  createdAt={post.createdAt}
                  content={post.content}
                  image={post.image} // Base64 string from db.json
                  likes={post.likes}
                  comments={post.comments}
                  shares={post.shares}
                />
              ))
            )}
          </div>
        </div>
        <div className="col-md-3">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Feed;