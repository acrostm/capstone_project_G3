
import { Container } from '@/components/Container'

import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const MOOD = {
  1: '😞',
  2: '😡',
  3: '🤩',
}

const CHART_HEIGHT = 450;

enum MoodIndex {
  Happy = 1,
  Angry,
  Sad
}
interface Record {
  // dateTime: Date,
  dateTime: string;
  count: number,
  mood: MoodIndex
}
export function RecordList() {
  // const records = await getAllRecords()
  const records: Record[] = [{
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

  const moodData = records.map((record) => record.mood)

  const countData = records.map((record) => record.count)

  const categories = records.map((record) => record.dateTime)

  const pieSeries = new Array(3).fill(0)
  records.map((record) => {
    pieSeries[record.mood - 1]++;
  })

  const generateData = (count, yrange) => {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }

  const heatmapChartOptions: ApexOptions = {
    // series: [{
    //   name: 'Metric1',
    //   data: generateData(18, {
    //     min: 0,
    //     max: 90
    //   })
    // },
    // {
    //   name: 'Metric2',
    //   data: generateData(18, {
    //     min: 0,
    //     max: 90
    //   })
    // },
    // {
    //   name: 'Metric3',
    //   data: generateData(18, {
    //     min: 0,
    //     max: 90
    //   })
    // },
    // {
    //   name: 'Metric4',
    //   data: generateData(18, {
    //     min: 0,
    //     max: 90
    //   })
    // },
    // {
    //   name: 'Metric5',
    //   data: generateData(18, {
    //     min: 0,
    //     max: 90
    //   })
    // },
    // {
    //   name: 'Metric6',
    //   data: generateData(18, {
    //     min: 0,
    //     max: 90
    //   })
    // },
    // {
    //   name: 'Metric7',
    //   data: generateData(18, {
    //     min: 0,
    //     max: 90
    //   })
    // },
    // {
    //   name: 'Metric8',
    //   data: generateData(18, {
    //     min: 0,
    //     max: 90
    //   })
    // },
    // {
    //   name: 'Metric9',
    //   data: generateData(18, {
    //     min: 0,
    //     max: 90
    //   })
    // }
    // ],
    chart: {
      height: 350,
      type: 'heatmap',
    },
    dataLabels: {
      enabled: false
    },
    colors: ["#008FFB"],
    title: {
      text: 'HeatMap Chart (Single color)'
    },
    series: [{
      name: 'Metric1',
      data: generateData(20, {
        min: 0,
        max: 90
      })
    },
    {
      name: 'Metric2',
      data: generateData(20, {
        min: 0,
        max: 90
      })
    },
    {
      name: 'Metric3',
      data: generateData(20, {
        min: 0,
        max: 90
      })
    },
    {
      name: 'Metric4',
      data: generateData(20, {
        min: 0,
        max: 90
      })
    },
    {
      name: 'Metric5',
      data: generateData(20, {
        min: 0,
        max: 90
      })
    },
    {
      name: 'Metric6',
      data: generateData(20, {
        min: 0,
        max: 90
      })
    },
    {
      name: 'Metric7',
      data: generateData(20, {
        min: 0,
        max: 90
      })
    },
    {
      name: 'Metric8',
      data: generateData(20, {
        min: 0,
        max: 90
      })
    },
    {
      name: 'Metric8',
      data: generateData(20, {
        min: 0,
        max: 90
      })
    }
    ],
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


  return (
    <Container className='w-full'>
      <div id="heatmap-chart">
        <ReactApexChart
          options={heatmapChartOptions}
          series={heatmapChartOptions.series}
          type="heatmap" height={CHART_HEIGHT} />
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

        <div id="pie-chart" className='w-6/12'>
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
