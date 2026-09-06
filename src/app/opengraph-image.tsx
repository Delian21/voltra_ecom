import { ImageResponse } from "next/og";

export const alt = "Voltra — Always on. Never out.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#0A0C10",
          backgroundImage:
            "radial-gradient(560px 300px at 20% -10%, rgba(198,255,62,0.10), transparent 65%)",
        }}
      >
        {/* Mark D — locked geometry, scaled 24 → ~200px */}
        <svg
          width="200"
          height="200"
          viewBox="0 0 24 24"
          style={{ marginLeft: 96, flex: "none" }}
        >
          <path
            d="M5.2 3.6 L12 19.6"
            stroke="#F4F6FA"
            strokeWidth={2.6}
            fill="none"
          />
          <path
            d="M12 19.6 L15.4 12.6 L13.9 12.6 L18.9 3.6"
            stroke="#C6FF3E"
            strokeWidth={2.6}
            fill="none"
          />
        </svg>

        <div
          style={{
            marginLeft: 64,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              color: "#F4F6FA",
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            Voltra
          </div>
          <div
            style={{
              color: "#C6FF3E",
              fontSize: 28,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginTop: 18,
              display: "flex",
              fontFamily: "monospace",
            }}
          >
            Always on. Never out.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
