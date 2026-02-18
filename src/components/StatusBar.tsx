import { useEffect, useState } from "react";
import signalIcon from "../assets/Signal.png";
import wifiIcon from "../assets/Wifi.png";
import batteryIcon from "../assets/Battery.png";

export function StatusBar() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateLondonTime = () => {
      const now = new Date();
      const londonTime = now.toLocaleTimeString("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setTime(londonTime);
    };

    // Update time immediately and then every minute
    updateLondonTime();
    const interval = setInterval(updateLondonTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="status-bar"
      style={{
        height: 54,
        background: "transparent",
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 44px 0 20px",
        color: "#000",
        fontSize: 15,
        fontWeight: 600,
      }}
    >
      <div className="time" style={{ flex: 1, marginLeft: 54 }}>
        {time}
      </div>
      <div
        className="icons"
        style={{
          display: "flex",
          gap: 4,
          alignItems: "center",
          fontSize: 14,
          marginRight: -12,
        }}
      >
        <span>
          <img src={signalIcon} alt="signal" style={{ width: 21, height: "auto", display: "block" }} />
        </span>
        <span>
          <img src={wifiIcon} alt="wifi" style={{ width: 21, height: "auto", display: "block" }} />
        </span>
        <span>
          <img src={batteryIcon} alt="battery" style={{ width: 32, height: "auto", display: "block" }} />
        </span>
      </div>
    </div>
  );
}
