import { useNavigate } from "react-router-dom";
import { ChatPanel } from "../components/ChatPanel";

export function ChatScreen() {
  const navigate = useNavigate();

  return (
    <ChatPanel
      onBack={() => navigate(-1)}
      autoFocusInput={false}
    />
  );
}
