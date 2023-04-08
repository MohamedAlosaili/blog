const API_BASE = import.meta.env.VITE_API_URL;

const request = async (method, url, body) => {
  const options = { method };

  if (body) {
    options.headers = {
      "Content-Type": "application/json",
    };
    // If the body is provided it must be serialized before passing it here
    options.body = body;
  }

  const response = await fetch(API_BASE + url, options);

  const results = await response.json();

  return { ...results, status: response.status };
};

// Posts
export const getPosts = () => request("GET", "/api/v1/posts");

export const getPost = id => request("GET", `/api/v1/posts/${id}`);

export const getPostsFromSearch = query =>
  request("GET", `/api/v1/posts/search?q=${query}`);

// Users
export const loginUser = body => request("POST", "/api/v1/auth/login", body);

export const getCurrentUser = () => request("GET", "/api/v1/auth/me");
