import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../pages/context/user.context';
import defaultProfilePic from '../assets/img/defaultProfile.jpg';

// Placeholder image for profile picture
const Navbar = () => {
  const { user, _setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'friend_request',
      user: 'Judy Nguyen',
      action: 'sent you a friend request',
      time: '4 min',
      profilePic: defaultProfilePic,
    },
    {
      id: 2,
      type: 'activity',
      user: 'Stackbros',
      action: 'has 15 new activity',
      time: '5 min',
      icon: 'WB',
    },
    {
      id: 3,
      type: 'news',
      user: 'Bootstap in the news',
      action: 'The search giant\'s parent company, Alphabet, just joined an exclusive club of tech stocks.',
      time: '11 min',
      icon: 'B',
    },
  ]);

  const handleLogout = () => {
    _setUser(null); // Clear user from context and localStorage
    navigate('/login');
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationAction = (id, action) => {
    console.log(`${action} notification with ID ${id}`);
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const handleThemeChange = (theme) => {
    console.log(`Theme changed to: ${theme}`);
    // Add theme change logic here if needed (e.g., updating CSS classes or localStorage)
  };

  if (!user) return null; // Don't show navbar if user is not logged in

  return (
    <nav className="navbar sticky-top">
      <div className="container-fluid">
        {/* Left Section: Search Bar */}
        <div className="d-flex align-items-center">
          <div className="input-group search-bar me-3">
            <span className="input-group-text bg-transparent border-0">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 bg-transparent"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Center Section: Navigation Links */}
        <div className="d-flex align-items-center justify-content-center flex-grow-1">
          <Link to="/" className="text-muted me-4">
            <i className="fas fa-home me-1"></i> Feed
          </Link>
          <Link to="/connections" className="text-muted me-4">
            <i className="fas fa-users me-1"></i> Connections
          </Link>
          <Link to="/people" className="text-muted me-4">
            <i className="fas fa-user me-1"></i> People
          </Link>
          <Link to="/news" className="text-muted">
            <i className="fas fa-globe me-1"></i> Latest News
          </Link>
        </div>

        {/* Right Section: Notifications and Profile */}
        <div className="d-flex align-items-center">
          {/* Notifications Dropdown */}
          <div className="position-relative me-3 dropdown">
            <a
              href="/"
              className="text-muted dropdown-toggle"
              id="notificationDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-bell"></i>
              <span className="badge rounded-pill text-white">{notifications.length}</span>
            </a>
            <ul
              className="dropdown-menu dropdown-menu-end notification-dropdown"
              aria-labelledby="notificationDropdown"
            >
              <li className="notification-header d-flex justify-content-between align-items-center px-3 py-2">
                <h6 className="mb-0">Notifications</h6>
                <a href="/" className="text-muted small" onClick={handleClearNotifications}>
                  Clear all
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              {notifications.length === 0 ? (
                <li className="px-3 py-2 text-muted">No notifications</li>
              ) : (
                notifications.map((notif) => (
                  <li key={notif.id} className="notification-item px-3 py-2">
                    <div className="d-flex align-items-center">
                      {notif.profilePic ? (
                        <img
                          src={notif.profilePic}
                          alt="Profile"
                          className="profile-pic me-2"
                        />
                      ) : (
                        <div className="notification-icon me-2">
                          <span>{notif.icon}</span>
                        </div>
                      )}
                      <div className="flex-grow-1">
                        <p className="mb-0">
                          <strong>{notif.user}</strong> {notif.action}
                        </p>
                        <small className="text-muted">{notif.time}</small>
                      </div>
                    </div>
                    {notif.type === 'friend_request' && (
                      <div className="d-flex mt-2">
                        <button
                          className="btn btn-primary btn-sm me-1"
                          onClick={() => handleNotificationAction(notif.id, 'Accepted')}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleNotificationAction(notif.id, 'Deleted')}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Profile Dropdown */}
          <div className="position-relative dropdown">
            <img
              src={user.profilePic || defaultProfilePic}
              alt="Profile"
              className="profile-pic dropdown-toggle"
              id="profileDropdown"
              data-bs-toggle="dropdown"            />
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
              <li className="profile-header">
                <img src={user.profilePic || defaultProfilePic} alt="Profile" />
                <div>
                  <h6>{user.fullName}</h6>
                  <p>{user.headline}</p>
                </div>
              </li>
              <li>
                <Link className="dropdown-item" to="/profile">
                  <i className="fas fa-user"></i> View profile
                </Link>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="fas fa-life-ring"></i> Support
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <i className="fas fa-book"></i> Documentation
                </a>
              </li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Sign out
                </button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li className="theme-toggle">
                <label>MODE:</label>
                <i
                  className="fas fa-sun"
                  data-theme="light"
                  onClick={() => handleThemeChange('light')}
                ></i>
                <i
                  className="fas fa-moon"
                  data-theme="dark"
                  onClick={() => handleThemeChange('dark')}
                ></i>
                <i
                  className="fas fa-adjust active"
                  data-theme="auto"
                  onClick={() => handleThemeChange('auto')}
                ></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;