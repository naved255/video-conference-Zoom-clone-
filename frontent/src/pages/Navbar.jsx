import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../config/api.js";
import { useContext } from "react";
import { GeneralContext } from "../GeneralProvider.jsx";

const Navbar = ({ title, links = [], color = "white" }) => {
  const navigate = useNavigate();
    const {setusername} = useContext(GeneralContext);
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className={`flex absolute ${color === "white" ? "bg-transparent" : "bg-white"} z-20 w-full top-0 justify-between px-4 py-2`}>
      <NavLink to="/">
        <p className={`text-2xl ${color === "black" ? "text-black" : "text-white"} font-bold`}>
          {title}
        </p>
      </NavLink>

      <ul className={`flex gap-2 ${color === "black" ? "text-black" : "text-white"} opacity-75 items-center`}>
        {links.map((link, index) => (
          <li key={index}>
            {link.logout ? (
              <button
                onClick={handleLogout}
                className="flex gap-1 items-center cursor-pointer"
              >
                {link.svg}
                {link.title}
              </button>
            ) : (
              <NavLink
                to={link.path}
                className="flex gap-1 items-center"
              >
                {link.svg}
                {link.title}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
