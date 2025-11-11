"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import appStore from "../src/utils/appStore"
import Body from "../src/Components/Body"
import Login from "../src/Components/Login"
import Profile from "../src/Components/Profile"

export default function Page() {
  return (
    <Provider store={appStore}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Body />}>
            <Route path="/" element={<Navigate to="/feed" />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  )
}
