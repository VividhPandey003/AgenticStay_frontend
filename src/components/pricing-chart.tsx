"use client";

import { useEffect, useState, useRef } from "react";
import type { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion"; // Added for smooth chart animations

interface PricingChartProps {
  roomType: string;
  dateRange: DateRange | undefined;
}

export function PricingChart({ roomType, dateRange }: PricingChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 100]); // Default domain
  const failedRequests = useRef(new Set()); // Cache failed requests to prevent retries

  useEffect(() => {
    let isMounted = true; // Prevent updating state after unmount
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchPricingData() {
      if (!dateRange?.from || !dateRange?.to) return;

      const startDate = new Date(dateRange.from);
      const endDate = new Date(dateRange.to);
      let fetchedData: any[] = [];

      let minValue = Number.MAX_VALUE;
      let maxValue = Number.MIN_VALUE;

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const formattedDate = format(d, "yyyy-MM-dd");
        const cacheKey = `${formattedDate}-${roomType}`;

        // Skip API call if we've already seen a 404 for this (date, roomType)
        if (failedRequests.current.has(cacheKey)) {
          console.warn(`Skipping already failed request for ${cacheKey}`);
          continue;
        }

        try {
          const response = await fetch(
            `http://127.0.0.1:5000/get_prediction?date=${formattedDate}&room_type=${roomType}`,
            { signal }
          );

          if (!response.ok) {
            if (response.status === 404) {
              console.warn(`No data found for ${formattedDate}, marking as failed.`);
              failedRequests.current.add(cacheKey); // Add to failed cache
              continue;
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          const currentPrice = data.current_price;
          const predictedPrice = data.optimized_price;

          minValue = Math.min(minValue, currentPrice, predictedPrice);
          maxValue = Math.max(maxValue, currentPrice, predictedPrice);

          fetchedData.push({
            date: format(new Date(data.date), "MMM dd"),
            CurrentPrice: currentPrice,
            PredictedPrice: predictedPrice,
          });
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error(`Error fetching pricing data for ${formattedDate}:`, error);
          }
        }
      }

      if (isMounted) {
        if (fetchedData.length > 0) {
          setYAxisDomain([Math.floor(minValue * 0.9), Math.ceil(maxValue * 1.1)]);
          setChartData(fetchedData);
        }
      }
    }

    fetchPricingData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [dateRange?.from, dateRange?.to, roomType]); // Only re-run when necessary

  if (chartData.length === 0) {
    return <div className="text-center py-4 text-gray-700 font-medium">📊 Loading pricing data...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[450px] bg-white shadow-md border border-gray-300 rounded-md p-4"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing Overview</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          {/* Grid with subtle lines */}
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />

          {/* X & Y Axes */}
          <XAxis dataKey="date" stroke="#374151" tick={{ fontSize: 12, fill: "#4B5563" }} />
          <YAxis
            domain={yAxisDomain}
            stroke="#374151"
            tick={{ fontSize: 12, fill: "#4B5563" }}
          />

          {/* Tooltip & Legend */}
          <Tooltip
            contentStyle={{ backgroundColor: "white", borderRadius: "8px", padding: "10px" }}
            labelStyle={{ fontWeight: "bold", color: "#374151" }}
            formatter={(value) => [`₹${value}`, "Price"]}
          />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "14px", fontWeight: "500" }} />

          {/* Bars with Improved Size and Animation */}
          <Bar
            dataKey="CurrentPrice"
            fill="#E53935"
            radius={[6, 6, 0, 0]}
            barSize={60}
            animationBegin={300}
            animationDuration={800}
          />
          <Bar
            dataKey="PredictedPrice"
            fill="#4F5963"
            radius={[6, 6, 0, 0]}
            barSize={60}
            animationBegin={400}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
