import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "next-themes";

const LineGraph = () => {
  const { theme } = useTheme();
  const options = {
    chart: {
      type: "line",
      backgroundColor: "",
    },
    title: {
      text: "Line Graph",
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
    yAxis: {
      labels: {
        style: {
          color: theme === "dark" ? "#FFFFFF" : "#000000",
        },
      },
      title: {
        style: {
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
        data: [1, 2, 3, 4, 5],
      },
    ],
  };

  return (
    <div className="p-4 dark:bg-gray-800 dark:text-white rounded-lg shadow-lg bg-gray-50 hover:bg-gray-100 hover:dark:bg-gray-700">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default LineGraph;
