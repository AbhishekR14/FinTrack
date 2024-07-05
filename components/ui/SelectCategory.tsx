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
  const [categories, setCategories] = React.useState<string[]>(
    categoryString.split(",").filter((category) => category !== "")
  );

  async function callEditCategories(userId: string) {
    try {
      const res = await editCategories(userId, categoryString);
      if (res) {
        return true;
      }
    } catch (e) {
      console.log("Error while updating the categories");
      return false;
    }
  }

  React.useEffect(() => {
    const newCategories = categoryString
      .split(",")
      .filter((category) => category !== "");
    setCategories(newCategories);
  }, [categoryString]);

  const handleDelete = (categoryValue: string) => {
    const updatedCategories = categories.filter(
      (category) => category !== categoryValue
    );
    setCategories(updatedCategories);
    if (value === categoryValue) {
      setValue("");
    }
  };

  React.useEffect(() => {
    const str = categories.join(",");
    setCategoryString(str);
    callEditCategories(userId);
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
          {value ? value : "Select Category..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[275px] p-0 max-h-[300px] overflow-y-auto">
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
                  className="text-white px-2 rounded text-sm"
                  onClick={() => {
                    const trimmedCategory = newCategory.trim();
                    if (categories.includes(trimmedCategory)) {
                      setNewCategory("");
                    } else if (trimmedCategory !== "") {
                      const updatedCategories = [
                        ...categories,
                        trimmedCategory,
                      ];
                      setCategories(updatedCategories);
                      setCategoryString(
                        categoryString +
                          (categoryString ? "," : "") +
                          trimmedCategory
                      );
                      setNewCategory("");
                      callEditCategories(userId);
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
              {categories.map((category) => (
                <CommandItem
                  key={category}
                  value={category}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="truncate">{category}</div>
                  <div className="flex items-center space-x-1">
                    <CheckIcon
                      className={cn(
                        "h-4 w-4",
                        value === category ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <button
                      className="ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(category);
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
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
