"use client";

import Image from "next/image";
import { Search, Bell, Settings, UserCircle, Bookmark, HelpCircle, ChevronDown } from "lucide-react";
import Link from "next/link";
import sabreLogo from "./sabreLogo.svg";

export function SabreNavbar() {
  return (
    <nav className="bg-white border-b-2 border-red-700 shadow-md">
      {/* Top Section */}
      <div className="flex items-center justify-between px-6 py-2">
        {/* Left Side: Logo and Hotel Info */}
        <div className="flex items-center gap-4">
          <Image
            src={sabreLogo} // Replace with actual path to the Sabre logo
            alt="Sabre Logo"
            width={100}
            height={40}
          />
          <div className="flex items-center gap-2 text-black font-semibold text-lg cursor-pointer hover:text-gray-700">
            Vivanta By Taj Whitefield 20102
            <ChevronDown className="h-5 w-5 text-gray-600" />
          </div>
        </div>

        {/* Right Side: Search and Icons */}
        <div className="flex items-center gap-4 text-black">
          <div className="flex items-center border border-gray-300 rounded-md px-2 py-1">
            <Search className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search Hotel"
              className="ml-2 border-none focus:outline-none bg-transparent text-black"
            />
          </div>

          <Bookmark className="h-6 w-6 cursor-pointer hover:text-gray-600" />
          <Bell className="h-6 w-6 cursor-pointer hover:text-gray-600" />
          <HelpCircle className="h-6 w-6 cursor-pointer hover:text-gray-600" />
          <Settings className="h-6 w-6 cursor-pointer hover:text-gray-600" />
          <UserCircle className="h-6 w-6 cursor-pointer hover:text-gray-600" />
        </div>
      </div>

      {/* Bottom Section: Navigation Menu */}
      <div className="bg-red-700 text-white px-6 py-2 flex gap-6 text-sm font-semibold">
        <Link href="/" className="hover:underline">HOME</Link>
        <Link href="/setup" className="hover:underline">SETUP</Link>
        <Link href="/manage" className="hover:underline">MANAGE</Link>
        <Link href="/reports" className="hover:underline">REPORTS</Link>
        <Link href="/administration" className="hover:underline">ADMINISTRATION</Link>
        <Link href="/support" className="hover:underline">SUPPORT</Link>
      </div>
    </nav>
  );
}
