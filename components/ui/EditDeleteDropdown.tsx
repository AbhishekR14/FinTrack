import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { deleteTransaction } from "@/app/api/transactions/actions/transactions";
import { Row } from "@tanstack/react-table";
import { transactionsType } from "@/app/home/types";
import { loadTransactions } from "@/store/atoms/misc";
import { useSetRecoilState } from "recoil";
import EditDialog from "./EditDialog";

export default function EditDeleteDropdown({
  row,
}: {
  row: Row<transactionsType>;
}) {
  const changed = useSetRecoilState(loadTransactions);
  const [isDialoglOpen, setIsDialoglOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<transactionsType | null>(null);

  const handleEditClick = () => {
    setSelectedTransaction(row.original);
    setIsDialoglOpen(true);
  };

  const handleDeleteClick = async () => {
    try {
      const res = await deleteTransaction(row.original.id);
      if (res) {
        changed((prev: number) => prev + 1);
      }
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleEditClick}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleDeleteClick}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isDialoglOpen && (
        <EditDialog
          isOpen={isDialoglOpen}
          onClose={() => setIsDialoglOpen(false)}
          transaction={selectedTransaction}
        />
      )}
    </>
  );
}
