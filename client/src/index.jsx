import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Provider } from "react-wrap-balancer";

import ErrorBoundary from "./pages/ErrorBoundary";
import App from "./App";
import Home, { loader as homeLoader } from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EditPost, { loader as editPostLoader } from "./pages/EditPost";
import Post, {
  loader as postLoader,
  action as commentAction,
} from "./pages/Post";
import DeletePost, {
  action as deletePostAction,
} from "./pages/Post/DeletePost";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} loader={homeLoader} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="posts/create" element={<EditPost />} />
      <Route
        path="posts/:postId"
        element={<Post />}
        loader={postLoader}
        action={commentAction}
      >
        <Route
          path="delete"
          element={<DeletePost />}
          action={deletePostAction}
        />
      </Route>
      <Route
        path="posts/:postId/edit"
        element={<EditPost />}
        loader={editPostLoader}
      />
    </Route>
  )
);

if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.className = "dark";
} else {
  document.documentElement.className = "light";
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider>
        <RouterProvider router={router} />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
