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

  async function getUserInfo(mobileToken) {
    setCookieToken(mobileToken);

    !loading && setLoading(true);
    error && setError(undefined);
    try {
      const user = await getCurrentUser();
      setUser(user.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(err);
      setLoading(false);
    }
  }

  function setCookieToken(mobileToken) {
    const expires = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toUTCString();

    document.cookie = `mobile-token=${mobileToken}; expires=${expires}`;
  }

  return [user, loading, error, getUserInfo];
}

export { UserContext, UserContextProvider };
