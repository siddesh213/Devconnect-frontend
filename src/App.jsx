import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./Components/Body";
import Login from "./Components/Login";
import Feed from "./Components/Feed";
import Profile from "./Components/Profile";
import EditProfile from "./Components/EditProfile";
import Connections from "./Components/Connections";
import Requests from "./Components/Requests";
import Landing from "./Components/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🏠 Public Landing & Login */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* 🌐 Protected Layout (Navbar + Footer) */}
        <Route element={<Body />}>
          <Route path="feed" element={<Feed />} />
          <Route path="connections" element={<Connections />} />
          <Route path="requests" element={<Requests />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
