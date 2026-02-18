import { Routes, Route } from "react-router-dom";
import { ChatScreen } from "./pages/ChatScreen";
import { HomeScreen } from "./pages/HomeScreen";
import { StatusBar } from "./components/StatusBar";
import { HomeIndicator } from "./components/HomeIndicator";
import "./App.css";

function App() {
  return (
    <div className="app-wrapper" style={{ display: "flex", flexDirection: "column", height: "100dvh", overflow: "hidden", background: "transparent" }}>
      <StatusBar />
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/chat" element={<ChatScreen />} />
        </Routes>
      </div>
      <HomeIndicator />
    </div>
  );
}

export default App;
