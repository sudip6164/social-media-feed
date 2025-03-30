import { useContext, useState, useEffect } from 'react';
import defaultProfilePic from '../../assets/img/defaultProfile.jpg';
import { getUsers, updateUser, getUser } from '../../utils/user.utils';
import { UserContext } from '../../pages/context/user.context';

const ProfileConnections = ({ targetUser }) => {
  const { user, _setUser } = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('followers');

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      setAllUsers(users);
    };
    fetchUsers();
  }, [targetUser]);

  const handleFollowToggle = async (targetUserId) => {
    if (!user || targetUserId === user.id) return;

    const isFollowing = user.following.includes(targetUserId);

    const updatedFollowing = isFollowing
      ? user.following.filter(id => id !== targetUserId)
      : [...user.following, targetUserId];

    await updateUser(user.id, {
      following: updatedFollowing,
      followingCount: updatedFollowing.length
    });

    const targetUserToUpdate = allUsers.find(u => u.id === targetUserId);
    const updatedFollowers = isFollowing
      ? targetUserToUpdate.followers.filter(id => id !== user.id)
      : [...targetUserToUpdate.followers, user.id];

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

  if (!targetUser) return <div>Loading connections...</div>;

  const followers = allUsers.filter(u => targetUser.followers.includes(u.id));
  const following = allUsers.filter(u => targetUser.following.includes(u.id));

  return (
    <div className="mt-3">
      <h3>Connections</h3>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'followers' ? 'active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            Followers ({targetUser.followerCount || 0})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Following ({targetUser.followingCount || 0})
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
                    <div className="d-flex align frequent-items-center">
                      <img
                        src={follower.profilePic || defaultProfilePic}
                        alt="Profile"
                        className="profile-pic"
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                      />
                      <div className="ms-3">
                        <strong>{follower.fullName}</strong><br />
                        <small className="text-muted">{follower.bio}</small>
                      </div>
                    </div>
                    {user && follower.id !== user.id && ( 
                      <button
                        className={`btn btn-sm rounded-pill px-2 ${
                          user.following.includes(follower.id)
                            ? 'btn-outline-danger'
                            : 'btn-outline-primary'
                        }`}
                        style={{
                          transition: 'all 0.3s ease',
                          padding: '4px !important',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onClick={() => handleFollowToggle(follower.id)}
                        onMouseEnter={(e) => {
                          e.target.style.boxShadow = user.following.includes(follower.id)
                            ? '0 2px 5px rgba(220, 53, 69, 0.3)'
                            : '0 2px 5px rgba(0, 123, 255, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <i
                          className={user.following.includes(follower.id) ? 'fas fa-minus' : 'fas fa-plus'}
                          style={{ fontSize: '12px' }}
                        ></i>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'following' && (
          <div className="tab-pane active">
            {following.length === 0 ? (
              <p>{targetUser.id === user.id ? 'You are' : 'This user is'} not following anyone yet.</p>
            ) : (
              following.map(followedUser => (
                <div key={followedUser.id} className="card mb-3">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <img
                        src={followedUser.profilePic || defaultProfilePic}
                        alt="Profile"
                        className="profile-pic"
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                      />
                      <div className="ms-3">
                        <strong>{followedUser.fullName}</strong><br />
                        <small className="text-muted">{followedUser.bio}</small>
                      </div>
                    </div>
                    {user && targetUser.id === user.id && followedUser.id !== user.id && ( 
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill px-2"
                        style={{
                          transition: 'all 0.3s ease',
                          padding: '4px !important',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onClick={() => handleFollowToggle(followedUser.id)}
                        onMouseEnter={(e) => {
                          e.target.style.boxShadow = '0 2px 5px rgba(220, 53, 69, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <i
                          className="fas fa-minus"
                          style={{ fontSize: '12px' }}
                        ></i>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileConnections;