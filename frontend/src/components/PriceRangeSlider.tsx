import React from 'react';

interface PriceRangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  max?: number; // Make `max` optional, with a default value
}

function PriceRangeSlider({ value, onChange, max = 100 }: PriceRangeSliderProps) {
  return (
    <input
      type="range"
      min="0"
      max={max} // Use the prop value
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
  );
}

export default PriceRangeSlider;
