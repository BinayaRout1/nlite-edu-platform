import React, { useState, useEffect } from "react";

const LogViewer = () => {
  const [logType, setLogType] = useState("backend");
  const [logData, setLogData] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/logs?type=${logType}`, {
        headers: {
          Authorization: "Basic " + btoa("admin:yourpassword"),
        },
      })
        .then((res) => res.json())
        .then((data) => setLogData(data.log))
        .catch((err) => console.error("Log fetch error:", err));
    }, 3000);

    return () => clearInterval(interval);
  }, [logType]);

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        {["backend", "access", "error"].map((type) => (
          <button
            key={type}
            onClick={() => setLogType(type)}
            style={{
              marginRight: "10px",
              padding: "8px 16px",
              background: logType === type ? "#198754" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {type.toUpperCase()} LOG
          </button>
        ))}
      </div>

      <div
        style={{
          background: "#111",
          color: "#0f0",
          padding: "1rem",
          height: "70vh",
          overflowY: "scroll",
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
          borderRadius: "8px",
        }}
      >
        {logData}
      </div>
    </div>
  );
};

export default LogViewer;
