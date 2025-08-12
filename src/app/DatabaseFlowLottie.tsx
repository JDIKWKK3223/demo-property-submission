import React from "react";
import Lottie from "lottie-react";
import animationData from "./database-flow-lottie.json";

export default function DatabaseFlowLottie({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <Lottie animationData={animationData} loop={true} style={{ width: "100%", maxWidth: 220, ...style }} />
  );
}
