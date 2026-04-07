import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AuthPage from "./pages/Auth.jsx"; // Adjust this path if you saved it elsewhere
import Navbar from "./components/Navbar.jsx"; // Assuming you saved it here
import Contribute from "./pages/Contribute.jsx"; // Placeholder for your Contribute page
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Explore from "./pages/Explore.jsx";
import LyricWiki from "./pages/LyricWiki.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Annotations from "./pages/Annotations.jsx";
import { ToastProvider } from './components/Toast.jsx';


function App() {
  return (
    <ToastProvider>
    <BrowserRouter>
    {/* <Navbar /> This will show on all pages, you can move it inside specific pages if needed */}
      <Routes>
        {/* The Home page will load at the root URL */}
        <Route path="/" element={<Home />} />
        
        {/* The Auth page will load at the /login URL */}
        <Route path="/login" element={<AuthPage />} />

        {/* The Contribute page will load at the /contribute URL */}
        <Route path="/contribute" element={<Contribute />} />

        {/* The Dashboard page will load at the /dashboard URL */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* The Profile page will load at the /profile URL */}
        <Route path="/profile" element={<Profile />} />

        {/* The Explore page will load at the /explore URL */}
        <Route path="/explore" element={<Explore />} />

        {/* The LyricWiki page will load at the /lyricwiki URL */}
        <Route path="/lyricwiki" element={<LyricWiki />} />

        {/* The annotation page will load at the /annotations URL */}
        <Route path="/annotations" element={<Annotations />} />  


        {/* Admin Dashboard */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
    </ToastProvider>
  );
}

export default App;