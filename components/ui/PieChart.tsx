import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "next-themes";

const PieChart = () => {
  const { theme } = useTheme();
  const options = {
    chart: {
      type: "pie",
      backgroundColor: "",
    },
    title: {
      text: "Pie Chart",
      style: {
        color: theme === "dark" ? "#FFFFFF" : "#000000",
      },
    },
    xAxis: {
      labels: {
        style: {
          color: theme === "dark" ? "#FFFFFF" : "#000000",
        },
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          color: theme === "dark" ? "#FFFFFF" : "#000000",
        },
      },
    },
    legend: {
      itemStyle: {
        color: theme === "dark" ? "#FFFFFF" : "#000000",
      },
    },
    series: [
      {
        name: "Expenses",
        data: [
          { name: "Rent", y: 45 },
          { name: "Food", y: 25 },
          { name: "Utilities", y: 15 },
          { name: "Entertainment", y: 15 },
        ],
      },
    ],
  };

  return (
    <div className="p-4 dark:bg-gray-800 dark:text-white rounded-lg shadow-lg bg-gray-50 hover:bg-gray-100 hover:dark:bg-gray-700">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default PieChart;
