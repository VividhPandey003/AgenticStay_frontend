"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { SabreNavbar } from "./Navbar";
import { motion } from "framer-motion";

// Default data for fallback in case of API failure
const defaultDashboardData = {
  total_revenue: 500000,
  predicted_revenue: 575000,
  additional_revenue: 75000,

  revenue_comparison: [
    { month: "Jan", actualRevenue: 45000, predictedRevenue: 52000 },
    { month: "Feb", actualRevenue: 42000, predictedRevenue: 51000 },
    { month: "Mar", actualRevenue: 46000, predictedRevenue: 53000 },
    { month: "Apr", actualRevenue: 47000, predictedRevenue: 54000 },
    { month: "May", actualRevenue: 49000, predictedRevenue: 55000 },
  ],

  occupancy_trends: [
    { month: "Jan", occupancyRate: 78 },
    { month: "Feb", occupancyRate: 81 },
    { month: "Mar", occupancyRate: 85 },
    { month: "Apr", occupancyRate: 79 },
    { month: "May", occupancyRate: 83 },
  ],

  seasonal_demand: [
    { season: "Winter", demand: 30 },
    { season: "Spring", demand: 50 },
    { season: "Summer", demand: 90 },
    { season: "Autumn", demand: 60 },
  ],

  competitor_vs_my_hotel: [
    { month: "Jan", myHotel: 17000, marketAvg: 17250 },
    { month: "Feb", myHotel: 16800, marketAvg: 17050 },
    { month: "Mar", myHotel: 17200, marketAvg: 17300 },
    { month: "Apr", myHotel: 17500, marketAvg: 17800 },
    { month: "May", myHotel: 17400, marketAvg: 17650 },
  ],

  cancellation_trends: [
    { month: "Jan", cancellations: 12, noShows: 5 },
    { month: "Feb", cancellations: 15, noShows: 7 },
    { month: "Mar", cancellations: 10, noShows: 4 },
    { month: "Apr", cancellations: 13, noShows: 6 },
    { month: "May", cancellations: 9, noShows: 3 },
  ],

  avg_daily_rate: 17000,
  competitor_avg_price: 17250,

  revpar_trends: [
    { month: "Jan", revpar: 13500 },
    { month: "Feb", revpar: 14000 },
    { month: "Mar", revpar: 14500 },
    { month: "Apr", revpar: 13800 },
    { month: "May", revpar: 14200 },
  ],
};


export function Dashboard() {
  const [dashboardData, setDashboardData] = useState(defaultDashboardData);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("http://127.0.0.1:5000/get_dashboard_data");
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data. Using default values.", error);
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <div>
      <SabreNavbar />
      <div className="container mx-auto py-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">📊 Hotel Insights Dashboard</h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Revenue Comparison */}
          <div className="md:col-span-2">
            <Card className="shadow-lg border-gray-300">
              <CardHeader className="bg-gray-100 border-b">
                <CardTitle>Revenue Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.revenue_comparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#374151" />
                    <YAxis stroke="#374151" />
                    <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                    <Legend />
                    <Bar dataKey="actualRevenue" fill="#E53935" name="Actual Revenue" />
                    <Bar dataKey="predictedRevenue" fill="#4B5563" name="Predicted Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </div>

          {/* Additional Revenue */}
          <Card className="shadow-lg border-gray-300 md:col-span-2">
            <CardHeader className="bg-gray-100 border-b">
              <CardTitle>Revenue Impact from Predicted Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-center text-green-600">
                ₹{dashboardData.additional_revenue.toLocaleString()} additional revenue generated
              </div>
            </CardContent>
          </Card>

          {/* Occupancy Trends */}
          <Card className="shadow-lg border-gray-300">
            <CardHeader className="bg-gray-100 border-b">
              <CardTitle>Occupancy Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.occupancy_trends}>
                  <XAxis dataKey="month" stroke="#374151" />
                  <YAxis stroke="#374151" />
                  <Tooltip formatter={(value) => [`${value}%`, "Occupancy Rate"]} />
                  <Legend />
                  <Line type="monotone" dataKey="occupancyRate" stroke="#4f46e5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-300">
            <CardHeader className="bg-gray-100 border-b">
              <CardTitle>Similar Hotels vs. My Hotel Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.competitor_vs_my_hotel}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#374151" />
                  <YAxis stroke="#374151" />
                  <Tooltip formatter={(value) => [`₹${value}`, "Price"]} />
                  <Legend />
                  <Line type="monotone" dataKey="myHotel" stroke="#E53935" name="My Hotel Price" />
                  <Line type="monotone" dataKey="marketAvg" stroke="#4B5563" name="Market Avg Price" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-300">
            <CardHeader className="bg-gray-100 border-b">
              <CardTitle>Cancellations & No-Shows</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.cancellation_trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#374151" />
                  <YAxis stroke="#374151" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cancellations" fill="#E53935" name="Cancellations" />
                  <Bar dataKey="noShows" fill="#4B5563" name="No-Shows" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Seasonal Demand */}
          <Card className="shadow-lg border-gray-300">
            <CardHeader className="bg-gray-100 border-b">
              <CardTitle>Seasonal Demand</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.seasonal_demand}
                    dataKey="demand"
                    nameKey="season"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#4f46e5"
                    label
                  >
                    {dashboardData.seasonal_demand.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#E53935", "#4B5563", "#22c55e", "#f59e0b"][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-300">
            <CardHeader className="bg-gray-100 border-b">
              <CardTitle>ADR: My Hotel vs Market</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={[
                    { category: "My Hotel", price: dashboardData.avg_daily_rate },
                    { category: "Market Avg", price: dashboardData.competitor_avg_price },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" stroke="#374151" />
                  <YAxis stroke="#374151" />
                  <Tooltip formatter={(value) => [`₹${value}`, "ADR"]} />
                  <Bar dataKey="price" fill="#4F5963" barSize={80} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-gray-300">
            <CardHeader className="bg-gray-100 border-b">
              <CardTitle>RevPAR Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.revpar_trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#374151" />
                  <YAxis stroke="#374151" />
                  <Tooltip formatter={(value) => [`₹${value}`, "RevPAR"]} />
                  <Legend />
                  <Line type="monotone" dataKey="revpar" stroke="#E53935" name="RevPAR" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Breakdown */}
          <div className="md:col-span-2">
            <Card className="shadow-lg border-gray-300">
              <CardHeader className="bg-gray-100 border-b">
                <CardTitle>Total vs. Predicted Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: "Total Revenue", value: dashboardData.total_revenue },
                      { name: "Predicted Revenue", value: dashboardData.predicted_revenue },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#374151" />
                    <YAxis stroke="#374151" />
                    <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                    <Legend />
                    <Bar dataKey="value" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
