import { useState } from "react";
import { DropdownButton } from "@/components/my_own/DropdownButton";
import {
  LineChart,
  DonutChart,
  AreaChart,
  EventProps,
  Legend,
} from "@tremor/react";
import { AreaChartHero } from "./test";

//in terms of data, lang and framework are pretty consistent, we are going to get a bunch of results
//and then use calculate the percentage from the raw numbers,

//

const chartData = [
  { month: "Jan", wpm: 60, year: "2025" },
  { month: "Feb", wpm: 72, year: "2025" },
  { month: "Mar", wpm: 68, year: "2025" },
  { month: "Apr", wpm: 85, year: "2025" },
  { month: "May", year: "2025" },
  { month: "June", year: "2025" },
  { month: "July", year: "2025" },
  { month: "Aug", year: "2025" },
  { month: "Sep", year: "2025" },
  { month: "Oct", year: "2025" },
  { month: "Nov", year: "2025" },
  { month: "Dec", year: "2025" },
];

const langData = [
  { lang: "Java", percent: 30 },
  { lang: "Python", percent: 25 },
  { lang: "C++", percent: 40 },
  { lang: "Rust", percent: 5 },
];

const frameworkData = [
  { framework: "Springboot", percent: 70 },
  { framework: "Python", percent: 30 },
];

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()} wpm`;

export default function AccountPage() {
  let years: string[] = ["2025", "2026"];
  const [year, setYear] = useState<string>("2025");
  const [yearOpen, setYearOpen] = useState<boolean>(false);

  return (
    <div className="text-white w-full">
      <div>
        <div>Yearly WPM Summary</div>
        <DropdownButton
          options={years}
          currentOption={year}
          setCurrentOption={setYear}
          menuOpen={yearOpen}
          setMenuOpen={setYearOpen}
        />
      </div>

      <div className="flex w-full border-2 border-green-600">
        <AreaChart
          showGridLines={true}
          enableLegendSlider={false}
          showTooltip={false}
          showLegend={false}
          className="h-80 mt-6"
          data={chartData}
          index="month"
          categories={["wpm"]}
          colors={["indigo"]}
          valueFormatter={dataFormatter}
          yAxisWidth={60}
          onValueChange={(v) => console.log(v)}
        />
      </div>

      <div className="flex">
        {/* container for langData */}
        <div className="flex">
          <DonutChart
            className="border-2 border-green-500 w-48"
            label=" "
            data={langData}
            category="percent"
            index="lang"
            valueFormatter={dataFormatter}
            colors={["blue", "red", "green", "yellow"]}
          />
          <div className="flex flex-col whitespace-pre font-vscodeText">
            <div>Most Typed Language</div>
            {/* can we have the opposite be a fixed size and then flex-reverse */}
            {langData.map((item, index) => (
              <div key={index} className="flex">
                <div className="w-12 text-right">{`${item.percent}%`}</div>
                <div>{` - ${item.lang}`}</div>
              </div>
            ))}
          </div>
        </div>

        {/* container for framework data */}
        <div className="flex">
          <DonutChart
            className="border-2 border-green-500 w-48"
            label=" "
            data={frameworkData}
            category="percent"
            index="lang"
            valueFormatter={dataFormatter}
            colors={["blue", "red", "green", "yellow"]}
          />
          <div className="flex flex-col whitespace-pre font-vscodeText">
            <div>Most Typed Framework</div>
            {/* can we have the opposite be a fixed size and then flex-reverse */}
            {frameworkData.map((item, index) => (
              <div key={index} className="flex">
                <div className="w-12 text-right">{`${item.percent}%`}</div>
                <div>{` - ${item.framework}`}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
