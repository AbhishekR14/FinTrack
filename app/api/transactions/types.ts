export type addTranscationType = {
  userId: string;
  amount: number;
  category: string;
  type: string;
  note: string;
};
export type addTestTranscationType = {
  userId: string;
  amount: number;
  category: string;
  type: string;
  note: string;
  testdata: boolean;
};

export type updateTranscationType = {
  id: string;
  userId: string;
  amount: number;
  date: Date;
  category: string;
  type: string;
  note: string;
  testdata: boolean;
};
