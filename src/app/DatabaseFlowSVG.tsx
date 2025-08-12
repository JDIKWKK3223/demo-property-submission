import React from "react";
import "./database-flow-svg.css";

export default function DatabaseFlowSVG({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 220 220"
      width="180"
      height="180"
      style={{ display: "block", margin: "0 auto", ...style }}
      className="db-flow-svg"
    >
      {/* Central node */}
      <circle cx="110" cy="110" r="28" fill="#e3eafc" stroke="#3b4a6b" strokeWidth="3" className="db-pulse" />
      {/* Outward arrows */}
      <g className="db-arrow-group">
        <g className="db-arrow db-arrow1">
          <line x1="110" y1="110" x2="40" y2="40" stroke="#3b4a6b" strokeWidth="3" />
          <polygon points="40,40 48,38 42,46" fill="#3b4a6b" />
        </g>
        <g className="db-arrow db-arrow2">
          <line x1="110" y1="110" x2="110" y2="20" stroke="#3b4a6b" strokeWidth="3" />
          <polygon points="110,20 116,28 104,28" fill="#3b4a6b" />
        </g>
        <g className="db-arrow db-arrow3">
          <line x1="110" y1="110" x2="180" y2="40" stroke="#3b4a6b" strokeWidth="3" />
          <polygon points="180,40 172,38 178,46" fill="#3b4a6b" />
        </g>
      </g>
    </svg>
  );
}
