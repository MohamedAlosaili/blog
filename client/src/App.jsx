import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Header from "./components/Header";
import { UserContextProvider } from "./UserContext";

const App = () => {
  const location = useLocation();

  const showHeader =
    location.pathname === "/" || location.pathname.startsWith("/posts");

  return (
    <div>
      <UserContextProvider>
        <ToastContainer position="top-center" limit={2} />
        {showHeader && <Header />}
        <Outlet />
      </UserContextProvider>
      <ScrollRestoration
        getKey={location =>
          location.pathname === "/" ? location.pathname : location.key
        }
      />
    </div>
  );
};

export default App;
