import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Text,
} from 'recharts';
import Container from '../assets/wrappers/FlashChartContainer';

function CustomizedAxisTick(props) {
  const { x, y, stroke, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <Text
        x={0}
        y={0} // Adjust if you are customizing further
        dy={16} // Adjust based on your needs for vertical positioning
        textAnchor="middle"
        fill="#b3b3b3"
        transform="rotate(0)"
        fontSize={13}
      >
        {payload.value}
      </Text>
    </g>
  );
}
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: '#f6f6f6',
          padding: '10px',
          borderRadius: '10px',
          boxShadow: '0 2px 2px rgba(0,0,0,0.2)',
          fontSize: '10px',
        }}
      >
        <p>{label}</p>
        <p>
          <b>Count:</b> {payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};
function AreaChartComponent({ data }) {
  return (
    <Container>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 0, left: -60, bottom: -40 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4541de" stopOpacity={1} />
              <stop offset="95%" stopColor="#e976c7" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis axisLine={false} dataKey="date" height={60} tick={false} />
          <YAxis
            axisLine={false}
            allowDecimals={false}
            tick={false} // Keeps Y-axis ticks hidden
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#4541de"
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default AreaChartComponent;
