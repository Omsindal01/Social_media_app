import React from "react";
import { gapi } from "gapi-script";
import { Container } from "@material-ui/core";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home/Home";
import "./index.css";
import PostDetails from "./components/PostDetails/PostDetails";
import NavBar from "./components/NavBar/NavBar";
import Auth from "./components/Auth/Auth";
export default function App() {
  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId: "*****.apps.googleusercontent.com",
      plugin_name: "chat",
    });
  });
  const user = JSON.parse(localStorage.getItem("profile"));
  return (
    <Container maxWidth="xl">
      <NavBar />
      <Routes>
        <Route path="/" exact element={<Navigate to="/posts" />}></Route>
        <Route path="/posts" exact element={<Home />}></Route>
        <Route path="/posts/search" exact element={<Home />}></Route>
        <Route path="/posts/:id" exact element={<PostDetails />}></Route>
        <Route
          path="/Auth"
          exact
          element={!user ? <Auth /> : <Navigate to="/posts" />}
        ></Route>
      </Routes>
    </Container>
  );
}
