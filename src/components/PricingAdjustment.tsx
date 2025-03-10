"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"

interface PricingAdjustmentProps {
  date: string
  predictedPrice: number
  currentPrice: number
  onAccept: () => void
  onReject: () => void
  onCustomPrice: (customPrice: number) => void
}

export function PricingAdjustment({ date, predictedPrice, currentPrice, onAccept, onReject, onCustomPrice }: PricingAdjustmentProps) {
  const [customPrice, setCustomPrice] = useState<number | null>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Adjust Pricing</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <Info className="inline-block text-blue-400 mr-2" />
          Adjust Pricing for {date}
        </DialogTitle>
        <p className="text-muted-foreground text-sm">AI prediction suggests new pricing based on demand trends.</p>
        
        <div className="bg-gray-100 p-4 rounded-md">
          <p><strong>Predicted Price:</strong> ${predictedPrice}</p>
          <p><strong>Current Price:</strong> ${currentPrice}</p>
        </div>

        <Button className="w-full bg-green-500 text-white" onClick={onAccept}>
          ✅ Accept Predicted Pricing
        </Button>
        
        <Button className="w-full border-red-500 text-red-500 mt-2" variant="outline" onClick={onReject}>
          ❌ Reject Pricing
        </Button>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="number"
            placeholder="Enter custom price"
            className="w-full border p-2 rounded-md"
            value={customPrice || ""}
            onChange={(e) => setCustomPrice(Number(e.target.value))}
          />
          <Button variant="outline" onClick={() => customPrice && onCustomPrice(customPrice)}>✏️ Set</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
