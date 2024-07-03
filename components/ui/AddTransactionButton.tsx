import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "./DatePicker";
import { SelectCategory } from "./SelectCategory";
import { addTransactionType } from "@/app/api/transactions/types";
import { postTransaction } from "@/app/api/transactions/actions/transactions";

const transactionSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
      message: "Amount must be a positive number",
    }),
  category: z.string().nonempty("Category is required"),
  note: z.string().optional(),
  type: z.enum(["Expense", "Income"]),
  date: z.date(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

type InputProps = {
  type: string;
  userId: string;
  changed: React.Dispatch<React.SetStateAction<number>>;
};

export default function AddTransactionButton(props: InputProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: "",
      category: "",
      note: "",
      type: props.type as "Expense" | "Income",
      date: new Date(),
    },
  });

  const [isOpen, setIsOpen] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState("Save");
  const [transactionType, setTransactionType] = React.useState(props.type);

  const onSubmit = async (data: TransactionFormValues) => {
    setSaveMessage("Saving...");
    const transactionData: addTransactionType = {
      userId: props.userId,
      amount: parseFloat(data.amount),
      category: data.category,
      type: data.type,
      note: data.note || "",
      date: data.date,
    };
    try {
      const res = await postTransaction(transactionData);
      if (res === true) {
        setSaveMessage("Saved!");
        props.changed((prev) => prev + 1);
        setTimeout(() => {
          setSaveMessage("Save");
          setIsOpen(false);
        }, 3000);
      } else {
        setSaveMessage("Errored! Try Again");
        setTimeout(() => {
          setSaveMessage("Save");
        }, 3000);
      }
    } catch (e) {
      console.log(e);
      setSaveMessage("Errored! Try Again");
      setTimeout(() => {
        setSaveMessage("Save");
      }, 3000);
    }
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (!isOpen) {
      reset({
        amount: "",
        category: "",
        note: "",
        type: props.type as "Expense" | "Income",
        date: new Date(),
      });
      setTransactionType(props.type);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Add {props.type}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add {transactionType}</DialogTitle>
          <DialogDescription>
            Add your {transactionType} here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
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
                      userId={props.userId}
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
            <Label htmlFor="date" className="text-right">
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
            <Label htmlFor="note" className="text-right">
              Note
            </Label>
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    id="note"
                    placeholder="Add Note"
                    className="col-span-3"
                    {...field}
                  />
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
                      setTransactionType(newValue);
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
