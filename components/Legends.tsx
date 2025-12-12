import React from 'react'

const Legends = ({
  color,
  text,
}: {
  color: string;
  text: string;
}) => {
  return (
    <div className="flex items-center gap-1">
      <div className={`w-3 h-3 rounded-sm ${color}`} />
      <span className="tracking-tighter">{text}</span>
    </div>
  )
}

export default Legends
