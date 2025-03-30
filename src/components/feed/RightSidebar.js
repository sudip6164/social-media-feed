import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../pages/context/user.context";
import { getUsers, updateUser, getUser } from "../../utils/user.utils";
import defaultProfilePic from "../../assets/img/defaultProfile.jpg";
import { Link } from "react-router-dom";

const RightSidebar = () => {
  const { user, _setUser } = useContext(UserContext);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      if (!user) return;
      const allUsers = await getUsers();
      const filteredUsers = allUsers
        .filter((u) => u.id !== user.id && !user.following.includes(u.id))
        .sort((a, b) => new Date(b.joined) - new Date(a.joined))
        .slice(0, 5);
      setSuggestedUsers(filteredUsers);
    };
    fetchSuggestedUsers();
  }, [user]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://newsdata.io/api/1/news?country=np&apikey=pub_76901141da7f65e3fe24fd2bbc1594bae907a"
        );
        const data = await response.json();
        setNews(data.results || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  const handleFollowToggle = async (targetUserId) => {
    if (!user) return;

    const isFollowing = user.following.includes(targetUserId);

    const updatedFollowing = isFollowing
      ? user.following.filter((id) => id !== targetUserId) 
      : [...user.following, targetUserId]; 

    await updateUser(user.id, {
      following: updatedFollowing,
      followingCount: updatedFollowing.length,
    });

    const targetUser = await getUser(targetUserId);
    const updatedFollowers = isFollowing
      ? targetUser.followers.filter((id) => id !== user.id) 
      : [...targetUser.followers, user.id]; 

    await updateUser(targetUserId, {
      followers: updatedFollowers,
      followerCount: updatedFollowers.length,
    });

    if (!isFollowing) {
      setSuggestedUsers((prev) => prev.filter((u) => u.id !== targetUserId));
    }

    const freshUserData = await getUser(user.id);
    _setUser(freshUserData);
  };

  return (
    <div className="right-sidebar">
      <h6>Who to follow</h6>
      {suggestedUsers.length === 0 ? (
        <p>No suggestions available.</p>
      ) : (
        suggestedUsers.map((suggestion) => {
          const isFollowing = user?.following.includes(suggestion.id);
          return (
            <div key={suggestion.id} className="follow-suggestion mb-3">
              <Link to={`/profile/${suggestion.id}`}>
              <img
                src={suggestion.profilePic || defaultProfilePic}
                alt="Profile"
                className="profile-pic"
              />
              </Link>
              <div>
                <strong>{suggestion.fullName}</strong>
                <br />
                <small className="text-muted">{suggestion.headline}</small>
              </div>
              <button
                className={`btn btn-sm ${
                  isFollowing ? "btn-outline-danger" : "btn-custom-outline"
                }`}
                onClick={() => handleFollowToggle(suggestion.id)}
              >
                {isFollowing ? (
                  <i className="fas fa-minus"></i>
                ) : (
                  <i className="fas fa-plus"></i>
                )}
              </button>
            </div>
          );
        })
      )}
      <Link to="/people">
        <button className="btn btn-custom-outline w-100 mb-3">View more</button>
      </Link>

      {/* News Section */}
      <div className="news-section mt-4">
        <h6>Today's News</h6>
        {news.length === 0 ? (
          <p>Loading news...</p>
        ) : (
          news.slice(0, 5).map((article, index) => (
            <div key={index} className="news-item mb-3">
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
              <br />
              <small className="text-muted">
                {new Date(article.pubDate).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
