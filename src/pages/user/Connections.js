import { useContext, useState, useEffect } from 'react';
import defaultProfilePic from '../../assets/img/defaultProfile.jpg';
import { UserContext } from '../context/user.context';
import { getUsers, updateUser, getUser } from '../../utils/user.utils';
import LeftSidebar from '../../components/feed/LeftSidebar';
import { Link } from 'react-router-dom';

const Connections = () => {
  const { user, _setUser } = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('followers');

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      setAllUsers(users);
    };
    fetchUsers();
  }, [user]); 

  const handleFollowToggle = async (targetUserId) => {
    if (!user) return;

    const isFollowing = user.following.includes(targetUserId);

    const updatedFollowing = isFollowing
      ? user.following.filter(id => id !== targetUserId)
      : [...user.following, targetUserId];

    await updateUser(user.id, {
      following: updatedFollowing,
      followingCount: updatedFollowing.length
    });

    const targetUser = allUsers.find(u => u.id === targetUserId);
    const updatedFollowers = isFollowing
      ? targetUser.followers.filter(id => id !== user.id)
      : [...targetUser.followers, user.id];

    await updateUser(targetUserId, {
      followers: updatedFollowers,
      followerCount: updatedFollowers.length
    });

    const updatedUsers = allUsers.map(u => {
      if (u.id === user.id) {
        return { ...u, following: updatedFollowing, followingCount: updatedFollowing.length };
      }
      if (u.id === targetUserId) {
        return { ...u, followers: updatedFollowers, followerCount: updatedFollowers.length };
      }
      return u;
    });

    setAllUsers(updatedUsers);
    
    const freshUserData = await getUser(user.id);
    _setUser(freshUserData);
  };

  if (!user) return <div>Please log in to view connections.</div>;

  const followers = allUsers.filter(u => user.followers.includes(u.id));
  const following = allUsers.filter(u => user.following.includes(u.id));

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <LeftSidebar />
        </div>

        <div className="col-md-6 mt-3">
          <h3>Connections</h3>
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'followers' ? 'active' : ''}`}
                onClick={() => setActiveTab('followers')}
              >
                Followers ({user.followerCount || 0})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'following' ? 'active' : ''}`}
                onClick={() => setActiveTab('following')}
              >
                Following ({user.followingCount || 0})
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {activeTab === 'followers' && (
              <div className="tab-pane active">
                {followers.length === 0 ? (
                  <p>No followers yet.</p>
                ) : (
                  followers.map(follower => (
                    <div key={follower.id} className="card mb-3">
                      <div className="card-body d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                        <Link to={`/profile/${follower.id}`}>
                          <img
                            src={follower.profilePic || defaultProfilePic}
                            alt="Profile"
                            className="profile-pic"
                            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                          />
                          </Link>
                          <div className="ms-3">
                            <strong>{follower.fullName}</strong><br />
                            <small className="text-muted">{follower.headline}</small>
                          </div>
                        </div>
                        <button
                          className={`btn btn-sm ${
                            user.following.includes(follower.id) 
                              ? 'btn-outline-danger' 
                              : 'btn-custom-outline'
                          }`}
                          onClick={() => handleFollowToggle(follower.id)}
                        >
                          {user.following.includes(follower.id) ? (
                            <><i className="fas fa-minus"></i> Unfollow</>
                          ) : (
                            <><i className="fas fa-plus"></i> Follow</>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'following' && (
              <div className="tab-pane active">
                {following.length === 0 ? (
                  <p>You are not following anyone yet.</p>
                ) : (
                  following.map(followedUser => (
                    <div key={followedUser.id} className="card mb-3">
                      <div className="card-body d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                        <Link to={`/profile/${followedUser.id}`}>
                          <img
                            src={followedUser.profilePic || defaultProfilePic}
                            alt="Profile"
                            className="profile-pic"
                            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                          />
                          </Link>
                          <div className="ms-3">
                            <strong>{followedUser.fullName}</strong><br />
                            <small className="text-muted">{followedUser.headline}</small>
                          </div>
                        </div>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleFollowToggle(followedUser.id)}
                        >
                          <i className="fas fa-minus"></i> Unfollow
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connections;