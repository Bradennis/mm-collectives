import React from "react";

// Monogram tile used wherever the logo appears. Swap the inner <span> for an <img> once a logo file exists.
export default function BrandMark({ size = "w-11 h-11 lg:w-12 lg:h-12", pulse = true }) {
  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${size} rounded-xl bg-gradient-to-br from-secondary via-primary to-secondary p-[1.5px] shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105`}
      >
        <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
          <span className="font-display font-bold text-lg leading-none bg-gradient-to-br from-secondary to-primary bg-clip-text text-transparent">
            MM
          </span>
        </div>
      </div>
      {pulse && (
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse" />
      )}
    </div>
  );
}
