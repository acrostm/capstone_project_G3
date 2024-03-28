import React, { useEffect } from 'react';
import moment from 'moment';

import { Color, MoodKeyType } from '../../types';
import bicepIcon from '@/images/icons/bicep.png'
import squatsIcon from '@/images/icons/squats.png'
import bridgingIcon from '@/images/icons/bridging.png'
import { Icon } from './Icon';
import { StaticImageData } from 'next/image';
import { checkIsSameDay } from '@/lib/utils';

interface FormatData {
  day: number;
  date?: Date | null;
  curls: {
    count: number;
    bgColor: Color;
  },
  squats: {
    count: number;
    bgColor: Color;
  },
  bridges: {
    count: number;
    bgColor: Color;
  }
}


export interface DataType {
  create_time: Date;
  curls_count: number;
  squats_count: number;
  bridges_count: number;
  score: number;
  mood: MoodKeyType;
}
type CountType = keyof Omit<DataType, 'create_time' | 'score' | 'mood'>
type FormatCountType = keyof Omit<FormatData, 'date' | 'day'>


interface RecordCalendarProps {
  crtDate: Date;
  data: DataType[];
  selectedDate: Date | null;
  minColors?: [Color, Color, Color]
  maxColors?: [Color, Color, Color]
  handleClickPreviousMonth: () => void;
  handleClickNextMonth: () => void;
  handleClickToday: () => void;
  handleClickDaily: (date: Date) => void;
}


