"use client";

import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { addDays, format, isSameDay } from "date-fns";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getMockPredictedPrice, mockHolidays } from "@/components/data/mock-pricing";

interface PricingChartProps {
  roomType: string;
  dateRange: DateRange | undefined;
}

// Mock data for room pricing
const roomPricing = {
  standard: { basePrice: 120, weekend: 150, holiday: 180 },
  deluxe: { basePrice: 180, weekend: 220, holiday: 260 },
  suite: { basePrice: 250, weekend: 300, holiday: 350 },
  presidential: { basePrice: 450, weekend: 550, holiday: 650 },
};

export function PricingChart({ roomType, dateRange }: PricingChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (!dateRange?.from) return;

    const dates = [];
    let currentDate = dateRange.from;
    while (currentDate <= (dateRange.to || dateRange.from)) {
      dates.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }

    const getPriceForDate = (date: Date, type: string) => {
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isHoliday = mockHolidays.some((holiday) => isSameDay(holiday, date));
      if (!roomPricing[type as keyof typeof roomPricing]) return 0;
      return isHoliday
        ? roomPricing[type as keyof typeof roomPricing].holiday
        : isWeekend
        ? roomPricing[type as keyof typeof roomPricing].weekend
        : roomPricing[type as keyof typeof roomPricing].basePrice;
    };

    const data = dates.map((date) => ({
      date: format(date, "MMM dd"),
      CurrentPrice: getPriceForDate(date, roomType),
      PredictedPrice: getMockPredictedPrice(date, roomType),
    }));

    setChartData(data);
  }, [dateRange, roomType]);

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="CurrentPrice" fill="#4f46e5" />
          <Bar dataKey="PredictedPrice" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
