export function StatusBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px 8px",
        fontSize: "14px",
        fontWeight: 600,
        color: "var(--color-text)",
      }}
    >
      <span>13:03</span>
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <span>📶</span>
        <span>📡</span>
        <span>🔋</span>
      </div>
    </div>
  );
}
