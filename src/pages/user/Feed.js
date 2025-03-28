import { useState } from 'react';
import LeftSidebar from '../../components/feed/LeftSidebar';
import AddPost from '../../components/feed/AddPost';
import Post from '../../components/feed/Post';
import RightSidebar from '../../components/feed/RightSidebar';

const Feed = () => {
  console.log("Feed component is rendering"); // Debug log

  // Initial dummy posts
  const [posts, setPosts] = useState([
    {
      username: "Frances Guerrero",
      role: "Web Developer at Stackbros",
      time: "2 hours ago",
      content: "I’m thrilled to share that I’ve completed a graduate certificate course in project management with the president’s honor roll.",
      image: "",
      likes: 56,
      comments: 12,
      shares: 3,
    },
    {
      username: "Frances Guerrero",
      role: "Web Developer at Stackbros",
      time: "2 hours ago",
      content: "I’m thrilled to share that I’ve completed a graduate certificate course in project management with the president’s honor roll.",
      image: "https://scontent.fktm7-1.fna.fbcdn.net/v/t39.30808-1/330281752_620459683426393_4928535324287345477_n.jpg?stp=c0.41.700.700a_dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_ohc=8NkKuCSU7HUQ7kNvgFco3NP&_nc_oc=AdkpAEDdHurupwBUTo9zGdD03NECfTCxXSvVM89c7LbGWOVwVrBpiBKSue533b2gYh0&_nc_zt=24&_nc_ht=scontent.fktm7-1.fna&_nc_gid=KAaAVweVD6cmXsjDLsvKgA&oh=00_AYHYSc1mbVxqjf0Dt8nwzUtG-XQUuV78dJ4-b705tisJlw&oe=67E2BD93",
      likes: 56,
      comments: 12,
      shares: 3,
    },
  ]);

  const handlePostSubmit = (newPost) => {
    setPosts([newPost, ...posts]); // Add the new post to the top of the list
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        {/* Left Sidebar */}
        <div className="col-md-3">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <div className="col-md-6">
          <div className="main-content">
            {/* Add Post Section */}
            <AddPost onPostSubmit={handlePostSubmit} />

            {/* Post Section */}
            {posts.map((post, index) => (
              <Post
                key={index}
                username={post.username}
                role={post.role}
                time={post.time}
                content={post.content}
                image={post.image}
                likes={post.likes}
                comments={post.comments}
                shares={post.shares}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-md-3">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Feed;