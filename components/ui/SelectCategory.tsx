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

const categories = [
  {
    value: "Eating Out",
    label: "Eating Out",
  },
  {
    value: "Travel",
    label: "Travel",
  },
  {
    value: "Shopping",
    label: "Shopping",
  },
  {
    value: "Gifts",
    label: "Gifts",
  },
];

export function SelectCategory({
  userId,
  value,
  setValue,
}: {
  userId: String;
  value: String;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setOpen] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState("");
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
              <CommandItem slot="1">
                <Input
                  placeholder="Add new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button
                  className="ml-2 border dark:bg-slate-300 dark:text-black px-2 py-1 rounded"
                  onClick={() => {
                    if (
                      categories.find(
                        (category) => category.value === newCategory
                      )
                    ) {
                      setNewCategory("");
                    } else {
                      categories.push({
                        value: newCategory,
                        label: newCategory,
                      });
                      setNewCategory("");
                    }
                  }}
                >
                  Add
                </button>
              </CommandItem>
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
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
