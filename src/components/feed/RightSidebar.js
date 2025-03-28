import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../pages/context/user.context';
import { getUsers, updateUser, getUser } from '../../utils/user.utils';
import defaultProfilePic from '../../assets/img/defaultProfile.jpg';
import { Link } from 'react-router-dom';

const RightSidebar = () => {
  const { user, _setUser } = useContext(UserContext);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const newsItems = [
    { title: "Ten questions you should answer truthfully", time: "2hr" },
    { title: "Five unbelievable facts about money", time: "3hr" },
    { title: "Best Pinterest Boards for learning about business", time: "4hr" },
    { title: "Skills that you can learn from business", time: "6hr" },
    { title: "Top 10 productivity tips for developers", time: "8hr" },
    { title: "How to stay motivated in 2025", time: "10hr" },
  ];

  // Fetch suggested users (excluding current user and already followed)
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      if (!user) return;
      const allUsers = await getUsers();
      const filteredUsers = allUsers
        .filter(u => u.id !== user.id && !user.following.includes(u.id))
        .sort((a, b) => new Date(b.joined) - new Date(a.joined))
        .slice(0, 5);
      setSuggestedUsers(filteredUsers);
    };
    fetchSuggestedUsers();
  }, [user]);

  // Handle follow/unfollow
  const handleFollowToggle = async (targetUserId) => {
    if (!user) return;

    const isFollowing = user.following.includes(targetUserId);

    // Update CURRENT USER (who clicked the button)
    const updatedFollowing = isFollowing
      ? user.following.filter(id => id !== targetUserId) // Unfollow
      : [...user.following, targetUserId]; // Follow

    await updateUser(user.id, {
      following: updatedFollowing,
      followingCount: updatedFollowing.length
    });

    // Update TARGET USER (the one being followed/unfollowed)
    const targetUser = await getUser(targetUserId);
    const updatedFollowers = isFollowing
      ? targetUser.followers.filter(id => id !== user.id) // Remove follower
      : [...targetUser.followers, user.id]; // Add follower

    await updateUser(targetUserId, {
      followers: updatedFollowers,
      followerCount: updatedFollowers.length
    });

    // Update UI (remove from suggestions if followed)
    if (!isFollowing) {
      setSuggestedUsers(prev => prev.filter(u => u.id !== targetUserId));
    }

    // Refresh current user data
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
            <div key={suggestion.id} className="follow-suggestion">
              <img src={defaultProfilePic} alt="Profile" className="profile-pic" />
              <div>
                <strong>{suggestion.fullName}</strong><br />
                <small className="text-muted">{suggestion.bio}</small>
              </div>
              <button
                className={`btn btn-sm ${isFollowing ? 'btn-outline-danger' : 'btn-custom-outline'}`}
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

      <h6>Today's news</h6>
      {newsItems.map((news, index) => (
        <div key={index} className="news-item">
          <a href="/">{news.title}</a><br />
          <small className="text-muted">{news.time}</small>
        </div>
      ))}
    </div>
  );
};

export default RightSidebar;