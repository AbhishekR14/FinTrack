"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./input";
import { editCategories } from "@/app/api/transactions/actions/categories";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { categoryStringAtom } from "@/store/atoms/misc";

const initialCategories: { value: string; label: string }[] = [];
export function SelectCategory({
  userId,
  value,
  setValue,
}: {
  userId: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setOpen] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState("");
  const setCategoryString = useSetRecoilState(categoryStringAtom);
  const categoryString = useRecoilValue(categoryStringAtom);
  const [categories, setCategories] = React.useState(initialCategories);

  async function callEditCategories(userId: string) {
    try {
      const res = await editCategories(userId, categoryString);
      if (res) {
        return true;
      }
    } catch (e) {
      console.log("Error while updaing the categories");
      return false;
    }
  }
  React.useEffect(() => {
    categoryString.split(",").forEach((category) => {
      if (category !== "") {
        if (
          !initialCategories.some(
            (categoryPresent) => categoryPresent.value === category
          )
        ) {
          initialCategories.push({ value: category, label: category });
        }
      }
    });
    editCategories(userId, categoryString);
  }, [categoryString]);

  const handleDelete = (categoryValue: string) => {
    setCategories(
      categories.filter((category) => category.value !== categoryValue)
    );
    if (value === categoryValue) {
      setValue("");
    }
  };
  React.useEffect(() => {
    var str = "";
    categories.map((category) => {
      str = str + category.value + ",";
    });
    setCategoryString(str);
  }, [categories]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[275px] justify-between"
        >
          {value
            ? categories.find((category) => category.value === value)?.label
            : "Select Category..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[275px] p-0">
        <Command>
          <CommandInput placeholder="Search Category..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Category found.</CommandEmpty>
            <CommandGroup>
              <div className="flex mb-1">
                <Input
                  placeholder="Add new category"
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value.replace(/,/g, " "))
                  }
                />
                <button
                  className=" text-white  px-2  rounded text-sm"
                  onClick={() => {
                    const trimmedCategory = newCategory.trim();
                    if (
                      categories.find(
                        (category) => category.value === trimmedCategory
                      )
                    ) {
                      setNewCategory("");
                    } else if (trimmedCategory !== "") {
                      setCategories([
                        ...categories,
                        { value: trimmedCategory, label: trimmedCategory },
                      ]);
                      setCategoryString(categoryString + "," + trimmedCategory);
                      setNewCategory("");
                      callEditCategories(userId);
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    className="w-6 h-6 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 60 60"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M 36 12 C 22.75 12 12 22.75 12 36 C 12 49.25 22.75 60 36 60 C 49.25 60 60 49.25 60 36 C 60 33.41 59.590313 30.919844 58.820312 28.589844 L 51.529297 39.859375 C 51.506297 39.952375 51.482031 40.045672 51.457031 40.138672 C 49.640031 46.967672 43.409 52 36 52 C 27.16 52 20 44.84 20 36 C 20 27.16 27.16 20 36 20 C 38.54 20 40.940312 20.590625 43.070312 21.640625 L 47.429688 14.900391 C 44.029687 13.050391 40.14 12 36 12 z M 53.121094 17.126953 C 51.676768 17.155645 50.272109 17.877266 49.427734 19.181641 L 39.154297 35.058594 L 33.966797 29.111328 C 32.332797 27.237328 29.488187 27.045687 27.617188 28.679688 C 25.744187 30.313688 25.551547 33.155344 27.185547 35.027344 L 36.298828 45.472656 C 37.156828 46.455656 38.394453 47.015625 39.689453 47.015625 C 39.796453 47.015625 39.902766 47.010906 40.009766 47.003906 C 41.418766 46.902906 42.698797 46.147937 43.466797 44.960938 L 56.984375 24.070312 C 58.334375 21.984313 57.737391 19.198656 55.650391 17.847656 C 54.868891 17.341781 53.987689 17.109738 53.121094 17.126953 z"
                    ></path>
                  </svg>
                </button>
              </div>
              {categories.map((category) => (
                <CommandItem
                  key={category.value}
                  value={category.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {category.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === category.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <button
                    className="ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(category.value);
                    }}
                  >
                    <svg
                      className="w-4 h-4 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 30 30"
                    >
                      <path
                        fillRule="evenodd"
                        d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"
                      />
                    </svg>
                    <span className="sr-only">Delete Category</span>
                  </button>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
