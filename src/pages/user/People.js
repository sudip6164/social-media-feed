import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/user.context';
import { getUsers, updateUser, getUser } from '../../utils/user.utils';
import defaultProfilePic from '../../assets/img/defaultProfile.jpg';
import LeftSidebar from '../../components/feed/LeftSidebar';
import { Link } from 'react-router-dom';

const People = () => {
  const { user, _setUser } = useContext(UserContext);
  const [unfollowedUsers, setUnfollowedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUnfollowedUsers = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const allUsers = await getUsers();
        const filteredUsers = allUsers
          .filter((u) => u.id !== user.id && !user.following?.includes(u.id))
          .sort((a, b) => new Date(b.joined) - new Date(a.joined));
        setUnfollowedUsers(filteredUsers);
        setFilteredUsers(filteredUsers); 
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUnfollowedUsers();
  }, [user]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredUsers(unfollowedUsers);
    } else {
      const filtered = unfollowedUsers.filter(person =>
        person.fullName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleFollow = async (targetUserId) => {
    if (!user || isLoading) return;

    try {
      setIsLoading(true);
      
      const updatedFollowing = [...(user.following || []), targetUserId];
      await updateUser(user.id, {
        following: updatedFollowing,
        followingCount: updatedFollowing.length
      });

      const targetUser = await getUser(targetUserId);
      const updatedFollowers = [...(targetUser.followers || []), user.id];
      await updateUser(targetUserId, {
        followers: updatedFollowers,
        followerCount: updatedFollowers.length
      });

      setUnfollowedUsers(prev => prev.filter(u => u.id !== targetUserId));
      setFilteredUsers(prev => prev.filter(u => u.id !== targetUserId));
      
      const freshUserData = await getUser(user.id);
      _setUser(freshUserData);
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div>Please log in to view people.</div>;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <LeftSidebar />
        </div>

        <div className="col-md-6 mt-3">
          <h3 className="mb-3">People You May Know</h3>
          
          {/* Search Bar */}
          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="fas fa-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search people by name..."
                value={searchQuery}
                onChange={handleSearch}
                style={{
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              />
            </div>
          </div>

          {isLoading && filteredUsers.length === 0 ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <p>{searchQuery ? 'No matching people found.' : 'No new people to follow.'}</p>
          ) : (
            filteredUsers.map((person) => (
              <div key={person.id} className="card mb-3">
                <div className="card-body d-flex align-items-center">
                  <Link to={`/profile/${person.id}`}>
                    <img
                      src={person.profilePic || defaultProfilePic}
                      alt="Profile"
                      className="profile-pic"
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                  </Link>
                  <div className="flex-grow-1 ms-3">
                    <strong>{person.fullName}</strong><br />
                    <small className="text-muted">{person.headline}</small>
                  </div>
                  <button
                    className="btn btn-custom-outline btn-sm"
                    onClick={() => handleFollow(person.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <>
                        <i className="fas fa-plus"></i> Follow
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default People;