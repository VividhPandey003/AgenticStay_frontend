"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts"
import { Dashboard } from "@/components/Dashboard"

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

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h2 className="text-2xl font-bold">📊 Hotel Insights Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
      <Dashboard />
        </div>

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
      </div>
    </div>
  )
}
