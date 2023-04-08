import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsFillSunFill, BsMoonStarsFill } from "react-icons/bs";

import Button from "../Button";
import "./header.css";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <header className="header">
      <Link to="/" className="header--logo">
        {"<Blog />"}
      </Link>
      <div className="header--user">
        <Link to="/login" state={{ from: location.pathname }}>
          <Button className="header--button">Login</Button>
        </Link>
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
