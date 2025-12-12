"use client";
import React from "react";
import NavIcon from "../public/OBJECTS.png";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext"; // <-- import hook

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth();

  return (
    <header className="py-2 relative shadow bg-white">
      <div className="flex justify-center items-center">
        <Image src={NavIcon} alt="icon" width={150} />
      </div>

      {isAuthenticated && (
        <button
          onClick={logout}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#177A9C] px-4 py-2 text-white rounded cursor-pointer hover:opacity-95"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Navbar;

