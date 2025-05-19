"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, CalendarDays, DollarSign } from "lucide-react";
import { PricingTable } from "@/components/pricing-table";
import { PricingChart } from "@/components/pricing-chart";
import type { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import Link from "next/link";
import { SabreNavbar } from "@/components/Navbar";

export function HotelPricingDashboard() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 4),
  });

  const [roomType, setRoomType] = useState("The_Studio_Room");

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Sabre Styled Navbar */}
      <SabreNavbar />

      <div className="container mx-auto py-6 space-y-6">
        {/* Header Section */}
        <header className="bg-white shadow border-b-2 border-gray-300 px-6 py-4 flex justify-between items-center rounded-lg">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-red-700" />
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Dynamic Pricing
            </h1>
          </div>
          {/* Admin Dashboard Link */}
          <Link href="/admin-dashboard">
            <button className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 font-medium">
              Dashboard
            </button>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Date Selection */}
          <Card className="md:col-span-4 bg-white shadow border border-gray-300">
            <CardHeader className="bg-gray-100 px-4 py-3 border-b">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <CalendarDays className="h-5 w-5 text-red-700" />
                Select Date Range
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Calendar
                mode="range" // KEEPING RANGE MODE
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                numberOfMonths={1}
              />
            </CardContent>
          </Card>

          {/* Pricing Overview */}
          <div className="md:col-span-8 space-y-6">
            {/* Room Selection */}
            <Card className="bg-white shadow border border-gray-300">
              <CardHeader className="bg-gray-100 px-4 py-3 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-gray-900 text-lg font-semibold">Room Selection</CardTitle>
                    <CardDescription>Select a room type to view pricing</CardDescription>
                  </div>
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger className="w-[220px] border-gray-400 font-medium text-gray-900">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="The_Studio_Room">The Studio Room</SelectItem>
                      <SelectItem value="The_Standard_Room">The Standard Room</SelectItem>
                      <SelectItem value="The_Corner_Room">The Corner Room</SelectItem>
                      <SelectItem value="The_Superior_Room">The Superior Room</SelectItem>
                      <SelectItem value="The_Deluxe_Room">The Deluxe Room</SelectItem>
                      <SelectItem value="The_Executive_Room">The Executive Room</SelectItem>
                      <SelectItem value="The_Premium_Suite">The Premium Suite</SelectItem>
                      <SelectItem value="The_Luxury_Suite">The Luxury Suite</SelectItem>
                      <SelectItem value="The_Presidential_Suite">The Presidential Suite</SelectItem>
                      <SelectItem value="The_Terrace_Suite">The Terrace Suite</SelectItem>
                      <SelectItem value="The_Taj_Club_Room">The Taj Club Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
            </Card>

            {/* Dynamic Pricing Overview */}
            <Card className="bg-white shadow border border-gray-300">
              <CardHeader className="bg-gray-100 px-4 py-3 border-b">
                <CardTitle className="flex items-center gap-2 text-gray-900 text-lg font-semibold">
                  <DollarSign className="h-5 w-5 text-red-700" />
                  Dynamic Pricing Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Tabs defaultValue="table" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="table" className="text-gray-700 font-semibold">Table View</TabsTrigger>
                    <TabsTrigger value="chart" className="text-gray-700 font-semibold">Chart View</TabsTrigger>
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
    </div>
  );
}
