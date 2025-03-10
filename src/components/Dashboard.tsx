"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts"

// Mock Data for Charts
const revenueComparisonData = [
  { month: "Jan", actualRevenue: 20000, predictedRevenue: 25000 },
  { month: "Feb", actualRevenue: 18000, predictedRevenue: 23000 },
  { month: "Mar", actualRevenue: 22000, predictedRevenue: 27000 },
  { month: "Apr", actualRevenue: 24000, predictedRevenue: 28000 },
  { month: "May", actualRevenue: 21000, predictedRevenue: 26000 },
]

const occupancyTrendsData = [
  { month: "Jan", occupancyRate: 75 },
  { month: "Feb", occupancyRate: 80 },
  { month: "Mar", occupancyRate: 85 },
  { month: "Apr", occupancyRate: 78 },
  { month: "May", occupancyRate: 82 },
]

const seasonalDemandData = [
  { season: "Winter", demand: 30 },
  { season: "Spring", demand: 50 },
  { season: "Summer", demand: 90 },
  { season: "Autumn", demand: 60 },
]

export function Dashboard() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h2 className="text-2xl font-bold">📊 Hotel Insights Dashboard</h2>

      {/* Grid Layout for Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Comparison (Full Width) */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actualRevenue" fill="#4f46e5" name="Actual Revenue" />
                  <Bar dataKey="predictedRevenue" fill="#f59e0b" name="Predicted Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Occupancy Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyTrendsData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="occupancyRate" stroke="#4f46e5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Seasonal Demand Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Seasonal Demand Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={seasonalDemandData} dataKey="demand" nameKey="season" cx="50%" cy="50%" outerRadius={100} fill="#4f46e5" label>
                  {seasonalDemandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#4f46e5", "#f59e0b", "#22c55e", "#ef4444"][index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
