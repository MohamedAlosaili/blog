// const API_BASE = import.meta.env.VITE_API_URL;
const API_BASE = "https://b-log.herokuapp.com";

const request = async (method, url, body) => {
  const token = getToken();

  const options = {
    method,
    credentials: "include",
    headers: {
      authorization: token ? `Bearer ${token}` : undefined,
    },
  };

  if (body) {
    if (!(body instanceof FormData)) {
      options.headers = {
        ...options.headers,
        "Content-Type": "application/json",
      };
    }
    // Add client url to the header to provide it in the email
    if (url.endsWith("forgotpassword")) {
      options.headers = {
        ...options.headers,
        ["x-client-url"]: location.origin,
      };
    }

    // If the body is provided it must be serialized before passing it here
    options.body = body;
  }

  const response = await fetch(API_BASE + url, options);

  const results = await response.json();

  return { ...results, status: response.status };
};

function getToken() {
  const cookies = document.cookie;
  const regex = /auth-token=([^;]+)/;
  const cookie = regex.exec(cookies)?.[0];

  const token = cookie?.slice(cookie.indexOf("=") + 1);

  return token;
}

// Posts
export const getPosts = () => request("GET", "/api/v1/posts");

export const getPost = id => request("GET", `/api/v1/posts/${id}`);

export const getPostsFromSearch = query =>
  request("GET", `/api/v1/posts/search?q=${query}`);

export const createPost = body => request("POST", "/api/v1/posts", body);

export const updatePost = (body, postId) =>
  request("PUT", `/api/v1/posts/${postId}`, body);

export const deletePost = postId =>
  request("DELETE", `/api/v1/posts/${postId}`);

// Comments
export const addComment = (body, postId) =>
  request("POST", `/api/v1/posts/${postId}/comments`, body);

export const updateComment = (body, commentId) =>
  request("PUT", `/api/v1/comments/${commentId}`, body);

export const deleteComment = commentId =>
  request("DELETE", `/api/v1/comments/${commentId}`);

// Users
export const loginUser = body => request("POST", "/api/v1/auth/login", body);

export const logoutUser = () => request("GET", "/api/v1/auth/logout");

export const signupUser = body =>
  request("POST", "/api/v1/auth/register", body);

export const getCurrentUser = () => request("GET", "/api/v1/auth/me");

export const forgotPassword = body =>
  request("POST", "/api/v1/auth/forgotpassword", body);

export const resetPassword = (body, token) =>
  request("POST", `/api/v1/auth/resetpassword/${token}`, body);
