// src/App.jsx
import './assets/css/main.css';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { UserContext, UserProvider } from './pages/context/user.context';
import Navbar from './components/Navbar';
import Feed from './pages/user/Feed';
import Connections from './pages/user/Connections';
import People from './pages/user/People';
import Profile from './pages/user/Profile';
import EditProfile from './pages/user/EditProfile';
import News from './pages/user/News';
import { useContext } from 'react';
import AdminLogin from './admin/pages/auth/AdminLogin';
import AdminCustomLayout from './admin/pages/AdminCustomLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminManageUsers from './admin/pages/AdminManageUsers';
import AdminManagePosts from './admin/pages/AdminManagePosts';
import { AdminContext, AdminProvider } from './admin/pages/context/admin.context';

// User Layout (unchanged)
const CustomLayout = () => (
  <div>
    <Navbar />
    <div>
      <Outlet />
    </div>
  </div>
);

// Protected Route for Users (unchanged)
const ProtectedParent = ({ children }) => {
  const { user } = useContext(UserContext);
  return user ? children : <Navigate to="/login" replace />;
};

// Protected Route for Admins
const AdminProtectedParent = ({ children }) => {
  const { admin } = useContext(AdminContext);
  return admin ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <UserProvider>
      <AdminProvider>
        <BrowserRouter>
          <Routes>
            {/* Public User Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected User Routes */}
            <Route
              path="/"
              element={
                <ProtectedParent>
                  <CustomLayout />
                </ProtectedParent>
              }
            >
              <Route index element={<Feed />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/people" element={<People />} />
              <Route path="/news" element={<News />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
            </Route>

            {/* Public Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminProtectedParent>
                  <AdminCustomLayout />
                </AdminProtectedParent>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="manage-users" element={<AdminManageUsers />} />
              <Route path="manage-posts" element={<AdminManagePosts />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </UserProvider>
  );
}

export default App;