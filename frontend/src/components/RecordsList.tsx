
'use client'
import dynamic from 'next/dynamic';
import moment from 'moment'
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from 'react';

import RecordCalendar, { DataType } from './RecordCalendar';
import { Container } from '@/components/Container'
import Empty from './EmptyChart';
import { checkIsSameDay } from '@/lib/utils';
import { MoodType } from '../../types';
import request from '@/lib/fetchData';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const CHART_HEIGHT = 450;

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
        const response = await request(true, '/api/record/daily', {
          method: 'POST',
          body: JSON.stringify({ date: selectedDate })
        });
        setDailyRecords(response.data.map((item: DataType) => {
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
      const response = await request(true, '/api/record/monthly', {
        method: 'POST',
        body: JSON.stringify({ date: crtDate })
      });
      setMonthlyRecords(response.data.map((item: DataType) => {
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
    title: {
      text: 'Daily Records & Scores',
      align: 'left'
    },
    series: [{
      name: 'Curls',
      type: 'column',
      data: dailyRecords?.map((item) => item.curls_count) ?? []
    }, {
      name: 'Squats',
      type: 'column',
      data: dailyRecords?.map((item) => item.squats_count) ?? []
    }, {
      name: 'Bridges',
      type: 'column',
      data: dailyRecords?.map((item) => item.bridges_count) ?? []
    }, {
      name: 'Score',
      type: 'line',
      data: dailyRecords?.map((item) => item.score) ?? []
    }
    ],
    chart: {
      type: 'line',
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
      enabled: true,
      enabledOnSeries: [3]
    },
    stroke: {
      show: true,
      width: 2,
    },
    xaxis: {
      categories: dailyRecords?.map((item) => moment(item.create_time).format('LT')),
    },
    yaxis: [{
      title: {
        text: 'Count',
      },
    }, {
      opposite: true,
      title: {
        text: 'Score'
      },
      max: 100,
      min: 0
    }],
    fill: {
      opacity: 1
    },
  }

  const dailyMoodLineChartOptions: ApexOptions = {
    title: {
      text: 'Daily Mood',
      align: 'left'
    },
    series: [{
      name: 'Mood',
      data: dailyRecords?.map((item) => Object.keys(MoodType).indexOf(item.mood)) ?? []
    }],
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (value) => {
        return Object.values(MoodType)[value as number];
      }
    },
    tooltip: {
      y: {
        formatter: (val): string => {
          return Object.values(MoodType)[val as number]
        }
      },
    },
    colors: ['#d589f6'],
    stroke: {
      show: true,
      width: 2,
    },
    xaxis: {
      categories: dailyRecords?.map((item) => moment(item.create_time).format('LT')),
    },
    yaxis: {
      show: false
    }
  }



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
              <span className="bg-white px-2 text-sm text-gray-500">{moment(selectedDate).format('MM-DD')} - Daily Records</span>
            </div>
          </div>

          {dailyRecords.length > 0 ?
            <div className='flex w-full'>
              <div id="line-chart" className='w-8/12'>
                <ReactApexChart
                  options={dailyColumnChartOptions}
                  series={dailyColumnChartOptions.series}
                  type="line"
                  height={CHART_HEIGHT}
                  width={'100%'}
                />
              </div>

              <div id="pie-chart" className='w-4/12 mt-4'>
                <ReactApexChart
                  options={dailyMoodLineChartOptions}
                  series={dailyMoodLineChartOptions.series}
                  type="line"
                  height={CHART_HEIGHT}
                  width={'100%'}
                />
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

