import React from "react";
import "./city-to-teams-animation.css";

export default function CityToTeamsAnimation({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 510 390"
      width="330"
      height="255"
      style={{ display: "block", margin: "0 auto", ...style }}
      className="city-teams-svg"
    >
      {/* Cityscape */}
      <g className="cityscape">
        <rect x="45" y="300" width="45" height="60" fill="#dbeafe" />
        <rect x="97.5" y="270" width="33" height="90" fill="#b6c6e3" />
        <rect x="138" y="315" width="27" height="45" fill="#b6c6e3" />
        <rect x="172.5" y="285" width="37.5" height="75" fill="#dbeafe" />
        <rect x="217.5" y="307.5" width="22.5" height="52.5" fill="#b6c6e3" />
        <rect x="247.5" y="292.5" width="30" height="67.5" fill="#dbeafe" />
        <rect x="285" y="315" width="27" height="45" fill="#b6c6e3" />
        <rect x="318" y="300" width="42" height="60" fill="#dbeafe" />
        <rect x="367.5" y="277.5" width="33" height="82.5" fill="#b6c6e3" />
        <rect x="405" y="315" width="27" height="45" fill="#b6c6e3" />
      </g>
      {/* Lines from city to Spark node */}
      <g className="city-to-spark-lines">
        <polyline points="105,300 165,210 255,180" className="city-line" />
        <polyline points="255,330 255,225 255,180" className="city-line" />
        <polyline points="405,315 315,210 255,180" className="city-line" />
      </g>
      {/* Central Spark node with logo and label */}
      <g className="spark-node">
        {/* Cover circle to hide lines behind logo */}
        <circle cx="255" cy="180" r="40" fill="#fff" />
        <circle cx="255" cy="180" r="27" fill="#fffbe6" stroke="#fbbf24" strokeWidth="4.5" className="spark-pulse" />
        <image
          href="/logo.svg"
          x="216"
          y="141"
          width="78"
          height="78"
          style={{ pointerEvents: 'none' }}
        />
      </g>
      {/* Lines from Spark to teams */}
      <g className="spark-to-teams-lines">
        {/* Double the spacing above the logo edge */}
        <polyline points="223,148 135,90" className="spark-line" />
        <polyline points="255,133 255,60" className="spark-line" />
        <polyline points="287,148 375,90" className="spark-line" />
      </g>
      {/* Team nodes with labels */}
      <g className="team-nodes">
        <circle cx="135" cy="90" r="19.5" fill="#e0f2fe" stroke="#3b82f6" strokeWidth="3" className="team-pulse team1" />
        <circle cx="255" cy="60" r="19.5" fill="#e0f2fe" stroke="#3b82f6" strokeWidth="3" className="team-pulse team2" />
        <circle cx="375" cy="90" r="19.5" fill="#e0f2fe" stroke="#3b82f6" strokeWidth="3" className="team-pulse team3" />
      </g>
  {/* Animated data packet: from building to Spark, then split to all locators */}
  {/* Incoming dot: from building to Spark */}
  <circle className="data-packet-in" r="7.5" fill="#fbbf24" />
  {/* Outgoing dots: from Spark to each locator */}
  <circle className="data-packet-out packet-out-1" r="7.5" fill="#fbbf24" />
  <circle className="data-packet-out packet-out-2" r="7.5" fill="#fbbf24" />
  <circle className="data-packet-out packet-out-3" r="7.5" fill="#fbbf24" />
    </svg>
  );
}
