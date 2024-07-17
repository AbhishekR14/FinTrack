import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { transactionsType } from "@/app/home/types";
import { TransactionFormValues, transactionSchema } from "@/app/home/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetRecoilState } from "recoil";
import { loadTransactions } from "@/store/atoms/misc";
import { putTransactions } from "@/app/api/transactions/actions/transactions";
import { updateTransactionType } from "@/app/api/transactions/types";
import { SelectCategory } from "./SelectCategory";
import { DatePicker } from "./DatePicker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EditDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  transaction: transactionsType | null;
};

type EditFormValues = TransactionFormValues & {
  id: string;
};

export default function EditDialog({
  isOpen,
  onClose,
  transaction,
}: EditDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      id: transaction?.id || "",
      amount: transaction?.amount.toString() || "",
      category: transaction?.category || "",
      note: transaction?.note || "",
      type: transaction?.type as "Expense" | "Income",
      date: new Date(transaction?.date || ""),
    },
  });
  const [saveMessage, setSaveMessage] = React.useState("Save Changes");
  const changed = useSetRecoilState(loadTransactions);

  const onSubmit = async (data: EditFormValues) => {
    if (saveMessage === "Save Changes") {
      const adjustedDate = new Date(
        Date.UTC(
          data.date.getFullYear(),
          data.date.getMonth(),
          data.date.getDate()
        )
      );
      setSaveMessage("Saving...");
      const transactionData: updateTransactionType = {
        id: transaction?.id as string,
        amount: parseFloat(data.amount) * 100,
        category: data.category,
        type: data.type,
        note: data.note || "",
        date: adjustedDate,
      };
      try {
        const res = await putTransactions(transactionData);
        if (res === true) {
          setSaveMessage("Saved!");
          onClose();
          changed((prev: number) => prev + 1);
          setTimeout(() => {
            setSaveMessage("Save Changes");
          }, 2000);
        } else {
          setSaveMessage("Errored! Try Again");
          setTimeout(() => {
            setSaveMessage("Save Changes");
          }, 3000);
        }
      } catch (e) {
        console.log(e);
        setSaveMessage("Errored! Try Again");
        setTimeout(() => {
          setSaveMessage("Save Changes");
        }, 3000);
      }
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <div className="hidden">Trigger for accessibility</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={
            //@ts-ignore
            handleSubmit(onSubmit)
          }
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter Amount"
                    className="col-span-3"
                    {...field}
                  />
                  {errors.amount && <span className="col-span-1"></span>}
                  {errors.amount && (
                    <span className="col-span-3 text-xs text-red-500">
                      {errors.amount.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <>
                  <div className="col-span-3">
                    <SelectCategory
                      userId={"change this"}
                      value={field.value}
                      setValue={field.onChange}
                    />
                  </div>
                  {errors.category && <span className="col-span-1"></span>}
                  {errors.category && (
                    <span className="col-span-3 text-xs text-red-500">
                      {errors.category.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note" className="text-right">
              Note
            </Label>
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <Input
                  id="note"
                  placeholder="Enter Note"
                  className="col-span-3"
                  {...field}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note" className="text-right">
              Date
            </Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <>
                  <DatePicker date={field.value} setDate={field.onChange} />
                  {errors.date && <span className="col-span-1"></span>}
                  {errors.date && (
                    <span className="col-span-4 text-xs text-red-500">
                      {errors.date.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    value={field.value}
                    onValueChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Expense">Expense</SelectItem>
                        <SelectItem value="Income">Income</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.type && <span className="col-span-1"></span>}
                  {errors.type && (
                    <span className="col-span-3 text-xs text-red-500">
                      {errors.type.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="submit">{saveMessage}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
/*<Input
                  id="type"
                  placeholder="Enter Type"
                  className="col-span-3"
                  {...field}
                />*/
