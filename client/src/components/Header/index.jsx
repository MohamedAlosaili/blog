import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsFillSunFill, BsMoonStarsFill } from "react-icons/bs";

import Button from "../Button";
import "./header.css";

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <Link to="/" className="header--logo">
        {"<Blog />"}
      </Link>

      <Button onClick={toggleTheme} className="header--button">
        {theme === "dark" ? (
          <>
            {"Light"} <BsFillSunFill />
          </>
        ) : (
          <>
            {"Dark"} <BsMoonStarsFill />
          </>
        )}
      </Button>
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
