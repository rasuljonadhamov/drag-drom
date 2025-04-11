import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import SpiralChart from "./SpiralChart";

const ChartComponent = ({ chartType, data, width, height }) => {
  switch (chartType) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={height - 80}>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={height - 80}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'sparkline':
      return (
        <ResponsiveContainer width="100%" height={60}>
          <LineChart data={data}>
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={1} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      );
    case 'spiral':
      return (
        <SpiralChart data={data} width={width - 50} height={height - 80} />
      );
    default:
      return <div className="text-gray-500">No chart selected</div>;
  }
};

export default ChartComponent;