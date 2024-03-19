
'use client'
import dynamic from 'next/dynamic';
import moment from 'moment'
import { ApexOptions } from "apexcharts";
import { useState } from 'react';

import RecordCalendar, { DataType } from './RecordCalendar';
import { Container } from '@/components/Container'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

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


const RecordList = () => {
  const [crtDate, setCrtDate] = useState<Date>(new Date())

  // const records = await getAllRecords()

  const monthlyRecords: DataType[] = [{
    date: new Date('2024-03-08T12:00:00Z'),
    curls_count: 50,
    squats_count: 20,
    bridges_count: 10
  }, {
    date: new Date('2024-03-10T12:00:00Z'),
    curls_count: 15,
    squats_count: 10,
    bridges_count: 10
  }, {
    date: new Date('2024-03-14T12:00:00Z'),

    curls_count: 10,
    squats_count: 20,
    bridges_count: 10
  }, {
    date: new Date('2024-03-16T12:00:00Z'),

    curls_count: 20,
    squats_count: 10,
    bridges_count: 30
  }, {
    date: new Date('2024-03-19T12:00:00Z'),

    curls_count: 10,
    squats_count: 10,
    bridges_count: 10
  },
  ]



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

  const columnChartOptions: ApexOptions = {
    series: [{
      name: 'Curls',
      data: monthlyRecords.map((item) => item.curls_count)
    }, {
      name: 'Squats',
      data: monthlyRecords.map((item) => item.squats_count)
    }, {
      name: 'Bridges',
      data: monthlyRecords.map((item) => item.bridges_count)
    }],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        // endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: monthlyRecords.map((item) => moment(item.date).format('MM-DD-YYYY')),
    },
    yaxis: {
      title: {
        text: 'Count'
      }
    },
    fill: {
      opacity: 1
    },
  }

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



  const onHandleClickPreviousMonth = (): void => {
    const previousMonth = moment(crtDate).subtract(1, 'months').endOf('month').toDate()
    if (checkIsSameMonth(previousMonth, new Date())) {
      setCrtDate(new Date())
    } else {
      setCrtDate(previousMonth)
    }
  }

  const onHandleClickNextMonth = (): void => {
    const nextMonth = moment(crtDate).add(1, 'months').endOf('month').toDate()
    if (checkIsSameMonth(nextMonth, new Date())) {
      setCrtDate(new Date())
    } else {
      setCrtDate(nextMonth)
    }
  }

  const onHandleClickToday = (): void => {
    setCrtDate(new Date())
  }

  const checkIsSameMonth = (d1: Date, d2: Date): boolean => {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth()
  }

  return (
    <Container className='w-full' >
      <div className='p-4'>
        <RecordCalendar
          crtDate={crtDate}
          data={monthlyRecords}
          handleClickPreviousMonth={onHandleClickPreviousMonth}
          handleClickNextMonth={onHandleClickNextMonth}
          handleClickToday={onHandleClickToday}
        />
      </div>


      {/* 综合当月count的图 */}
      <div id="column-chart" className='w-full'>
        <ReactApexChart
          options={columnChartOptions}
          series={columnChartOptions.series}
          type="bar"
          height={CHART_HEIGHT}
          width={'100%'}
        />
      </div>


      {/* 默认隐藏线形图和饼图，当点击某天时再展示 */}
      <div className="relative" >
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-sm text-gray-500">Daily Records</span>
        </div>
      </div >

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


    </Container >
  )
}

export default RecordList;

