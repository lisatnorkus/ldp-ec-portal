import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #051B3C 0%, #0A3772 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          fontFamily: "system-ui",
          gap: 2,
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-0.05em", display: "flex" }}>
          <span>LDP</span>
          <span style={{ color: "#C8102E", marginLeft: 4 }}>EC</span>
        </div>
        <div style={{ fontSize: 14, color: "#60A5FA", letterSpacing: "0.15em", fontWeight: 600 }}>
          PORTAL
        </div>
      </div>
    ),
    { ...size }
  );
}
