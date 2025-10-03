import React from "react";

interface ExcelIconProps {
  size?: number;
  color?: string;
}

export const ExcelIcon: React.FC<ExcelIconProps> = ({
  size = 20,
  color = "#217346",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#f0f8f0"
      />
      <path
        d="M14 2V8H20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
      />
      <path
        d="M8 11H16M8 13H16M8 15H16"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <text
        x="12"
        y="19"
        fontSize="3"
        textAnchor="middle"
        fill={color}
        fontWeight="bold"
      >
        XLS
      </text>
    </svg>
  );
};
