"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical, CheckCircle, XCircle, Pencil, Info } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import type { DateRange } from "react-day-picker";
import { motion } from "framer-motion"; // Added for modal animation

interface PricingData {
  avgOfSimilarHotelsPricing: number;
  current_price: number;
  date: string;
  description: string;
  logic: string;
  optimized_price: number;
  room_type: string;
  selected_ancillaries: string[];
  short_description: string;
}

interface PricingTableProps {
  roomType: string;
  dateRange: DateRange | undefined;
}

export function PricingTable({ roomType, dateRange }: PricingTableProps) {
  const [pricingData, setPricingData] = useState<PricingData[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [customPrice, setCustomPrice] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [priceStatus, setPriceStatus] = useState<Record<number, "accepted" | "rejected" | null>>({});



  useEffect(() => {
    async function fetchPricingData() {
      if (!dateRange?.from || !dateRange?.to) return;

      try {
        const startDate = new Date(dateRange.from);
        const endDate = new Date(dateRange.to);
        const allDates = [];

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          allDates.push(format(new Date(d), "yyyy-MM-dd"));
        }

        const responses = await Promise.all(
          allDates.map(async (date) => {
            try {
              const response = await fetch(
                `http://127.0.0.1:5000/get_prediction?date=${date}&room_type=${roomType}`
              );

              if (!response.ok) {
                if (response.status === 404) {
                  console.warn(`No data found for ${date}, skipping...`);
                  return null
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
              }

              return response.json();
            } catch (error) {
              console.error(`Error fetching data for ${date}:`, error);
              return null; // Ignore failed requests
            }
          })
        );

        setPricingData(responses.filter((data) => data !== null));
        console.log(responses.filter((data) => data !== null))
      } catch (error) {
        console.error("Error fetching pricing data:", error);
      }
    }

    fetchPricingData();
  }, [dateRange, roomType]);


  if (!pricingData) {
    return <div className="text-center py-4 text-gray-600">Loading pricing data...</div>;
  }

  const handleOpenModal = (index) => {
    setCustomPrice("");
    setCurrentIndex(index);
    setModalOpen(true);
  };

  return (
    <div className="rounded-md border bg-white shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Room Type</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right">Optimized Price</TableHead>
            <TableHead className="text-right">Difference</TableHead>
            <TableHead>Ancillaries</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pricingData.map((data, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{data.date ? format(new Date(data.date), "MMM dd, yyyy") : "N/A"}</TableCell>
              <TableCell>{data.room_type.replace(/_/g, " ")}</TableCell>
              <TableCell className="text-right">₹{data.current_price}</TableCell>
              <TableCell className="text-right font-semibold">₹{data.optimized_price}</TableCell>
              <TableCell
                className={`text-right font-semibold ${data.optimized_price > data.current_price ? "text-green-600" : "text-red-600"
                  }`}
              >
                {data.optimized_price - data.current_price > 0
                  ? `+₹${data.optimized_price - data.current_price}`
                  : `₹${data.optimized_price - data.current_price}`}
              </TableCell>

              {/* Ancillaries Column */}
              <TableCell>
                <ul className="list-disc list-inside text-gray-700 text-sm">
                  {data.selected_ancillaries.length > 0 ? (
                    data.selected_ancillaries.map((item, idx) => <li key={idx}>{item}</li>)
                  ) : (
                    <li>No additional ancillaries</li>
                  )}
                </ul>
              </TableCell>

              <TableCell className="text-right">
                <button className="p-2 rounded-md hover:bg-gray-100" onClick={() => handleOpenModal(index)}>
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>


      {/* Modal for Price Adjustment */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="p-4 rounded-2xl shadow-3xl sm:max-w-3xl md:max-w-3xl lg:max-w-3xl border border-gray-200 bg-white">
          {/* Header */}
          <DialogHeader className="text-center border-b pb-1">
            <DialogTitle className="text-lg font-medium flex items-center gap-1 justify-center text-gray-900">
              <Info className="h-5 w-5 text-red-600" /> Adjust Pricing
            </DialogTitle>
          </DialogHeader>

          {/* Pricing Insights */}
          <div className="bg-gray-100 p-3 rounded-md mt-1 border border-gray-300">
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {pricingData[currentIndex]?.description.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          {/* Pricing Information */}
          <div className="bg-white p-3 rounded-md border text-sm text-gray-900 shadow-sm">
            <p>
              <strong>Date:</strong>{" "}
              {pricingData[currentIndex]?.date
                ? format(new Date(pricingData[currentIndex]?.date), "MMM dd, yyyy")
                : "N/A"}
            </p>
            <p><strong>Current Price:</strong> ₹{pricingData[currentIndex]?.current_price}</p>
            <p><strong>Optimized Price:</strong> ₹{pricingData[currentIndex]?.optimized_price}</p>
          </div>

          {/* Pricing Logic */}
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200  text-sm">
            <p className="text-gray-800 font-medium">Pricing Logic:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {Array.isArray(pricingData[currentIndex]?.logic)
                ? pricingData[currentIndex]?.logic.map((step, index) => (
                  <li key={index}>{step}</li>
                ))
                : pricingData[currentIndex]?.logic?.split("\n").map((step, index) => (
                  <li key={index}>{step.trim()}</li>
                )) || <li>No logic available</li>}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-1 space-y-2">
            {/* Accept & Reject Buttons in one row */}
            <div className="flex gap-1">
              <Button
                className="flex-1 border border-green-600 bg-green-50 hover:bg-green-100 text-green-800 font-medium py-1.5 rounded-md shadow-sm transition-all duration-200 text-sm"
                onClick={() => {
                  console.log("Accepted", pricingData[currentIndex]?.optimized_price);
                  setModalOpen(false);
                }}
              >
                Accept
              </Button>

              <Button
                className="flex-1 border border-red-600 bg-red-50 hover:bg-red-100 text-red-800 font-medium py-1.5 rounded-md shadow-sm transition-all duration-200 text-sm"
                onClick={() => {
                  console.log("Rejected");
                  setModalOpen(false);
                }}
              >
                Reject
              </Button>
            </div>

            {/* Custom Pricing Input & Set Button */}
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Custom price"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="flex-1 border border-blue-500 focus:border-blue-700 p-1.5 rounded-md text-sm transition-all duration-200 ease-in-out"
              />
              <Button
                className="border border-blue-600 bg-blue-50 hover:bg-blue-100 text-blue-800 px-3 py-1.5 rounded-md shadow-sm transition-all duration-200 text-sm"
                onClick={() => {
                  console.log("Custom Price Set:", customPrice);
                  setModalOpen(false);
                }}
              >
                Set
              </Button>
            </div>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}
