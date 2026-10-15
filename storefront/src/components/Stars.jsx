import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

export default function Stars({ value = 0, className = "text-[10px]" }) {
  return (
    <div className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) =>
        i < Math.round(value) ? (
          <FaStar key={i} className={`text-orange-400 ${className}`} />
        ) : (
          <FaRegStar key={i} className={`text-gray-300 ${className}`} />
        )
      )}
    </div>
  );
}
