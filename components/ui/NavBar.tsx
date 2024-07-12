"use client";
import { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";
import { useRecoilState } from "recoil";
import { currency } from "@/store/atoms/transactions";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { setCurrency } from "@/app/api/transactions/actions/currency";

export default function NavBar(props: navBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useRecoilState(currency);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currencySelectorRef = useRef<HTMLDivElement>(null);
  const session = useSession();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      currencySelectorRef.current &&
      !currencySelectorRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (!isSelectOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSelectOpen]);

  return (
    <nav className="bg-gray-100 border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="/home"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="/Logo.png" className="h-8" alt="FinTrack Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            FinTrack
          </span>
        </a>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <div className="mx-2">
            <ThemeToggle />
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded={isDropdownOpen}
              onClick={toggleDropdown}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src={props.profilePicture}
                alt="user photo"
              />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-md shadow-lg dark:bg-gray-700"
                id="user-dropdown"
              >
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    {props.userName}
                  </span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                    {props.email}
                  </span>
                </div>
                <div
                  ref={currencySelectorRef}
                  onMouseDown={() => setIsSelectOpen(true)}
                  onBlur={() => setIsSelectOpen(false)}
                >
                  <Select
                    value={selectedCurrency}
                    onValueChange={async (newValue) => {
                      if (session.data?.user) {
                        const res = await setCurrency(
                          //@ts-ignore
                          session.data?.user.id,
                          newValue
                        );
                        if (res) {
                          setSelectedCurrency(newValue);
                          setIsDropdownOpen(false);
                          setIsSelectOpen(false);
                        }
                      }
                    }}
                  >
                    <SelectTrigger className="w-full px-4 border-none hover:bg-gray-100 dark:hover:bg-gray-600">
                      <SelectValue placeholder={selectedCurrency} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          value="INR"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          INR
                        </SelectItem>
                        <SelectItem
                          value="USD"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          USD
                        </SelectItem>
                        <SelectItem
                          value="EUR"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          EUR
                        </SelectItem>
                        <SelectItem
                          value="GBP"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          GBP
                        </SelectItem>
                        <SelectItem
                          value="CAD"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          CAD
                        </SelectItem>
                        <SelectItem
                          value="YEN"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          YEN
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white rounded-md"
                      onClick={() => {
                        signOut();
                      }}
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

type navBarProps = {
  profilePicture: string;
  userName: string;
  email: string;
};
