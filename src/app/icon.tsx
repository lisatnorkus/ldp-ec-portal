import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#051B3C",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 900,
          letterSpacing: "-0.05em",
          color: "#FFFFFF",
          fontFamily: "system-ui",
        }}
      >
        <span>LDP</span>
        <span style={{ color: "#C8102E", marginLeft: 1 }}>EC</span>
      </div>
    ),
    { ...size }
  );
}
