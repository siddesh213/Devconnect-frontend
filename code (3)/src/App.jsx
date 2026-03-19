import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./Components/Body";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Profile from "./Components/Profile";
import EditProfile from "./Components/EditProfile";
import Feed from "./Components/Feed";
import Connections from "./Components/Connections";
import Requests from "./Components/Requests";
import UserProfileView from "./Components/UserProfileView";
import SocketHandler from "./Components/SocketHandler";

function App() {
  return (
    <BrowserRouter>
      <SocketHandler />
      <Routes>
        <Route path="/" element={<Body />}>
          <Route path="feed" element={<Feed />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="profile/:userId" element={<UserProfileView />} />
          <Route path="connections" element={<Connections />} />
          <Route path="requests" element={<Requests />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
