import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "./Header";
import { InputBar } from "./InputBar";
import { ServiceCard, SERVICES } from "./ServiceCard";
import dcLogo from "../assets/DP_Concierge.svg";
import chevronDownIcon from "../assets/ChevronDown.svg";
import staticMap from "../assets/StaticMap.png";
import staticList from "../assets/StaticList.png";

interface ChatPanelProps {
  onBack: () => void;
  autoFocusInput?: boolean;
}

const THINKING_STEPS = [
  "Understanding your request",
  "Planning the search",
  "Gathering information",
  "Preparing your options",
  "Done",
] as const;

const DEMO_AI_RESPONSE_SEGMENTS: { text: string; bold?: boolean }[] = [
  { text: "For " },
  { text: "Singapore (3–8 March)", bold: true },
  { text: ", the " },
  { text: "Singapore Marriott Tang Plaza", bold: true },
  { text: " is your best option. I've included other Marriott properties to utilise your Gold Elite status." },
];

const TYPING_SPEED_MS = 12;

function TypewriterText({
  segments,
  speed = TYPING_SPEED_MS,
  onComplete,
}: {
  segments: { text: string; bold?: boolean }[];
  speed?: number;
  onComplete?: () => void;
}) {
  const [displayedSegments, setDisplayedSegments] = useState<{ text: string; bold?: boolean }[]>([]);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (segmentIndex >= segments.length) {
      onComplete?.();
      return;
    }

    const segment = segments[segmentIndex];
    const timer = setTimeout(() => {
      if (charIndex < segment.text.length) {
        setDisplayedSegments((prev) => {
          const next = [...prev];
          if (!next[segmentIndex]) {
            next[segmentIndex] = { text: "", bold: segment.bold };
          }
          next[segmentIndex] = {
            ...next[segmentIndex],
            text: segment.text.slice(0, charIndex + 1),
            bold: segment.bold,
          };
          return next;
        });
        setCharIndex((c) => c + 1);
      } else {
        setSegmentIndex((s) => s + 1);
        setCharIndex(0);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [segmentIndex, charIndex, segments, speed, onComplete]);

  const isComplete = segmentIndex >= segments.length;

  return (
    <>
      {displayedSegments.map((seg, i) =>
        seg.bold ? <strong key={i}>{seg.text}</strong> : seg.text
      )}
      {!isComplete && (
        <span
          style={{
            display: "inline-block",
            width: 2,
            height: "1em",
            backgroundColor: "currentColor",
            marginLeft: 1,
            animation: "blink 1s step-end infinite",
            verticalAlign: "text-bottom",
          }}
        />
      )}
    </>
  );
}

export function ChatPanel({ onBack, autoFocusInput = false }: ChatPanelProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [aiResponse, setAiResponse] = useState<boolean>(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinkingStep, aiResponse, typingComplete]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const handleSubmit = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, trimmed]);
    setMessage("");
        setAiResponse(false);
    setTypingComplete(false);
    setThinkingStep(1);
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [
      setTimeout(() => setThinkingStep(2), 2000),
      setTimeout(() => setThinkingStep(3), 5000),
      setTimeout(() => setThinkingStep(4), 10000),
      setTimeout(() => setThinkingStep(5), 12000),
      setTimeout(() => {
        setAiResponse(true);
      }, 12500),
    ];
  };

  return (
    <div
      className="app-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        minHeight: "100dvh",
        background: "linear-gradient(180deg, #F7F1ED 0%, #EDEDF6 50%, #E5EEF8 100%)",
        overflow: "hidden",
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <Header showBack onBack={onBack} />
      </div>
      <main
        style={{
          flex: 1,
          minHeight: 0,
          paddingTop: messages.length === 0 ? 40 : 16,
          paddingRight: 24,
          paddingBottom: "calc(100px + env(safe-area-inset-bottom, 0px))",
          paddingLeft: 24,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          justifyContent: "flex-start",
          alignItems: "stretch",
        }}
      >
        {messages.length === 0 ? (
          <p
            style={{
              fontSize: "28px",
              color: "#000",
              margin: 0,
              paddingBottom: 0,
            }}
          >
            Tell me what you need.
          </p>
        ) : (
          <>
            <AnimatePresence initial={false}>
              {messages.map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    alignSelf: "flex-end",
                    maxWidth: "85%",
                    padding: "12px 16px",
                    background: "#fff",
                    borderRadius: "var(--radius-lg)",
                    borderBottomRightRadius: 4,
                    color: "var(--color-text)",
                    fontSize: "var(--font-size-base)",
                    lineHeight: 1.4,
                    boxShadow: "0 2px 8px var(--color-shadow)",
                  }}
                >
                  {text}
                </motion.div>
              ))}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {thinkingStep > 0 && (
                <motion.div
                  key={`thinking-${thinkingStep}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    alignSelf: "flex-start",
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    padding: "12px 0px",
                    width: "100%",
                  }}
                >
                  {thinkingStep === 5 ? (
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: 24,
                        width: 30,
                        height: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={dcLogo}
                        alt=""
                        style={{ width: 16, height: 16, flexShrink: 0 }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: 24,
                        width: 30,
                        height: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          border: "2px solid var(--color-border)",
                          borderTopColor: "var(--color-text)",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                          flexShrink: 0,
                        }}
                      />
                    </div>
                  )}
                  <span
                    style={{
                      fontSize: "16px",
                      color: "var(--color-text-secondary)",
                      flex: 1,
                    }}
                  >
                    {THINKING_STEPS[thinkingStep - 1]}
                  </span>
                  <img
                    src={chevronDownIcon}
                    alt=""
                    style={{ width: 24, height: 24, flexShrink: 0, marginLeft: "auto" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  width: "100%",
                  maxWidth: 354,
                }}
              >
                <div
                  style={{
                    padding: "12px 0px",
                    background: "none",
                    borderRadius: "var(--radius-lg)",
                    borderBottomLeftRadius: 4,
                    color: "var(--color-text)",
                    fontSize: "var(--font-size-base)",
                    lineHeight: 1.4,
                  }}
                >
                  <TypewriterText
                    segments={DEMO_AI_RESPONSE_SEGMENTS}
                    onComplete={() => setTypingComplete(true)}
                  />
                </div>
                {typingComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    flexShrink: 0,
                  }}
                >
                  {/* Segment Controller */}
                  <div
                    style={{
                      display: "flex",
                      background: "rgba(0, 0, 0, 0.06)",
                      borderRadius: "9999px",
                      padding: 4,
                      gap: 0,
                    }}
                  >
                    <button
                      onClick={() => setViewMode("map")}
                      style={{
                        flex: 1,
                        padding: "8px 16px",
                        border: "none",
                        background: viewMode === "map" ? "#fff" : "transparent",
                        borderRadius: "9999px",
                        fontSize: 14,
                        fontWeight: viewMode === "map" ? 500 : 400,
                        color: viewMode === "map" ? "#000" : "rgba(0, 0, 0, 0.6)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: viewMode === "map" ? "0 1px 2px rgba(0, 0, 0, 0.08)" : "none",
                      }}
                    >
                      Map
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      style={{
                        flex: 1,
                        padding: "8px 16px",
                        border: "none",
                        background: viewMode === "list" ? "#fff" : "transparent",
                        borderRadius: "9999px",
                        fontSize: 14,
                        fontWeight: viewMode === "list" ? 500 : 400,
                        color: viewMode === "list" ? "#000" : "rgba(0, 0, 0, 0.6)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: viewMode === "list" ? "0 1px 2px rgba(0, 0, 0, 0.08)" : "none",
                      }}
                    >
                      List
                    </button>
                  </div>

                  {/* Map View */}
                  {viewMode === "map" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        width: "100%",
                        height: 354,
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={staticMap}
                        alt="Map view"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </motion.div>
                  )}

                  {/* List View */}
                  {viewMode === "list" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        width: "100%",
                        height: 898,
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={staticList}
                        alt="List view"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </motion.div>
                  )}
                </motion.div>
                )}
              </motion.div>
            )}
          </>
        )}
        {messages.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              {SERVICES.slice(0, 3).map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} onClick={() => {}} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              {SERVICES.slice(3, 7).map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index + 3} onClick={() => {}} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              {SERVICES.slice(7, 10).map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index + 7} onClick={() => {}} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>
      <InputBar
        variant="default"
        placeholder="Where to?"
        value={message}
        onChange={setMessage}
        onSubmit={handleSubmit}
        autoFocus={autoFocusInput}
        fixedAtBottom
      />
    </div>
  );
}
