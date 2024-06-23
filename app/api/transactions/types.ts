export type addTransactionType = {
  userId: string;
  amount: number;
  category: string;
  type: string;
  note: string;
};
export type addTestTransactionType = {
  userId: string;
  amount: number;
  category: string;
  type: string;
  note: string;
  testdata: boolean;
};

export type updateTransactionType = {
  id: string;
  userId: string;
  amount: number;
  date: Date;
  category: string;
  type: string;
  note: string;
  testdata: boolean;
};
