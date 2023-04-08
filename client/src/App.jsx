import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Header from "./components/Header";
import { UserContextProvider } from "./UserContext";

const App = () => {
  const location = useLocation();

  const showHeader =
    location.pathname !== "/login" && location.pathname !== "/signup";

  return (
    <div>
      <UserContextProvider>
        <ToastContainer position="top-center" />
        {showHeader && <Header />}
        <Outlet />
      </UserContextProvider>
    </div>
  );
};

export default App;
