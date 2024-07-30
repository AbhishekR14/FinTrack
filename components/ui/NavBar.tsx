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
import Spinner from "./Spinner";

export default function NavBar(props: navBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useRecoilState(currency);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currencySelectorRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  const [showSpinner, setShowSpinner] = useState(false);

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

  const currencyOptions = ["INR", "USD", "EUR", "GBP", "CAD", "YEN"];
  if (showSpinner) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  return (
    <nav className="bg-gray-100 border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="mx-2 self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            <img src="/Logo-full.png" className="h-7" alt="FinTrack Logo" />
          </span>
        </a>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <div className="mx-2">
            <ThemeToggle />
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded={isDropdownOpen}
              onClick={toggleDropdown}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-9 h-9 rounded-full"
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
                  <span className="block text-sm text-gray-900 truncate dark:text-white">
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
                      setShowSpinner(true);
                      setIsDropdownOpen(false);
                      if (session.data?.user) {
                        const res = await setCurrency(
                          //@ts-ignore
                          session.data?.user.id,
                          newValue
                        );
                        if (res) {
                          setSelectedCurrency(newValue);
                          setIsSelectOpen(false);
                          setShowSpinner(false);
                        }
                      }
                      setShowSpinner(false);
                    }}
                  >
                    <SelectTrigger className="w-full px-4 border-none hover:bg-gray-100 dark:hover:bg-gray-600 shadow-none">
                      <SelectValue placeholder={selectedCurrency} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {currencyOptions.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            disabled={option === selectedCurrency}
                          >
                            {option}
                          </SelectItem>
                        ))}
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
