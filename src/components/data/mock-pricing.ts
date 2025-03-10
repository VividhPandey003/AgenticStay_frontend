export const mockPredictedPricing = {
    standard: {
      basePrice: 125,
      weekend: 160,
      holiday: 185,
    },
    deluxe: {
      basePrice: 190,
      weekend: 230,
      holiday: 270,
    },
    suite: {
      basePrice: 260,
      weekend: 310,
      holiday: 360,
    },
    presidential: {
      basePrice: 470,
      weekend: 570,
      holiday: 670,
    },
  };
  
  // Mock Holidays
  export const mockHolidays = [
    new Date(2025, 0, 1), // New Year's Day
    new Date(2025, 6, 4), // Independence Day
    new Date(2025, 11, 25), // Christmas
  ];
  
  export const getMockPredictedPrice = (date: Date | null, roomType: string) => {
    if (!date) {
      console.warn("⚠️ Warning: getMockPredictedPrice received a null date.");
      return 0; // Default fallback price
    }
  
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isHoliday = mockHolidays.some((holiday) => holiday.toDateString() === date.toDateString());
  
    if (!mockPredictedPricing[roomType as keyof typeof mockPredictedPricing]) {
      console.warn(`⚠️ Warning: Invalid room type "${roomType}", using fallback.`);
      return mockPredictedPricing["standard"].basePrice;
    }
  
    return isHoliday
      ? mockPredictedPricing[roomType as keyof typeof mockPredictedPricing].holiday
      : isWeekend
      ? mockPredictedPricing[roomType as keyof typeof mockPredictedPricing].weekend
      : mockPredictedPricing[roomType as keyof typeof mockPredictedPricing].basePrice;
  };
  
  export const getMockPredictionReason = (date: Date | null, roomType: string) => {
    if (!date) return "Prediction unavailable.";
  
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isHoliday = mockHolidays.some((holiday) => holiday.toDateString() === date.toDateString());
  
    if (isHoliday) {
      return `Increased pricing due to a holiday. High demand expected for ${roomType}.`;
    } else if (isWeekend) {
      return `Weekend surge pricing applied. Higher demand for ${roomType}.`;
    } else {
      return `Standard weekday pricing applied based on past trends and competitor rates.`;
    }
  };
  