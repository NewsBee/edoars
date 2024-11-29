"use client";

import React, { useState } from "react";
import Link from "next/link";

interface SidebarChild {
  label: string;
  route: string;
  locked?: boolean; // Menambahkan properti locked untuk kondisi terkunci
}

interface SidebarItemProps {
  item: {
    icon: JSX.Element;
    label: string;
    route: string;
    children?: SidebarChild[];
  };
  pageName: string;
  setPageName: (arg: string) => void;
}

const SidebarItem = ({ item, pageName, setPageName }: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    setPageName(updatedPageName);
    setIsOpen(!isOpen); // Toggle dropdown
  };

  return (
    <>
      <li>
        <Link
          href={item.route}
          onClick={handleClick}
          className={`${
            pageName === item.label.toLowerCase()
              ? "bg-greenAccent text-primaryBlue"
              : "text-white hover:bg-greenAccent hover:text-primaryBlue"
          } group relative flex items-center gap-3 rounded-md px-3.5 py-3 font-medium duration-300 ease-in-out`}
        >
          {item.icon}
          {item.label}
        </Link>

        {item.children && (
          <div
            className={`transform overflow-hidden transition-all duration-300 ${
              isOpen ? "max-h-screen" : "max-h-0"
            }`}
          >
            <ul className="pl-8 pt-2 text-gray-300">
              {item.children.map((child, index) => (
                <li key={index}>
                  <Link
                    href={child.locked ? "#" : child.route}
                    className={`block py-2 text-sm ${
                      child.locked
                        ? "text-gray-500 cursor-not-allowed"
                        : "hover:text-white"
                    }`}
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    </>
  );
};

export default SidebarItem;
