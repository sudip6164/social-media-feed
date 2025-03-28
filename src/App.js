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

// Placeholder components
const CustomLayout = () => (
  <div>
    <Navbar />
    <div>
      <Outlet /> {/* Render child routes here */}
    </div>
  </div>
);

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected parent route */}
          <Route path="/" element={
            <ProtectedParent>
              <CustomLayout />
            </ProtectedParent>
          }>
            <Route index element={<Feed />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/people" element={<People />} />
            <Route path="/news" element={<News />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

const ProtectedParent = ({ children }) => {
  const { user } = useContext(UserContext);
  return user ? children : <Navigate to="/login" replace />;
};

export default App;