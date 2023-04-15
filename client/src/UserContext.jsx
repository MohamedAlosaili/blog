import React, { useEffect, useState } from "react";
import { getCurrentUser } from "./fetchData";

const UserContext = React.createContext();

function UserContextProvider({ children }) {
  const userState = useAuth();

  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  );
}

function useAuth() {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    getUserInfo();
  }, []);

  async function getUserInfo(token) {
    if (token) storeTokenInCookies(token);

    !loading && setLoading(true);
    error && setError(undefined);
    try {
      const user = await getCurrentUser();

      setUser(user.data);
      setLoading(false);

      return user?.error;
    } catch (err) {
      console.log(err);
      setError(err);
      setLoading(false);
    }
  }

  function storeTokenInCookies(token) {
    const expires = new Date(
      token === "none" ? Date.now() : Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toUTCString();

    document.cookie = `auth-token=${token}; expires=${expires};`;
  }

  return [user, loading, error, getUserInfo];
}

export { UserContext, UserContextProvider };
