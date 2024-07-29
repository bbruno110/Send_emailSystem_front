// components/Menu.tsx
'use client'
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaHome, FaHistory, FaEnvelope } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import Image from "next/image";
import Logo from '../assets/logo_D.png';

const links = [
  { id: 1, name: "Início", link: "/", icon: <FaHome size={26}/> },
  {
    id: 2,
    name: "Cadastros",
    link: "#",
    icon: <BsFillPeopleFill size={26}/>,
    submenu: [
      { id: 5, name: "Cadastro CNPJ", link: "/Cadastro" },
      { id: 6, name: "Cadastro Perfil", link: "/Perfil" },
    ],
  },
  { id: 3, name: "Histórico", link: "/Historico", icon: <FaHistory size={26} /> },
  { id: 4, name: "Email", link: "/Email", icon: <FaEnvelope size={26}/> },
];

const Menu = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleEmailClick = () => {
    sessionStorage.clear(); // Limpar sessionStorage ao clicar em "Email"
  };

  return (
    <nav className="bg-gray-800 text-white select-none fixed top-0 left-0 w-full z-60 ">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={handleMenuToggle}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Image src={Logo} alt="Logo" className=" object-contain h-16 w-40" />
              </Link>
            </div>
            <div className="hidden sm:flex sm:ml-6">
              <div className="flex space-x-4 items-center h-full">
                {links.map((link) => (
                  <div key={link.id} className="relative group flex items-center">
                    <Link href={link.link}>
                      <span
                        className={`px-3 h-16 rounded-md text-xl font-medium flex items-center space-x-2 cursor-pointer ${
                          activeTab === link.link ||
                          (link.submenu &&
                            link.submenu.some((subLink) => activeTab === subLink.link))
                            ? "text-white text-lg font-bold"
                            : "text-gray-300 hover:text-white hover:bg-gray-900"
                        }`}
                        onClick={link.name === "Email" ? handleEmailClick : undefined}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </span>
                    </Link>
                    {link.submenu && (
                      <div className="hidden absolute left-0 top-full w-48 bg-gray-800 rounded-md shadow-lg group-hover:block">
                        {link.submenu.map((subLink) => (
                          <Link key={subLink.id} href={subLink.link}>
                            <span className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">
                              {subLink.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${menuOpen ? "block" : "hidden"} sm:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {links.map((link) => (
            <div key={link.id}>
              <Link href={link.link}>
                <span
                  className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                    activeTab === link.link ||
                    (link.submenu && link.submenu.some((subLink) => activeTab === subLink.link))
                      ? "text-white bg-gray-900"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </span>
              </Link>
              {link.submenu && (
                <div className="pl-4">
                  {link.submenu.map((subLink) => (
                    <Link key={subLink.id} href={subLink.link}>
                      <span
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                        onClick={() => setMenuOpen(false)}
                      >
                        {subLink.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Menu;
