import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../config/api.js";
import { useContext, useState } from "react";
import { GeneralContext } from "../GeneralProvider.jsx";

const Navbar = ({ title, links = [], color = "white" }) => {
  const navigate = useNavigate();
  const { setusername } = useContext(GeneralContext);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${API}/user/logout`, {
        withCredentials: true,
      });

      if (!res.data.status) {
        alert(res.data.message);
        return;
      }
      setusername(null);
      navigate("/auth");
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 z-30 w-full
      ${color === "white" ? "bg-transparent" : "bg-white"}
      px-4 py-3`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <NavLink to="/">
          <p
            className={`text-2xl font-bold
            ${color === "black" ? "text-black" : "text-white"}`}
          >
            {title}
          </p>
        </NavLink>

        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden absolute z-50 right-8 top-3 text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="28px"
            viewBox="0 -960 960 960"
            width="28px"
            fill={color === "black" ? "#000" : "#fff"}
          >
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
        </button>

        {/* Desktop Menu */}
        <ul
          className={`hidden md:flex gap-4 items-center
          ${color === "black" ? "text-black" : "text-white"} opacity-80`}
        >
          {links.map((link, index) => (
            <li key={index}>
              {link.logout ? (
                <button
                  onClick={handleLogout}
                  className="flex gap-1 items-center hover:opacity-100"
                >
                  {link.svg}
                  {link.title}
                </button>
              ) : (
                <NavLink
                  to={link.path}
                  className="flex gap-1 items-center hover:opacity-100"
                >
                  {link.svg}
                  {link.title}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Sliding Menu */}
      <div
        className={`md:hidden absolute left-0 top-0 w-full
        ${color === "black" ? "bg-white text-black" : "bg-black/70 text-white"}
        transform transition-transform duration-300 ease-in-out
        ${!open ? "-translate-y-full " : "translate-y-0"}`}
      >
        <ul className="flex justify-evenly  gap-4 px-6 py-4">
          {links.map((link, index) => (
            <li key={index}>
              {link.logout ? (
                <button
                  onClick={handleLogout}
                  className="flex gap-2 items-center w-full"
                >
                  {link.svg}
                  {link.title}
                </button>
              ) : (
                <NavLink
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="flex gap-2 items-center"
                >
                  {link.svg}
                  {link.title}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
