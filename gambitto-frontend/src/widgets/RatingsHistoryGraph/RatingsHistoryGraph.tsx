import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { ru } from "date-fns/locale";
import { useRatingsHistoryGraphController } from "../../controllers/widgets/RatingsHistoryGraph/useRatingsHistoryGraphController";

interface ChartDataPoint {
  x: Date;
  y: number;
  ratingDelta: number;
}

const RatingsHistoryGraphComponent = () => {
  const { graphData } = useRatingsHistoryGraphController();

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<"line", ChartDataPoint[], unknown> | null>(
    null
  );

  useEffect(() => {
    if (chartRef.current && graphData && graphData.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (!ctx) return;

      const chartData = {
        datasets: [
          {
            label: "Рейтинг",
            data: graphData.map((item) => ({
              x: new Date(item.createdAt),
              y: item.rating,
              ratingDelta: item.ratingDelta,
            })),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            tension: 0.1,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      };

      chartInstance.current = new Chart<"line", ChartDataPoint[], unknown>(
        ctx,
        {
          type: "line",
          data: chartData,
          options: {
            responsive: true,
            scales: {
              x: {
                type: "time",
                time: {
                  tooltipFormat: "PPPppp",
                  displayFormats: {
                    hour: "HH:mm",
                    day: "dd MMM",
                    week: "dd MMM",
                    month: "MMM yyyy",
                  },
                },
                adapters: {
                  date: {
                    locale: ru,
                  },
                },
                title: {
                  display: true,
                  text: "Дата и время",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Рейтинг",
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const dataItem = context.raw as ChartDataPoint;
                    const date = dataItem.x.toLocaleString("ru-RU");
                    return [
                      `Рейтинг: ${dataItem.y}`,
                      `Изменение: ${dataItem.ratingDelta}`,
                      `Дата: ${date}`,
                    ];
                  },
                },
              },
            },
          },
        }
      );
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [graphData]);

  return <canvas ref={chartRef} />;
};

export const RatingsHistoryGraph = React.memo(RatingsHistoryGraphComponent);
