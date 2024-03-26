
'use client'
import dynamic from 'next/dynamic';
import moment from 'moment'
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from 'react';

import RecordCalendar, { DataType } from './RecordCalendar';
import { Container } from '@/components/Container'
import Empty from './EmptyChart';
import { checkIsSameDay } from '@/lib/utils';
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
  // create_time: Date,
  create_time: string,
  count: number,
  mood: MoodIndex
}


const RecordList = () => {
  const [crtDate, setCrtDate] = useState<Date>(moment().toDate())
  const [monthlyRecords, setMonthlyRecords] = useState<DataType[]>([])

  const [dailyRecords, setDailyRecords] = useState<DataType[] | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    fetchMonthlyRecords();
  }, [])

  useEffect(() => {
    fetchMonthlyRecords();
  }, [crtDate])

  useEffect(() => {
    if (selectedDate) {
      fetchDailyRecords()
    }
  }, [selectedDate])

  const fetchDailyRecords = async () => {
    if (selectedDate) {
      try {
        const response = await fetch('/api/record/daily', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ date: selectedDate })
        });
        if (!response.ok) {
          throw new Error('Fetch records failed');
        }
        const responseData = await response.json();
        setDailyRecords(responseData.data.map((item: DataType) => {
          return {
            ...item,
            create_time: moment(item.create_time).toDate()
          }
        }))
      } catch (error) {
        console.error("Error in fetchDailyRecords")
        console.error(error)
      }
    }

  }
  const fetchMonthlyRecords = async () => {
    try {
      const response = await fetch('/api/record/monthly', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date: crtDate })
      });
      if (!response.ok) {
        throw new Error('Fetch records failed');
      }
      const responseData = await response.json();
      setMonthlyRecords(responseData.data.map((item: DataType) => {
        return {
          ...item,
          create_time: moment(item.create_time).toDate()
        }
      }))
      resetDaily()
    } catch (error) {
      console.error("Error in fetchMonthlyRecords")
      console.error(error)
    }

  }

  const resetDaily = () => {
    setDailyRecords(null)
    setSelectedDate(null)
  }


  // const moodData = dailyRecords?.map((record) => record.mood)

  // const countData = dailyRecords?.map((record) => record.count)

  const categories = dailyRecords?.map((record) => record.create_time)

  const pieSeries = new Array(3).fill(0)
  // dailyRecords.map((record) => {
  //   pieSeries[record.mood - 1]++;
  // })

  const monthlyColumnChartOptions: ApexOptions = {
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
      categories: monthlyRecords.map((item) => moment(item.create_time).format('MM-DD-YYYY')),
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

  const dailyColumnChartOptions: ApexOptions = {
    series: [{
      name: 'Curls',
      data: dailyRecords?.map((item) => item.curls_count) ?? []
    }, {
      name: 'Squats',
      data: dailyRecords?.map((item) => item.squats_count) ?? []
    }, {
      name: 'Bridges',
      data: dailyRecords?.map((item) => item.bridges_count) ?? []
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
      categories: dailyRecords?.map((item) => moment(item.create_time).format('hh:mm')),
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

  // const lineChartOptions: ApexOptions = {
  //   // Define your chart options here
  //   chart: {
  //     width: 400,
  //     type: 'line',
  //     toolbar: {
  //       show: false
  //     },
  //     zoom: {
  //       enabled: false
  //     }
  //   },
  //   dataLabels: {
  //     enabled: true,
  //     formatter: (value, { seriesIndex, dataPointIndex, w }) => {
  //       if (seriesIndex == 1) {
  //         return MOOD[value as MoodIndex]
  //       }
  //       return `${value}`;
  //     }
  //   },
  //   tooltip: {
  //     y: [{
  //       formatter: undefined,
  //     }, {
  //       formatter: (val): string => {

  //         return MOOD[val as MoodIndex]
  //       }
  //     }],
  //   },
  //   series: [
  //     {
  //       name: 'Count',
  //       data: countData
  //     },
  //     {
  //       name: 'Mood',
  //       data: moodData
  //     },
  //   ],
  //   xaxis: {
  //     categories: categories
  //   },
  //   yaxis: [
  //     {
  //       title: {
  //         text: "Count"
  //       },
  //     },
  //     {
  //       opposite: true,
  //       title: {
  //         text: "Mood"
  //       },
  //       min: 1,
  //       max: 3,
  //       tickAmount: 2
  //     }
  //   ],
  // };


  // const pieChartOptions: ApexOptions = {
  //   series: pieSeries,
  //   chart: {
  //     type: 'donut',
  //   },
  //   labels: Object.values(MOOD),
  //   responsive: [{
  //     breakpoint: 480,
  //     options: {
  //       chart: {
  //         width: 200
  //       },
  //       legend: {
  //         position: 'bottom'
  //       }
  //     }
  //   }]
  // };


  const onHandleClickPreviousMonth = (): void => {
    const previousMonth = moment(crtDate).subtract(1, 'months').endOf('month').toDate()
    if (checkIsSameMonth(previousMonth, moment().toDate())) {
      setCrtDate(moment().toDate())
    } else {
      setCrtDate(previousMonth)
    }
  }

  const onHandleClickNextMonth = (): void => {
    const nextMonth = moment(crtDate).add(1, 'months').endOf('month').toDate()
    if (checkIsSameMonth(nextMonth, moment().toDate())) {
      setCrtDate(moment().toDate())
    } else {
      setCrtDate(nextMonth)
    }
  }

  const onHandleClickToday = (): void => {
    setCrtDate(moment().toDate())
  }

  const onHandleClickDaily = (date: Date): void => {
    if (selectedDate && checkIsSameDay(selectedDate, date)) {
      setSelectedDate(null)
    } else {
      setSelectedDate(date)
    }
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
          selectedDate={selectedDate}
          handleClickPreviousMonth={onHandleClickPreviousMonth}
          handleClickNextMonth={onHandleClickNextMonth}
          handleClickToday={onHandleClickToday}
          handleClickDaily={onHandleClickDaily}
        />
      </div>


      {/* 综合当月count的图 */}
      <div id="column-chart" className='w-full'>
        {monthlyRecords.length > 0 ?
          <ReactApexChart
            options={monthlyColumnChartOptions}
            series={monthlyColumnChartOptions.series}
            type="bar"
            height={CHART_HEIGHT}
            width={'100%'}
          /> : <Empty />}

      </div>


      {/* 默认隐藏线形图和饼图，当点击某天时再展示 */}
      {dailyRecords && selectedDate ?
        <>
          <div className="relative" >
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">Daily Records</span>
            </div>
          </div>

          {dailyRecords.length > 0 ?
            <div className='flex w-full'>
              <div id="line-chart" className='w-6/12'>
                <ReactApexChart
                  options={dailyColumnChartOptions}
                  series={dailyColumnChartOptions.series}
                  type="bar"
                  height={CHART_HEIGHT}
                  width={'100%'}
                />
              </div>

              <div id="pie-chart" className='w-6/12 mt-4'>
                {/* <ReactApexChart
            options={pieChartOptions}
            series={pieChartOptions.series}
            type="donut"
            height={CHART_HEIGHT}
            width={'100%'}
          /> */}
              </div>
            </div> : <Empty />}
        </>
        : null}


    </Container >
  )
}

export default RecordList;

