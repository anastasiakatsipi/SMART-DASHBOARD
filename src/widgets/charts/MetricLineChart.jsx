import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function MetricLineChart({ data, metric }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis
          dataKey="timestamp"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => {
            const d = new Date(value);
            return d.toLocaleDateString("el-GR", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit"
            });
          }}
        />

        <YAxis 
          domain={['dataMin - 5', 'dataMax + 5']} 
        />

        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
