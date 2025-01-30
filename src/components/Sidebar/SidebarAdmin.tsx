"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ClickOutside from "@/components/ClickOutside";

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
  const pathname = usePathname(); // Untuk menentukan menu aktif
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleSubMenu = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
  };

  const adminMenu: MenuGroup[] = [
    {
      name: "MENU UTAMA",
      menuItems: [
        {
          label: "Dashboard",
          route: "/admin/dashboard",
          icon: (
            <svg
              className="text- fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.00009 17.2498C8.58588 17.2498 8.25009 17.5856 8.25009 17.9998C8.25009 18.414 8.58588 18.7498 9.00009 18.7498H15.0001C15.4143 18.7498 15.7501 18.414 15.7501 17.9998C15.7501 17.5856 15.4143 17.2498 15.0001 17.2498H9.00009Z"
                fill=""
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 1.25C11.2749 1.25 10.6134 1.44911 9.88928 1.7871C9.18832 2.11428 8.37772 2.59716 7.36183 3.20233L5.90622 4.06943C4.78711 4.73606 3.89535 5.26727 3.22015 5.77524C2.52314 6.29963 1.99999 6.8396 1.65907 7.55072C1.31799 8.26219 1.22554 9.0068 1.25519 9.87584C1.2839 10.717 1.43105 11.7397 1.61556 13.0219L1.90792 15.0537C2.14531 16.7036 2.33368 18.0128 2.61512 19.0322C2.90523 20.0829 3.31686 20.9169 4.05965 21.5565C4.80184 22.1956 5.68984 22.4814 6.77634 22.6177C7.83154 22.75 9.16281 22.75 10.8423 22.75H13.1577C14.8372 22.75 16.1685 22.75 17.2237 22.6177C18.3102 22.4814 19.1982 22.1956 19.9404 21.5565C20.6831 20.9169 21.0948 20.0829 21.3849 19.0322C21.6663 18.0129 21.8547 16.7036 22.0921 15.0537L22.3844 13.0219C22.569 11.7396 22.7161 10.717 22.7448 9.87584C22.7745 9.0068 22.682 8.26219 22.3409 7.55072C22 6.8396 21.4769 6.29963 20.7799 5.77524C20.1047 5.26727 19.2129 4.73606 18.0938 4.06943L16.6382 3.20233C15.6223 2.59716 14.8117 2.11428 14.1107 1.7871C13.3866 1.44911 12.7251 1.25 12 1.25ZM8.09558 4.51121C9.15309 3.88126 9.89923 3.43781 10.5237 3.14633C11.1328 2.86203 11.5708 2.75 12 2.75C12.4293 2.75 12.8672 2.86203 13.4763 3.14633C14.1008 3.43781 14.8469 3.88126 15.9044 4.51121L17.2893 5.33615C18.4536 6.02973 19.2752 6.52034 19.8781 6.9739C20.4665 7.41662 20.7888 7.78294 20.9883 8.19917C21.1877 8.61505 21.2706 9.09337 21.2457 9.82469C21.2201 10.5745 21.0856 11.5163 20.8936 12.8511L20.6148 14.7884C20.3683 16.5016 20.1921 17.7162 19.939 18.633C19.6916 19.5289 19.3939 20.0476 18.9616 20.4198C18.5287 20.7926 17.9676 21.0127 17.037 21.1294C16.086 21.2486 14.8488 21.25 13.1061 21.25H10.8939C9.15124 21.25 7.91405 21.2486 6.963 21.1294C6.03246 21.0127 5.47129 20.7926 5.03841 20.4198C4.60614 20.0476 4.30838 19.5289 4.06102 18.633C3.80791 17.7162 3.6317 16.5016 3.3852 14.7884L3.10643 12.851C2.91437 11.5163 2.77991 10.5745 2.75432 9.82469C2.72937 9.09337 2.81229 8.61505 3.01167 8.19917C3.21121 7.78294 3.53347 7.41662 4.12194 6.9739C4.72482 6.52034 5.54643 6.02973 6.71074 5.33615L8.09558 4.51121Z"
                fill=""
              />
            </svg>
          ),
        },
        // {
        //   label: "Monitoring Pengajuan",
        //   route: "/admin/tipe-pengajuan-berkas",
        //   icon: (
        //     <svg
        //       xmlns="http://www.w3.org/2000/svg"
        //       fill="none"
        //       viewBox="0 0 24 24"
        //       strokeWidth="1.5"
        //       stroke="currentColor"
        //       className="h-6 w-6"
        //     >
        //       <path
        //         strokeLinecap="round"
        //         strokeLinejoin="round"
        //         d="M10.5 6h8.25M10.5 12h8.25M10.5 18h8.25M5.25 6h.008v.008H5.25V6zm0 6h.008v.008H5.25V12zm0 6h.008v.008H5.25V18z"
        //       />
        //     </svg>
        //   ),
        // },
        {
            label: "Tipe Pengajuan Berkas",
            route: "/admin/tipe-pengajuan-berkas",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h8.25M10.5 12h8.25M10.5 18h8.25M5.25 6h.008v.008H5.25V6zm0 6h.008v.008H5.25V12zm0 6h.008v.008H5.25V18z"
                />
              </svg>
            ),
          },
        // {
        //   label: "Pengajuan",
        //   icon: (
        //     <svg
        //       xmlns="http://www.w3.org/2000/svg"
        //       fill="none"
        //       viewBox="0 0 24 24"
        //       strokeWidth="1.5"
        //       stroke="currentColor"
        //       className="h-6 w-6"
        //     >
        //       <path
        //         strokeLinecap="round"
        //         strokeLinejoin="round"
        //         d="M3.75 5.25h16.5m-16.5 7.5h16.5m-16.5 7.5h16.5"
        //       />
        //     </svg>
        //   ),
        //   children: [
        //     { label: "Pengajuan Proposal", route: "/admin/pengajuan/proposal" },
        //     { label: "Pengajuan Sidang", route: "/admin/pengajuan/sidang" },
        //   ],
        // },
        {
          label: "Kelompok Keahlian",
          route: "/admin/kelompok-keahlian",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m6-6H6"
              />
            </svg>
          ),
        },
        {
          label: "Daftar Pengguna",
          route: "/admin/daftar-pengguna",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25m0 0H12m3.75 0h3.75M6.75 15V18.75m0 0H3m3.75 0h3.75m7.5 0V15m0 3.75V21m-15-12h15"
              />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-50 flex h-full w-72 flex-col border-r bg-gradient-to-b from-primaryBlue to-secondaryBlue text-white transition-transform duration-300 ease-linear ${
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
              <span className="ml-2 text-2xl font-bold text-white">
                E-Doars
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white lg:hidden"
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
              <h3 className="mb-2 text-sm font-semibold text-gray-300">
                {group.name}
              </h3>
              <ul className="space-y-2">
                {group.menuItems.map((menuItem, menuIndex) => (
                  <li key={menuIndex}>
                    {menuItem.children ? (
                      <>
                        <button
                          onClick={() => toggleSubMenu(menuItem.label)}
                          className={`flex w-full items-center justify-between rounded-lg px-4 py-2 hover:bg-green-500 ${
                            activeMenu === menuItem.label ? "bg-green-500" : ""
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {menuItem.icon} {menuItem.label}
                          </span>
                          <svg
                            className={`transition-transform ${
                              activeMenu === menuItem.label ? "rotate-180" : ""
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
                        {activeMenu === menuItem.label && (
                          <ul className="mt-2 space-y-2 pl-6">
                            {menuItem.children.map((child, childIndex) => (
                              <li key={childIndex}>
                                <Link
                                  href={child.route || "#"} // Jika `route` tidak ada, fallback ke "#"
                                  className={`block rounded-lg px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 ${
                                    pathname === child.route
                                      ? "bg-green-500 text-white"
                                      : ""
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
                        href={menuItem.route || "#"} // Jika `route` tidak ada, fallback ke "#"
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-green-500 ${
                          pathname === menuItem.route
                            ? "bg-green-500 text-white"
                            : ""
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
      </aside>
    </ClickOutside>
  );
};

export default SidebarAdmin;
