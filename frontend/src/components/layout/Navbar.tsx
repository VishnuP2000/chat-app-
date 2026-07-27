import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useAuth } from "@/context/AuthContext";
// import { Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
//    const [isLogin,setIsLogin]=useState(false)
const {user,setUser}=useAuth()
console.log("user+",user);
  const navigat=useNavigate()

  const logout = () => {
    localStorage.removeItem('access-token')
      setUser(null);
  navigat("/");
  }
  

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <h1 onClick={()=>navigat('/')} className="text-2xl cursor-pointer font-bold text-blue-600">
          Talky-Talky
        </h1>

        {/* Desktop Menu
        <ul className="hidden items-center gap-8 font-medium md:flex">
          <li>
            <a
              href="/"
              className="transition hover:text-blue-600"
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="/products"
              className="transition hover:text-blue-600"
            >
              Products
            </a>
          </li>

          <li>
            <a
              href="/about"
              className="transition hover:text-blue-600"
            >
              About
            </a>
          </li>

          <li>
            <a
              href="/contact"
              className="transition hover:text-blue-600"
            >
              Contact
            </a>
          </li>
        </ul> */}

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
         
          <div>
            {user?(<Button
            title="Logout"
            onClick={logout}
          />) : (<Button
            title="Sign In"
            onClick={() => navigat("/sign-in")}
          />)}
          </div>
        <button onClick={()=>navigat('/Dashboard')} className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
            chat
          </button>

          <button onClick={()=>navigat('/profile')} className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
            Profile
          </button>
        </div>

       
      </div>

     
    </nav>
  );
}

export default Navbar;