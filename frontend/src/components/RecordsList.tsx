
import { Container } from '@/components/Container'

import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import Calendar from './Calendar';

const MOOD = {
  1: '😞',
  2: '😡',
  3: '🤩',
}

// const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const CHART_HEIGHT = 450;

enum MoodIndex {
  Happy = 1,
  Angry,
  Sad
}
interface DailyRecord {
  // dateTime: Date,
  dateTime: string,
  count: number,
  mood: MoodIndex
}


export function RecordList() {
  // const records = await getAllRecords()

  const monthlyRecords = [{
    crtDate: 1, // 当月的第几日
    count: 15
  }, {
    crtDate: 3,
    count: 9
  }, {
    crtDate: 6,
    count: 150
  }, {
    crtDate: 7,
    count: 50
  }, {
    crtDate: 17,
    count: 100
  },]


  // 每日的records
  const dailyRecords: DailyRecord[] = [{
    // dateTime: new Date(),
    dateTime: '6:00',
    count: 15,
    mood: 1,
  }, {
    dateTime: '7:00',
    count: 13,
    mood: 3,
  }, {
    dateTime: '9:00',
    count: 20,
    mood: 2,
  }, {
    dateTime: '11:00',
    count: 30,
    mood: 2,
  }, {
    dateTime: '16:00',
    count: 25,
    mood: 1,
  }];

  const moodData = dailyRecords.map((record) => record.mood)

  const countData = dailyRecords.map((record) => record.count)

  const categories = dailyRecords.map((record) => record.dateTime)

  const pieSeries = new Array(3).fill(0)
  dailyRecords.map((record) => {
    pieSeries[record.mood - 1]++;
  })


  const lineChartOptions: ApexOptions = {
    // Define your chart options here
    chart: {
      width: 400,
      type: 'line',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (value, { seriesIndex, dataPointIndex, w }) => {
        if (seriesIndex == 1) {
          return MOOD[value as MoodIndex]
        }
        return `${value}`;
      }
    },
    tooltip: {
      y: [{
        formatter: undefined,
      }, {
        formatter: (val): string => {

          return MOOD[val as MoodIndex]
        }
      }],
    },
    series: [
      {
        name: 'Count',
        data: countData
      },
      {
        name: 'Mood',
        data: moodData
      },
    ],
    xaxis: {
      categories: categories
    },
    yaxis: [
      {
        title: {
          text: "Count"
        },
      },
      {
        opposite: true,
        title: {
          text: "Mood"
        },
        min: 1,
        max: 3,
        tickAmount: 2
      }
    ],
  };


  const pieChartOptions: ApexOptions = {
    series: pieSeries,
    chart: {
      type: 'donut',
    },
    labels: Object.values(MOOD),
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };


  return (
    <Container className='w-full'>
      <div className='p-4'>
        <Calendar now={new Date()} data={monthlyRecords} />
      </div>

      {/* 默认隐藏线形图和饼图，当点击某天时再展示 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-sm text-gray-500">Daily Records</span>
        </div>
      </div>

      <div className='flex w-full'>
        <div id="line-chart" className='w-6/12'>
          <ReactApexChart
            options={lineChartOptions}
            series={lineChartOptions.series}
            type="line"
            height={CHART_HEIGHT}
            width={'100%'}
          />
        </div>

        <div id="pie-chart" className='w-6/12 mt-4'>
          <ReactApexChart
            options={pieChartOptions}
            series={pieChartOptions.series}
            type="donut"
            height={CHART_HEIGHT}
            width={'100%'}
          />
        </div>
      </div>


    </Container>
  )
}
