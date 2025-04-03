import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  TimeScale,
  ChartData,
  Point,
  CoreChartOptions,
  DatasetChartOptions,
  ElementChartOptions,
  LineControllerChartOptions,
  PluginChartOptions,
  ScaleChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { ru } from "date-fns/locale";
import { parseISO, format, startOfDay, isSameDay } from "date-fns";
import { useRatingsHistoryGraphController } from "../../controllers/widgets/RatingsHistoryGraph/useRatingsHistoryGraphController";
import { _DeepPartialObject } from "chart.js/dist/types/utils";
import variables from "../../styles/variables.module.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  TimeScale
);

const RatingsHistoryGraphComponent = () => {
  const { graphData: data, isStatsLoading } =
    useRatingsHistoryGraphController();

  const [chartData, setChartData] =
    useState<ChartData<"line", (number | Point | null)[], unknown>>();

  const [options, setOptions] =
    useState<
      _DeepPartialObject<
        CoreChartOptions<"line"> &
          ElementChartOptions<"line"> &
          PluginChartOptions<"line"> &
          DatasetChartOptions<"line"> &
          ScaleChartOptions<"line"> &
          LineControllerChartOptions
      >
    >();

  useEffect(() => {
    if (data) {
      // Группируем данные по дням
      const groupedData = data.reduce<
        Record<string, { rating: number; games: number }>
      >((acc, item, index) => {
        const dateKey = format(
          startOfDay(parseISO(item.createdAt)),
          "yyyy-MM-dd"
        );
        if (!acc[dateKey]) {
          acc[dateKey] = { rating: item.rating, games: index === 0 ? 0 : 1 };
        } else {
          acc[dateKey].rating += item.ratingDelta;
          if (index !== 0) acc[dateKey].games += 1;
        }
        return acc;
      }, {});

      // Преобразуем в массив для графика
      const labels = Object.keys(groupedData)
        .sort()
        .map((date) => new Date(date));
      const ratings = labels.map(
        (date) => groupedData[format(date, "yyyy-MM-dd")].rating
      );
      const gamesCount = labels.map(
        (date) => groupedData[format(date, "yyyy-MM-dd")].games
      );

      // Добавляем текущую дату, если её нет
      const today = startOfDay(new Date());
      const lastRating = ratings[ratings.length - 1] || 0;
      if (!labels.some((date) => isSameDay(date, today))) {
        labels.push(today);
        ratings.push(lastRating);
        gamesCount.push(0);
      }

      setChartData({
        labels,
        datasets: [
          {
            label: "Рейтинг",
            data: ratings,
            borderColor: variables.colorSuccess || "#4DB6AC",
            backgroundColor: "rgba(77, 182, 172, 0.2)",
            fill: false,
          },
        ],
      });

      setOptions({
        responsive: true,
        animation: {
          duration: 1000,
          easing: "easeInOutQuart",
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const index = context.dataIndex;
                return `Рейтинг: ${ratings[index]}, Количество игр: ${gamesCount[index]}`;
              },
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            type: "time" as const,
            time: {
              tooltipFormat: "dd.MM.yyyy",
              displayFormats: {
                day: "dd.MM.yyyy",
                week: "dd.MM.yyyy",
                month: "dd.MM.yyyy",
                year: "dd.MM.yyyy",
              },
            },
            adapters: {
              date: {
                locale: ru,
              },
            },
            ticks: {
              autoSkip: true,
              maxRotation: 0,
              minRotation: 0,
              callback: (value) => {
                return format(new Date(value as number), "dd.MM.yyyy");
              },
              color: variables.colorPrimary,
            },
          },
          y: {
            beginAtZero: false,
            ticks: {
              color: variables.colorPrimary,
            },
          },
        },
      });
    }
  }, [data]);

  return isStatsLoading ? (
    <div>Загрузка...</div>
  ) : chartData ? (
    <Line data={chartData} options={options} />
  ) : (
    <div>Нет данных для графика</div>
  );
};

export const RatingsHistoryGraph = React.memo(RatingsHistoryGraphComponent);
