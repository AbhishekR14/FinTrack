const CurrentMonthSummary = ({ income, categories }: PropsTypes) => {
  const totalExpense = categories.reduce(
    (acc, category) => acc + category.amount,
    0
  );
  const balance = income - totalExpense;

  return (
    <div className="p-6 dark:bg-gray-800 dark:text-white rounded-lg shadow-lg bg-gray-50 hover:bg-gray-100 hover:dark:bg-gray-700">
      <div className="flex justify-between items-center mb-4">
        <button className="text-lg">&lt;</button>
        <h2 className="text-xl font-bold">July</h2>
        <button className="text-lg">&gt;</button>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-lg">
          <span>Income</span>
          <span className="text-green-500 pr-2">₹{income.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span>Expense</span>
          <span className="text-red-500 pr-2">₹{totalExpense.toFixed(2)}</span>
        </div>
      </div>
      <div className="mb-4 h-52 pr-2 overflow-y-auto top-1/2 left-1/4">
        {categories.map((category, index) => (
          <div key={index} className="flex justify-between">
            <span>{category.name}</span>
            <span>₹{category.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <hr className="border-t-2 border-gray-600 mb-4" />
      <div className="flex justify-between text-xl pr-2">
        <span>Balance</span>
        <span
          className={`font-bold ${
            balance < 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          {balance < 0 ? "-" : ""}₹{Math.abs(balance).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

type PropsTypes = {
  income: number;
  categories: { name: string; amount: number }[];
};

export default CurrentMonthSummary;
