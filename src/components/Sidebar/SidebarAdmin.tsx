"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ClickOutside from "@/components/ClickOutside";

// Import icons from react-icons
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { IoMdPaper } from "react-icons/io";
import { GiTripleLock } from "react-icons/gi";
import { FaBullhorn } from "react-icons/fa";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

type MenuItem = {
  label: string;
  route?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
};

type MenuGroup = {
  name: string;
  menuItems: MenuItem[];
};

const SidebarAdmin = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname(); // To determine the active menu
  const [openMenu, setOpenMenu] = useState<string | null>(null); // To toggle visibility of child items
  const [availableTypes, setAvailableTypes] = useState<any[]>([]); // To store types from API

  // Fetch the types data
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("/api/tipe-pengajuan-berkas");
        const result = await response.json();
        if (response.ok) {
          setAvailableTypes(result.types); // Store the fetched types data
        } else {
          console.error("Failed to fetch types:", result.message);
        }
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    fetchTypes();
  }, []);

  const adminMenu: MenuGroup[] = [
    {
      name: "Menu",
      menuItems: [
        {
          label: "Dashboard",
          route: "/admin/dashboard",
          icon: <FaHome />, // Home icon
        },
      ],
    },
    {
      name: "Pengajuan Berkas",
      menuItems: [
        {
          label: "Monitoring Pengajuan",
          route: "/admin/monitoring-pengajuan",
          icon: <IoMdPaper />, // Paper icon
          children: availableTypes.map((type) => ({
            label: type.name,  // Using 'name' from API
            route: `/admin/monitoring-pengajuan/${type.slug}`,  // Dynamic route based on slug
          })),
        },
        {
          label: "Tipe Pengajuan Berkas",
          route: "/admin/tipe-pengajuan-berkas",
          icon: <GiTripleLock />, // Lock icon
        },
        {
          label: "Kelompok Keahlian",
          route: "/admin/kelompok-keahlian",
          icon: <GiTripleLock />, // Lock icon
        },
        {
          label: "Pengumuman",
          route: "/admin/pengumuman",
          icon: <FaBullhorn />
        },
      ],
    },
    {
      name: "Pengaturan",
      menuItems: [
        {
          label: "Daftar Pengguna",
          route: "/admin/daftar-pengguna",
          icon: <FaUser />, // User icon
          children: [
            {
              label: "Admin",
              route: "/admin/daftar-pengguna/admin",
            },
            {
              label: "Admin Prodi",
              route: "/admin/daftar-pengguna/adminsitrasi",
            },
            {
              label: "Dosen",
              route: "/admin/daftar-pengguna/dosen",
            },
            {
              label: "Mahasiswa",
              route: "/admin/daftar-pengguna/mahasiswa",
            },
          ],
        },
        {
          label: "Pengaturan",
          route: "/admin/pengaturan",
          icon: <MdSettings />, // Settings icon
        },
        {
          label: "Profil",
          route: "/admin/profil",
          icon: <FaUser />, // User icon
        },
      ],
    },
  ];

  // Toggle child visibility when parent item is clicked
  const toggleSubMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-50 flex h-full w-72 flex-col border-r bg-white text-black rounded-lg transition-transform duration-300 ease-linear ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-6">
          <Link href="/">
            <div className="flex items-center">
              <Image
                src="/images/logo/logo-arsitek-new.png"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-full object-contain"
              />
              <span className="ml-2 text-2xl font-semibold text-black">Mazer</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-black lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z" />
            </svg>
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-6 py-4">
          {adminMenu.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              <h3 className="mb-2 text-xl font-semibold text-gray-600">{group.name}</h3>
              <ul className="space-y-2">
                {group.menuItems.map((menuItem, menuIndex) => (
                  <li key={menuIndex}>
                    {menuItem.children ? (
                      <>
                        <button
                          onClick={() => toggleSubMenu(menuItem.label)}
                          className={`flex items-center justify-between w-full gap-2 rounded-lg px-4 py-2 text-base font-medium text-gray-800 hover:bg-green-100 ${
                            pathname === menuItem.route ? "bg-gray-300 text-gray-800" : ""
                          }`}
                        >
                          {menuItem.icon} {menuItem.label}
                          <svg
                            className={`transition-transform transform ${
                              openMenu === menuItem.label ? "rotate-180" : ""
                            }`}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 15L6 9H18L12 15Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                        {openMenu === menuItem.label && (
                          <ul className="mt-2 space-y-2 pl-6">
                            {menuItem.children.map((child, childIndex) => (
                              <li key={childIndex}>
                                <Link
                                  href={child.route || "#"}
                                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-base font-medium text-gray-800 hover:bg-green-100 ${
                                    pathname === child.route ? "bg-gray-300 text-gray-800" : ""
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link
                        href={menuItem.route || "#"}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-base font-medium text-gray-800 hover:bg-green-100 ${
                          pathname === menuItem.route ? "bg-gray-300 text-gray-800" : ""
                        }`}
                      >
                        {menuItem.icon} {menuItem.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Logout below Pengaturan */}
        <div className="px-6 py-4">
          <Link
            href="/logout"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-base font-medium text-gray-800 hover:bg-green-100"
          >
            <FaSignOutAlt /> Logout
          </Link>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default SidebarAdmin;
