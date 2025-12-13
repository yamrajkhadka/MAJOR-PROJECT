import React from "react";

interface FeatureCardProps {
  title: string;
  text: string;
  icon: React.ElementType
}


export default function FeatureCard({ title, icon:Icon, text }:FeatureCardProps) {
  return (
    <div className="bg-white/25 p-8 rounded-2xl shadow hover:shadow-xl transition">
       <Icon  className="w-10 h-10 text-text mb-4"/>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-text mt-3">{text}</p>
    </div>
  );
}


function ToggleCard({ title, children, isOpen, onToggle }:any) {
  return (
    <div className=" rounded-2xl shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-6 py-4 bg-white/25 hover:bg-white/30 transition rounded-2xl"
      >
        <span className="text-lg text-text font-semibold">{title}</span>
        <span className="text-2xl text-text">{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && (
        <div className="px-6 py-4 text-text animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
}

export { ToggleCard };