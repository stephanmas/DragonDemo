import { Routes, Route } from "react-router-dom";
import { ChatScreen } from "./pages/ChatScreen";
import { HomeScreen } from "./pages/HomeScreen";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/chat" element={<ChatScreen />} />
    </Routes>
  );
}

export default App;
