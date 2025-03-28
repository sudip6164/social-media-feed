// src/App.jsx
import './assets/css/main.css';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { UserProvider } from './pages/context/user.context';
import Navbar from './components/Navbar';
import Feed from './pages/user/Feed';
import Connections from './pages/user/Connections';
import People from './pages/user/People';
import Profile from './pages/user/Profile';
import EditProfile from './pages/user/EditProfile'; // Import the new EditProfile

// Placeholder components
const CustomLayout = () => (
  <div>
    <Navbar />
    <div>
      <Outlet /> {/* Render child routes here */}
    </div>
  </div>
);

const News = () => <div className="container mt-5"><h1>Latest News</h1><p>This is the Latest News page.</p></div>;

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Parent route with CustomLayout for user-facing routes */}
          <Route path="/" element={<CustomLayout />}>
            <Route index element={<Feed />} /> {/* Default route for "/" */}
            <Route path="/connections" element={<Connections />} />
            <Route path="/people" element={<People />} />
            <Route path="/news" element={<News />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} /> {/* Updated */}
          </Route>
          {/* Standalone routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;