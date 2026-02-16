import React from 'react';
import Ripple from './Ripple';

export default function ToolCard({ name, onClick, isActive }) {
  const activeClass = isActive ? 'border-[#24e4a7] shadow-[0_0_10px_#24e4a7]' : 'border-[#344154]';

  return (
    <div
      className={`relative overflow-hidden bg-[#2a3442] rounded-md p-4 text-center cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#24e4a7]/50 ${activeClass}`}
      onClick={onClick}
    >
      <p className="text-sm font-medium text-white">{name}</p>
      <Ripple color="bg-[#24e4a7]" />
    </div>
  );
}
