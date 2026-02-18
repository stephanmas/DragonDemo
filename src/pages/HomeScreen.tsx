import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GreetingSection } from "../components/GreetingSection";
import { Header } from "../components/Header";
import dashboardVideo from "../assets/DashboardBackgroundVideo.mp4";
import plusIcon from "../assets/Plus.svg";

export function HomeScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyWidth = body.style.width;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.width = "100%";
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.width = prevBodyWidth;
    };
  }, []);

  return (
    <div
      className="app-container"
      style={{
        display: "flex",
        flexDirection: "column",
        background: "transparent",
        minHeight: "100dvh",
        position: "relative",
        overflow: "hidden",
        overscrollBehavior: "none",
      }}
    >
      {/* Full-screen fixed video background - extends behind status bar & Safari UI */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          minHeight: "100dvh",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src={dashboardVideo} type="video/mp4" />
      </video>
      <div style={{ flexShrink: 0 }}>
        <Header showBack={false} variant="dashboard" />
      </div>
      <main
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 8,
        }}
      >
        <GreetingSection />
      </main>
      <motion.div
        style={{
          padding: "var(--action-bar-padding-y) var(--action-bar-padding-x) var(--space-lg)",
          paddingBottom: "calc(var(--space-lg) + env(safe-area-inset-bottom, 0px))",
          maxWidth: 390,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <motion.button
          onClick={() => navigate("/chat")}
          style={{
            width: "100%",
            height: "var(--action-bar-height)",
            minHeight: "var(--action-bar-height)",
            display: "flex",
            alignItems: "center",
            gap: 0,
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: 24,
            paddingTop: 0,
            paddingRight: "var(--action-bar-padding-x)",
            paddingBottom: 0,
            paddingLeft: 8,
            border: "1px solid rgba(255, 255, 255, 0.5)",
            boxShadow: "0 4px 40px 0 rgba(0, 0, 0, 0.10)",
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "inherit",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "transparent",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={plusIcon} alt="" width={24} height={24} style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
          </div>
          <span
            style={{
              flex: 1,
              fontSize: "var(--font-size-base)",
              color: "rgba(255, 255, 255, 0.95)",
            }}
          >
            Where to?
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
