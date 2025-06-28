import { LineChart } from "@tremor/react";

const chartData = [
  { time: "10:00", wpm: 60 },
  { time: "10:10", wpm: 72 },
  { time: "10:20", wpm: 68 },
  { time: "10:30", wpm: 85 },
];

export default function AccountPage() {
  return (
    <div>
      <h1>Account Name</h1>
      <p>Mr Jacoby</p>
      <h1>Email</h1>
      <p>jacobdam06@gmail.com</p>
      <h1>Password</h1>
      <p>******</p>
      <h1>Telephone</h1>
      <p>5195644049</p>

      <LineChart
        className="h-72"
        data={chartData}
        index="time"
        categories={["wpm"]}
        colors={["indigo"]}
        yAxisWidth={40}
      />
    </div>
  );
}
