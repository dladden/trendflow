import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Text,
} from 'recharts';
import Container from '../assets/wrappers/BarChartContainer';

function CustomizedAxisTick(props) {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <Text
        x={0}
        y={10}
        dy={16}
        textAnchor="middle"
        fill="#b3b3b3"
        transform="rotate(0)"
        tick={{ fill: '#b3b3b3' }}
        fontSize={13}
      >
        {payload.value}
      </Text>
    </g>
  );
}

function BarChartComponent({ data }) {
  return (
    <Container>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="4 2"
            strokeWidth={0.4}
            vertical={false}
          />
          <XAxis
            axisLine={{ stroke: '#b3b3b3' }}
            dataKey="date"
            height={60}
            tick={<CustomizedAxisTick />}
          />
          <YAxis
            axisLine={{ stroke: '#b3b3b3' }}
            tick={{ fill: '#b3b3b3', fontSize: 13 }}
          />
          <Tooltip
            cursor={{ fill: '#ededed' }}
            contentStyle={{
              backgroundColor: '#f6f6f6',
              border: 'none',
              radius: '8px',
            }}
          />
          <defs>
            <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4541de" stopOpacity={1} />
              <stop offset="95%" stopColor="#e976c7" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Bar dataKey="count" fill="url(#barColor)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
}

export default BarChartComponent;
