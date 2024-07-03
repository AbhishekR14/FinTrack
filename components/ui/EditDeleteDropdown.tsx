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

export default function EditDeleteDropdown({
  row,
}: {
  row: Row<transactionsType>;
}) {
  const changed = useSetRecoilState(loadTransactions);
  return (
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
          onClick={() => {
            console.log(row.original.id);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            try {
              const res = await deleteTransaction(row.original.id);
              if (res) {
                changed((prev: number) => prev + 1);
              }
            } catch (e) {
              console.error(e);
              alert("Something went wrong. Please try again later.");
            }
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
