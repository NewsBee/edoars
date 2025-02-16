import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const HeaderAdmin = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  return (
    <header className="top-0 z-999 flex w-full rounded-lg bg-white p-4 text-gray-800 shadow-md">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Hamburger Toggle Button */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="lg:hidden"
          >
            <svg
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  sidebarOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>

          {/* Centered Text */}
          <div className="flex flex-grow justify-center font-satoshi">
            <div className="">
              <h1 className="text-xl font-bold">Welcome to</h1>
              <p className="text-lg font-normal text-white lg:block">
                <span className="hidden text-black lg:block">
                  Electronic Documents Architect
                </span>
                <span className="lg:hidden">E-Doars</span>
              </p>
            </div>
          </div>
        </div>

        {/* Icons and User Profile */}
        <div className="flex items-center gap-4">
          <DropdownNotification />
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
