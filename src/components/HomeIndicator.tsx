import { useLocation } from "react-router-dom";

export function HomeIndicator() {
  const location = useLocation();
  const isHomeScreen = location.pathname === "/";

  return (
    <div
      style={{
        height: 34,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 134,
          height: 5,
          borderRadius: 2.5,
          background: isHomeScreen ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.3)",
        }}
      />
    </div>
  );
}
