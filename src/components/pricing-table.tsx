"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical, CheckCircle, XCircle, Pencil, Info } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { addDays, format, isSameDay } from "date-fns";
import { getMockPredictedPrice, getMockPredictionReason, mockHolidays } from "@/components/data/mock-pricing";
import { Input } from "@/components/ui/input";

interface PricingTableProps {
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

export function PricingTable({ roomType, dateRange }: PricingTableProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [customPrice, setCustomPrice] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPredictedPrice, setSelectedPredictedPrice] = useState<number | null>(null);
  const [selectedCurrentPrice, setSelectedCurrentPrice] = useState<number | null>(null);

  if (!dateRange?.from) {
    return <div className="text-center py-4">Please select a date range</div>;
  }

  const dates = [];
  let currentDate = dateRange.from;
  while (currentDate <= (dateRange.to || dateRange.from)) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  const getPriceForDate = (date: Date, type: string) => {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isHoliday = mockHolidays.some((holiday) => isSameDay(holiday, date));
    if (!roomPricing[type as keyof typeof roomPricing]) return null;
    return isHoliday
      ? roomPricing[type as keyof typeof roomPricing].holiday
      : isWeekend
        ? roomPricing[type as keyof typeof roomPricing].weekend
        : roomPricing[type as keyof typeof roomPricing].basePrice;
  };

  const handleOpenModal = (date: Date, predictedPrice: number, currentPrice: number) => {
    setSelectedDate(date);
    setSelectedPredictedPrice(predictedPrice);
    setSelectedCurrentPrice(currentPrice);
    setCustomPrice(""); // Reset input field
    setModalOpen(true);
  };

  const handleAcceptPrice = () => {
    console.log(`✅ Accepted: Updating ${selectedDate} to Predicted Price`);
    setModalOpen(false);
  };

  const handleRejectPrice = () => {
    console.log(`❌ Rejected: Keeping ${selectedDate} as is`);
    setModalOpen(false);
  };

  const handleCustomPrice = () => {
    console.log(`✏️ Custom Price for ${selectedDate}: $${customPrice}`);
    setModalOpen(false);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Day</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right">Predicted Price</TableHead>
            <TableHead className="text-right">Difference</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dates.map((date) => {
            const actualPrice = getPriceForDate(date, roomType);
            const predictedPrice = getMockPredictedPrice(date, roomType);
            const priceDiff = predictedPrice - actualPrice;

            return (
              <TableRow key={date.toISOString()}>
                <TableCell className="font-medium">{format(date, "MMM dd, yyyy")}</TableCell>
                <TableCell>{format(date, "EEEE")}</TableCell>
                <TableCell className="text-right">${actualPrice}</TableCell>
                <TableCell className="text-right font-semibold">${predictedPrice}</TableCell>
                <TableCell
                  className={`text-right font-semibold ${priceDiff > 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {priceDiff > 0 ? `+${priceDiff}` : priceDiff}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    className="p-2 rounded-md hover:bg-gray-100"
                    onClick={() => handleOpenModal(date, predictedPrice, actualPrice)}
                  >
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Modal for Price Adjustment */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="p-6 rounded-lg shadow-xl max-w-md">
          {/* Header */}
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2 justify-center">
              <Info className="h-6 w-6 text-blue-500" /> Adjust Pricing
            </DialogTitle>
          </DialogHeader>

          {/* Reason for Predicted Pricing */}
          <div className="bg-gray-100 p-3 rounded-md">
            <p className="text-md font-semibold">
              {getMockPredictionReason(selectedDate!, roomType)}
            </p>
          </div>

          {/* Pricing Information */}
          <div className="bg-white p-3 rounded-md border mt-3">
            <p><strong>Date:</strong> {format(selectedDate!, "MMM dd, yyyy")}</p>
            <p><strong>Predicted Price:</strong> ${selectedPredictedPrice}</p>
            <p><strong>Current Price:</strong> ${selectedCurrentPrice}</p>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-3 mt-5">
            <Button className="w-full bg-green-500 text-white" onClick={handleAcceptPrice}>
              ✅ Accept Predicted Pricing
            </Button>

            <Button className="w-full border border-red-500 text-red-500" variant="outline" onClick={handleRejectPrice}>
              ❌ Reject Pricing
            </Button>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Enter custom price"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="flex-1 border border-gray-300 p-3 rounded-lg"
              />
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={handleCustomPrice}>
                ✏️ Set
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
