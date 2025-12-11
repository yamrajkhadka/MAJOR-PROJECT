import React, { useState } from "react";
// import { X, Menu } from "lucide-react"; // Icons (install: npm i lucide-react)
import { CiMenuBurger as Menu } from "react-icons/ci";
import { ImCancelCircle as X } from "react-icons/im";
import LOGO from "../../assets/LegalGPT-Nepal.png";

import { ButtonFill as Button } from "../ui/Button";



const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 h-[10vh] left-0 w-full bg-primary-dark/60 backdrop-blur-md text-white px-8 py-4 shadow-md flex items-center justify-between z-50">
        
        {/* Left - Logo + Name */}
        <div className="flex items-center gap-3">
          <img
            src={LOGO}
            alt="logo"
            className="w-8 h-8 rounded-2xl"

          />
          <h1 className="text-xl font-semibold tracking-wide">LegalG.P.T</h1>
        </div>

        {/* Center - Desktop Menu */}
        <ul className="hidden md:flex gap-10 text-[16px] font-medium">
          <li className="cursor-pointer hover:text-secondary">Home</li>
          <li className="cursor-pointer hover:text-secondary">Features</li>
          <li className="cursor-pointer hover:text-secondary">Docs</li>
          <li className="cursor-pointer hover:text-secondary">About</li>
          <li className="cursor-pointer hover:text-secondary">Contacts</li>
        </ul>

        {/* Right - Desktop Login */}
        <Button className="hidden md:block bg-primary-dark text-white px-5 py-2 rounded-3xl hover:cursor-pointer transition" content='Login' />

        {/* Mobile Hamburger */}
        <button
          className="md:hidden block"
          onClick={() => setOpen(true)}
        >
          <Menu className="w-7 h-7" />
        </button>
      </nav>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-[70%] bg-primary-dark text-white z-50 p-6 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button className="mb-6" onClick={() => setOpen(false)}>
          <X className="w-7 h-7" />
        </button>

        {/* Sidebar Links */}
        <ul className="flex flex-col gap-6 text-lg font-medium">
          <li className="cursor-pointer hover:text-secondary">Home</li>
          <li className="cursor-pointer hover:text-secondary">Features</li>
          <li className="cursor-pointer hover:text-secondary">Docs</li>
          <li className="cursor-pointer hover:text-secondary">About</li>
          <li className="cursor-pointer hover:text-secondary">Contacts</li>
        </ul>

        {/* Sidebar Login Button */}
                <Button className="mt-10 w-full bg-secondary text-black py-3 rounded-xl font-semibold" content='Login' />


      </div>

      {/* BACKDROP (close by clicking outside) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
