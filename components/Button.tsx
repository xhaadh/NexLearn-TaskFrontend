import Link from "next/link";
import React from "react";

type Props = {
  href?: string;
  text: string;
  className?: string;
  onClick?: () => void;
};

const Button = ({ href, text, className, onClick }: Props) => {
  const base =
    "inline-block w-72 text-center text-white py-2 rounded-md shadow-md hover:opacity-95";

  if (onClick && !href) {
    return (
      <button onClick={onClick} className={`${base} ${className}`}>
        {text}
      </button>
    );
  }

  return (
    <Link href={href || "#"} className={`${base} ${className}`}>
      {text}
    </Link>
  );
};

export default Button;
