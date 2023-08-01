import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const plugins = [
    {
      afterDraw: function (chart) {
        if (chart.data.datasets[0].data.reduce((a,c)=> a += c,  0) < 1) {
          let ctx = chart.ctx;
          let width = chart.width;
          let height = chart.height;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "30px Arial";
          ctx.fillText("No data to display", width / 2, height / 2);
          ctx.restore();
        }
      },
    },
  ];

export function PieChart({sdata}) {
    const data = {
        labels: ['Todo', 'In Progress', 'Pause', 'Done', 'Deadline Missed',],
        datasets: [
          {
            label: 'Total',
            // data: [12, 19, 3, 5, 2,],
            data: sdata,
            backgroundColor: [
              '#5F97EB',
              '#D9DB6D',
              '#D56868',
              '#37BB1A',
              'red',
              // 'gray',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              // 'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 2,
          },
        ],
      };
  return <Pie data={data} plugins={plugins} />;
}
