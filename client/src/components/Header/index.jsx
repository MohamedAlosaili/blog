import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsFillSunFill, BsMoonStarsFill, BsChevronDown } from "react-icons/bs";
import { CgSpinnerTwo } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";

import Button from "../Button";
import { UserContext } from "../../UserContext";
import { logoutUser } from "../../fetchData";
import "./header.css";

const Header = () => {
  const [user, loading, error, getUserInfo] = useContext(UserContext);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function logout() {
    try {
      const res = await logoutUser();

      if (!res.success) toast.error(res.error);

      await getUserInfo();

      toast.success(res.message, { autoClose: 1000 });
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  }

  return (
    <header className="header">
      <Link to="/" className="header--logo">
        {"<Blog />"}
      </Link>
      <div
        className="header--user"
        onClick={() => setIsMenuOpen(true)}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        {loading ? (
          <CgSpinnerTwo className="loading-spinner" />
        ) : user ? (
          <div className="user--info">
            <div className="link">
              <h3>@{user.username}</h3>
              <BsChevronDown className="user--menu_icon" />
            </div>
            {isMenuOpen && (
              <div className="user--menu">
                <button className="menu--logout" onClick={logout}>
                  Logout <FiLogOut strokeWidth={3} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" state={{ from: location.pathname }}>
            <Button className="header--button">Login</Button>
          </Link>
        )}
      </div>
      <button className="header--theme" onClick={toggleTheme}>
        {theme === "dark" ? <BsFillSunFill /> : <BsMoonStarsFill />}
      </button>
    </header>
  );
};

function useTheme() {
  const [theme, setTheme] = useState(() => {
    let theme = document.documentElement.className;

    if (theme !== "dark" || theme !== "light") theme = "dark";

    return theme;
  });

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(theme => (theme === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}

export default Header;
