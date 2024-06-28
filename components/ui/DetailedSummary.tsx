const DetailedSummary = () => {
  return (
    <div className="p-4 dark:bg-gray-800 dark:text-white rounded-lg shadow-lg bg-gray-50 hover:bg-gray-100 ">
      <h3 className="text-xl mb-2 dark:border-cyan-50">Detailed Summary</h3>
      <div className="overflow-x-auto max-h-96">
        <table className="md:min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Notes</th>
            </tr>
          </thead>
          <tbody className="overflow-y-auto ">
            <tr className="hover:bg-slate-300 hover:dark:bg-gray-700">
              <td className="border px-4 py-2">Milk</td>
              <td className="border px-4 py-2">10 Rs</td>
              <td className="border px-4 py-2">2023-06-01</td>
              <td className="border px-4 py-2">Grocery</td>
              <td className="border px-4 py-2">Expense</td>
              <td className="border px-4 py-2">None</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailedSummary;
