"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Building2, CalendarDays, DollarSign, TrendingUp } from "lucide-react"
import { PricingTable } from "@/components/pricing-table"
import { PricingChart } from "@/components/pricing-chart"
import type { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import { Dashboard } from "@/components/Dashboard"
import Link from "next/link"

export function HotelPricingDashboard() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  const [roomType, setRoomType] = useState("standard")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Grand Pacific Hotel</h1>
        </div>

        {/* Admin Dashboard Link */}
        <Link href="/admin-dashboard">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Admin Dashboard</button>
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Date
            </CardTitle>
            <CardDescription>Select date to view pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single" // Change mode to "single"
              selected={date?.from} // Select only a single date
              onSelect={(selectedDate) => setDate({ from: selectedDate, to: selectedDate })} // Update only a single date
              className="rounded-md border"
              numberOfMonths={1}
            />
          </CardContent>
        </Card>

        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Room Selection</CardTitle>
                <CardDescription>Filter pricing by room type</CardDescription>
              </div>
              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Room</SelectItem>
                  <SelectItem value="deluxe">Deluxe Room</SelectItem>
                  <SelectItem value="suite">Executive Suite</SelectItem>
                  <SelectItem value="presidential">Presidential Suite</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Dynamic Pricing Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="table" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="table">Table View</TabsTrigger>
                  <TabsTrigger value="chart">Chart View</TabsTrigger>
                </TabsList>
                <TabsContent value="table" className="mt-4">
                  <PricingTable roomType={roomType} dateRange={date} />
                </TabsContent>
                <TabsContent value="chart" className="mt-4">
                  <PricingChart roomType={roomType} dateRange={date} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
