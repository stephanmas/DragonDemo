import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import conversationIcon from "../assets/Conversation.svg";

const frostedButtonStyle = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "1px solid rgba(255, 255, 255, 0.35)",
  background: "rgba(255, 255, 255, 0.25)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
} as const;

interface HeaderProps {
  onBack?: () => void;
  showBack?: boolean;
  onChatClick?: () => void;
  variant?: "dashboard" | "chat";
}

export function Header({ onBack, showBack = true, onChatClick, variant = "chat" }: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <header
      style={{
        position: "static",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        paddingTop: "94px",
        background: "transparent",
        backgroundColor: "transparent",
      }}
    >
      {showBack ? (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleBack}
          style={frostedButtonStyle}
          aria-label="Back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </motion.button>
      ) : (
        <div style={{ width: 40 }} />
      )}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {variant === "dashboard" ? (
          <>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {}}
              style={frostedButtonStyle}
              aria-label="Notifications"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {}}
              style={frostedButtonStyle}
              aria-label="Profile"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </motion.button>
          </>
        ) : (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onChatClick ?? (() => navigate("/chat"))}
            style={frostedButtonStyle}
            aria-label="Conversation"
          >
            <img src={conversationIcon} alt="" width={24} height={24} />
          </motion.button>
        )}
      </div>
    </header>
  );
}