const RecordCalendar = ({
  crtDate,
  data,
  selectedDate,
  minColors = ['#87CEFA', '#90EE90', '#FFFACD'],
  maxColors = ['#003153', '#006600', '#FFEF00'],
  handleClickNextMonth,
  handleClickPreviousMonth,
  handleClickToday,
  handleClickDaily
}: RecordCalendarProps) => {

  const monthStr = crtDate.toLocaleString('default', { month: 'long' })
  const month = crtDate.getMonth() + 1
  const year = crtDate.getFullYear()
  const date = crtDate.getDate()

  let firstDate = moment().toDate();
  firstDate.setFullYear(year, month - 1, 1)
  const weekDay = firstDate.getDay()

  const getDays = (year: number, month: number) => {
    let d = new Date(year, month, 0);
    return d.getDate();
  }
  const days = getDays(year, month);

  const weekOfMonth = (date: Date) => {
    const firstDayOfMonth = moment(date).clone().startOf('month');
    const firstDayOfWeek = firstDayOfMonth.clone().startOf('week');

    const offset = firstDayOfMonth.diff(firstDayOfWeek, 'days');

    return Math.ceil((moment(date).date() + offset) / 7);
  }

  const weeks = weekOfMonth(crtDate)


  const getMinAndMax = (list: DataType[], type: CountType): [number, number] => {
    let min = Infinity, max = -Infinity
    list.filter(item => item[type] > 0).forEach(item => {
      const count = item[type]
      if (count < min) min = count;
      if (count > max) max = count;
    })
    return [min, max]
  }

  const calculateColor = (minColor: Color, maxColor: Color, value: number, minValue: number, maxValue: number): Color => {
    if (value === minValue) {
      return minColor
    }
    if (value === maxValue) {
      return maxColor
    }
    // 解析 RGB 颜色值
    const colorReg = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

    const minMatch = minColor.match(colorReg);
    const maxMatch = maxColor.match(colorReg);
    if (!minMatch) {
      throw new Error('Invalid color format');
    }
    if (!maxMatch) {
      throw new Error('Invalid color format');
    }

    // 根据比例调整 RGB 值
    const minRed = parseInt(minMatch[1], 16);
    const minGreen = parseInt(minMatch[2], 16);
    const minBlue = parseInt(minMatch[3], 16);

    const maxRed = parseInt(maxMatch[1], 16);
    const maxGreen = parseInt(maxMatch[2], 16);
    const maxBlue = parseInt(maxMatch[3], 16);

    // 计算数值在最大值和最小值之间的比例
    const ratio = (value - minValue) / (maxValue - minValue);

    // 根据比例调整 RGB 值

    const newRed = Math.round(ratio * minRed + (1 - ratio) * maxRed);
    const newGreen = Math.round(ratio * minGreen + (1 - ratio) * maxGreen);
    const newBlue = Math.round(ratio * minBlue + (1 - ratio) * maxBlue);

    // 将 RGB 值转换为十六进制格式
    const newColor = `#${newRed.toString(16).padStart(2, '0')}${newGreen.toString(16).padStart(2, '0')}${newBlue.toString(16).padStart(2, '0')}`;

    return newColor;
  }

  const getFormatDates = (): FormatData[] => {
    const [curlsMin, curlsMax] = getMinAndMax(data, 'curls_count')
    const [squatsMin, squatsMax] = getMinAndMax(data, 'squats_count')
    const [bridgesMin, bridgesMax] = getMinAndMax(data, 'bridges_count')

    const datesHadCount = data.map((item) => item.create_time.getDate())
    let formatDates = new Array(days);
    for (let day = 1; day <= days; day++) {
      const item: FormatData = {
        date: null,
        day,
        curls: {
          count: 0,
          bgColor: '#ebedf0'
        },
        squats: {
          count: 0,
          bgColor: '#ebedf0'
        },
        bridges: {
          count: 0,
          bgColor: '#ebedf0'
        }
      }
      const crtIndex = datesHadCount.indexOf(day)
      if (crtIndex != -1) {
        const curls_count = data[crtIndex].curls_count
        const squats_count = data[crtIndex].squats_count
        const bridges_count = data[crtIndex].bridges_count
        item.date = data[crtIndex].create_time
        item.curls = {
          count: curls_count,
          bgColor: calculateColor(minColors[0], maxColors[0], curls_count, curlsMin, curlsMax)
        }
        item.squats = {
          count: squats_count,
          bgColor: calculateColor(minColors[1], maxColors[1], squats_count, squatsMin, squatsMax)

        }
        item.bridges = {
          count: bridges_count,
          bgColor: calculateColor(minColors[2], maxColors[2], bridges_count, bridgesMin, bridgesMax)
        }

      }
      formatDates[day - 1] = item
    }
    return formatDates
  }



  const formatDates = getFormatDates();

  const today = moment().toDate();

  const items: {
    icon: StaticImageData,
    key: FormatCountType
  }[] = [{ icon: bicepIcon, key: 'curls' }, { icon: squatsIcon, key: 'squats' }, { icon: bridgingIcon, key: 'bridges' }]



  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          <time>{monthStr} {year}</time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button type="button"
              onClick={handleClickPreviousMonth}
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50">
              <span className="sr-only" >Previous month</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>
            <button onClick={handleClickToday} type="button" className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block">Today</button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden"></span>
            <button
              onClick={handleClickNextMonth}
              type="button" className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50">
              <span className="sr-only" >Next month</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          <div className="flex justify-center bg-white py-2">
            <span>S</span>
            <span className="sr-only sm:not-sr-only">un</span>
          </div>
          <div className="flex justify-center bg-white py-2">
            <span>M</span>
            <span className="sr-only sm:not-sr-only">on</span>
          </div>
          <div className="flex justify-center bg-white py-2">
            <span>T</span>
            <span className="sr-only sm:not-sr-only">ue</span>
          </div>
          <div className="flex justify-center bg-white py-2">
            <span>W</span>
            <span className="sr-only sm:not-sr-only">ed</span>
          </div>
          <div className="flex justify-center bg-white py-2">
            <span>T</span>
            <span className="sr-only sm:not-sr-only">hu</span>
          </div>
          <div className="flex justify-center bg-white py-2">
            <span>F</span>
            <span className="sr-only sm:not-sr-only">ri</span>
          </div>
          <div className="flex justify-center bg-white py-2">
            <span>S</span>
            <span className="sr-only sm:not-sr-only">at</span>
          </div>

        </div>

        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          <div className={`hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-${weeks} lg:gap-px`}>
            {/* 根据 crtDate 渲染当月日历 */}
            {(new Array(weekDay).fill(0)).map((crt, i) => <div key={`last-week-${i}`} className="relative bg-gray-50 px-3 py-2 text-gray-500">
            </div>)}

            {formatDates.map((crt, i) => {

              const hasExercise = crt.curls.count > 0 || crt.squats.count > 0 || crt.bridges.count;
              const isToday = crtDate.getFullYear() === today.getFullYear() && crtDate.getMonth() === today.getMonth() && (i + 1) == date
              const isSelectedDay = crt.date && checkIsSameDay(crt.date, selectedDate)
             
              return <div
                onClick={() => {
                  crt.date && handleClickDaily(crt.date)
                }}
                key={`crt-month-date-${crt.day}`}
                className={`relative px-3 py-2  ${hasExercise ? 'hover:bg-sky-100 hover:cursor-pointer' : 'hover:bg-gray-100'} ${isSelectedDay ? 'bg-sky-100' : 'bg-white'}`
                }
              >
                {hasExercise ? <div className='absolute top-1 right-1'>
                  {items.map((item, i) => crt[item.key].count > 0 ? <Icon className='inline-block p-0.5 m-0.5 rounded' key={i} imgSrc={item.icon} width={24} height={24}
                    styleObject={{ backgroundColor: crt[item.key].bgColor }}
                  /> : null)}
                </div> : null}

                <time dateTime={`${year}-${month}-${i + 1}`} className={isToday ? "flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white" : ""}>{crt.day}</time>
              </div>
            })}

          </div>

          <div className={`isolate grid w-full grid-cols-7 grid-rows-${weeks} gap-px lg:hidden`}>
            {/* 根据 now 渲染当月日历 */}
            {(new Array(weekDay).fill(0)).map((crt, i) =>
              <button key={`last-week-${i}`} type="button" className="flex h-14 flex-col bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100 focus:z-10">
              </button>
            )}

            {formatDates.map((crt, i) => {
              const hasExercise = crt.curls.count > 0 || crt.squats.count > 0 || crt.bridges.count;
              const isToday = crtDate.getFullYear() === today.getFullYear() && crtDate.getMonth() === today.getMonth() && (i + 1) == date
              const isSelectedDay = crt.date && checkIsSameDay(crt.date, selectedDate)
              return <button
                key={`crt-month-date-${crt.day}`}
                type="button"
                className={`relative flex h-14 flex-col  px-3 py-2 text-gray-900 hover: cursor-auto ${hasExercise ? 'hover:bg-sky-100 hover:cursor-pointer' : 'hover:bg-gray-100'} focus:z-10 ${isSelectedDay ? 'bg-sky-100' : 'bg-white'}`}
                onClick={() => {
                  crt.date && handleClickDaily(crt.date)
                }}
              >
                {hasExercise ? <div className='absolute top-1 right-1'>
                  {items.map((item, i) => crt[item.key].count > 0 ? <span key={i} className="inline-block w-1 h-1 m-0.5 rounded-full" style={{
                    backgroundColor: crt[item.key].bgColor
                  }} /> : null
                  )}
                </div> : null}
                <time dateTime={`${year}-${month}-${i + 1}`} className={isToday ? "flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white" : ""}>{crt.day}</time>
              </button>
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


export default RecordCalendar;