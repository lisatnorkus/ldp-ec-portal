import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "LDPEC Portal — Louisville Democratic Party Executive Committee";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #051B3C 0%, #0A3772 100%)",
          color: "#FFFFFF",
          padding: 80,
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "#C8102E",
            textTransform: "uppercase",
          }}
        >
          Louisville Democratic Party
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 92,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            display: "flex",
          }}
        >
          <span>Executive Committee</span>
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 92,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: "#D4A017",
          }}
        >
          Portal
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.8)",
            borderLeft: "4px solid #D4A017",
            paddingLeft: 20,
            maxWidth: 900,
          }}
        >
          The committee&apos;s internal playbook. Roles, committees, canvass tools, and the 2028
          reorg ahead.
        </div>
      </div>
    ),
    { ...size }
  );
}
