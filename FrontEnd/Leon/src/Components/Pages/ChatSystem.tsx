import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Style/styles.css";

interface SmsMessage {
  id: number;
  to: string;
  message: string;
  ticketRef: string;
  timestamp: string;
  status: "sent" | "failed" | "pending";
}

function ChatSystem() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [toPhone, setToPhone] = useState("");
  const [message, setMessage] = useState("");
  const [ticketRef, setTicketRef] = useState("");
  const [sending, setSending] = useState(false);
  const [twilioStatus, setTwilioStatus] = useState<
    "checking" | "connected" | "disconnected"
  >("checking");

  const [sentMessages, setSentMessages] = useState<SmsMessage[]>(() => {
    try {
      const saved = localStorage.getItem("smsMessageLog");
      return saved ? (JSON.parse(saved) as SmsMessage[]) : [];
    } catch {
      return [];
    }
  });
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem("smsMessageLog", JSON.stringify(sentMessages));
  }, [sentMessages]);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/api/Sms/status", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setTwilioStatus(data.connected ? "connected" : "disconnected"),
      )
      .catch(() => setTwilioStatus("disconnected"));
  }, [token]);

  if (!token) {
    navigate("/Login");
    return null;
  }

  const charLimit = 160;
  const remaining = charLimit - message.length;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    if (!toPhone.trim() || !message.trim()) {
      setNotice({
        type: "error",
        text: "Phone number and message are required.",
      });
      return;
    }

    setSending(true);
    setNotice(null);

    fetch(import.meta.env.VITE_API_URL + "/api/Sms/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        toPhoneNumber: toPhone,
        message,
        ticketId: ticketRef || null,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to send SMS.");
        const newMsg: SmsMessage = {
          id: Date.now(),
          to: toPhone,
          message,
          ticketRef,
          timestamp: new Date().toLocaleString(),
          status: "sent",
        };
        setSentMessages((prev) => [newMsg, ...prev]);
        setToPhone("");
        setMessage("");
        setTicketRef("");
        setNotice({ type: "success", text: "SMS sent successfully." });
      })
      .catch((err: Error) => {
        const newMsg: SmsMessage = {
          id: Date.now(),
          to: toPhone,
          message,
          ticketRef,
          timestamp: new Date().toLocaleString(),
          status: "failed",
        };
        setSentMessages((prev) => [newMsg, ...prev]);
        setNotice({ type: "error", text: err.message });
      })
      .finally(() => setSending(false));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="logo-section">
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="logo-icon"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
              </svg>
              <span className="logo-text">Leon</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <Link className="nav-item" to="/Dashboard">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>

            <div className="nav-item active">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
              </svg>
              <span>SMS System</span>
            </div>

            {/* Twilio status indicator */}
            <div style={{ padding: "1.5rem 1.5rem 1rem", marginTop: "auto" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.07)",
                  borderRadius: "10px",
                  padding: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background:
                        twilioStatus === "connected"
                          ? "#27ae60"
                          : twilioStatus === "disconnected"
                            ? "#e74c3c"
                            : "#f39c12",
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      color:
                        twilioStatus === "connected"
                          ? "#27ae60"
                          : twilioStatus === "disconnected"
                            ? "#e74c3c"
                            : "#f39c12",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                    }}
                  >
                    {twilioStatus === "connected"
                      ? "System: Connected"
                      : twilioStatus === "disconnected"
                        ? "System: Not Connected"
                        : "System: Checking..."}
                  </span>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="dashboard-main">
          <div className="content-section">
            <div className="section-header">
              <h2>SMS Phone System</h2>
              <p
                style={{
                  color: "#6c757d",
                  margin: "0.25rem 0 0",
                  fontSize: "0.95rem",
                }}
              >
                Send SMS notifications to customers about their support tickets
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                alignItems: "start",
              }}
            >
              {/* COMPOSE FORM */}
              <div
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: "1.75rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 1.5rem",
                    color: "#2c3e50",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    fill="#667eea"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                  </svg>
                  Compose SMS
                </h4>

                {notice && (
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: 8,
                      marginBottom: "1.25rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      background:
                        notice.type === "success" ? "#d4edda" : "#f8d7da",
                      color: notice.type === "success" ? "#155724" : "#721c24",
                      border: `1px solid ${notice.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                    }}
                  >
                    {notice.text}
                  </div>
                )}

                <form onSubmit={handleSend}>
                  <div className="update-form-group">
                    <label
                      htmlFor="toPhone"
                      style={{
                        display: "block",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: "#495057",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Recipient Phone Number
                    </label>
                    <input
                      id="toPhone"
                      type="tel"
                      className="update-form-input"
                      placeholder="+39 333 123 4567"
                      value={toPhone}
                      onChange={(e) => setToPhone(e.target.value)}
                      required
                    />
                    <small style={{ color: "#6c757d", fontSize: "0.775rem" }}>
                      Use international format, e.g. +39 for Italy
                    </small>
                  </div>

                  <div className="update-form-group">
                    <label
                      htmlFor="ticketRef"
                      style={{
                        display: "block",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: "#495057",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Ticket Reference{" "}
                      <span style={{ color: "#adb5bd", fontWeight: 400 }}>
                        (optional)
                      </span>
                    </label>
                    <input
                      id="ticketRef"
                      type="text"
                      className="update-form-input"
                      placeholder="e.g. #1042"
                      value={ticketRef}
                      onChange={(e) => setTicketRef(e.target.value)}
                    />
                  </div>

                  <div className="update-form-group">
                    <label
                      htmlFor="smsMessage"
                      style={{
                        display: "block",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: "#495057",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Message
                    </label>
                    <textarea
                      id="smsMessage"
                      className="update-form-input"
                      rows={5}
                      placeholder="Your support ticket has been updated..."
                      value={message}
                      maxLength={charLimit}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      style={{ resize: "vertical", fontFamily: "inherit" }}
                    />
                    <small
                      style={{
                        color: remaining < 20 ? "#dc3545" : "#6c757d",
                        fontSize: "0.775rem",
                      }}
                    >
                      {remaining} characters remaining
                    </small>
                  </div>

                  <button
                    type="submit"
                    className="update-form-button"
                    disabled={sending}
                    style={{ width: "100%", marginTop: "0.5rem" }}
                  >
                    {sending ? "Sending..." : "Send SMS"}
                  </button>
                </form>
              </div>

              {/* MESSAGE LOG */}
              <div
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: "1.75rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  minHeight: 400,
                }}
              >
                <h4
                  style={{
                    margin: "0 0 1.5rem",
                    color: "#2c3e50",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="#667eea"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                    </svg>
                    Message Log
                  </span>
                  <span
                    style={{
                      background: "#667eea",
                      color: "white",
                      borderRadius: 20,
                      padding: "2px 10px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {sentMessages.length}
                  </span>
                </h4>

                {sentMessages.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "3rem 1rem",
                      color: "#adb5bd",
                    }}
                  >
                    <svg
                      width="48"
                      height="48"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      style={{ marginBottom: "1rem", opacity: 0.4 }}
                    >
                      <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                    </svg>
                    <p style={{ margin: 0, fontWeight: 500 }}>
                      No messages sent yet
                    </p>
                    <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem" }}>
                      Messages you send will appear here
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    {sentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          border: "1px solid #e9ecef",
                          borderRadius: 10,
                          padding: "1rem",
                          background: "#f8f9fa",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <div>
                            <strong
                              style={{ color: "#2c3e50", fontSize: "0.9rem" }}
                            >
                              {msg.to}
                            </strong>
                            {msg.ticketRef && (
                              <span
                                style={{
                                  marginLeft: "0.5rem",
                                  background: "rgba(102,126,234,0.15)",
                                  color: "#667eea",
                                  borderRadius: 4,
                                  padding: "1px 6px",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                }}
                              >
                                {msg.ticketRef}
                              </span>
                            )}
                          </div>
                          <span
                            style={{
                              background:
                                msg.status === "sent"
                                  ? "#d4edda"
                                  : msg.status === "failed"
                                    ? "#f8d7da"
                                    : "#fff3cd",
                              color:
                                msg.status === "sent"
                                  ? "#155724"
                                  : msg.status === "failed"
                                    ? "#721c24"
                                    : "#856404",
                              borderRadius: 20,
                              padding: "2px 10px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            {msg.status}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: "0 0 0.4rem",
                            fontSize: "0.85rem",
                            color: "#495057",
                          }}
                        >
                          {msg.message}
                        </p>
                        <small
                          style={{ color: "#adb5bd", fontSize: "0.75rem" }}
                        >
                          {msg.timestamp}
                        </small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* QUICK TEMPLATES */}
            <div
              style={{
                background: "white",
                borderRadius: 12,
                padding: "1.75rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                marginTop: "1.5rem",
              }}
            >
              <h4
                style={{
                  margin: "0 0 1.25rem",
                  color: "#2c3e50",
                  fontWeight: 700,
                }}
              >
                Quick Templates
              </h4>
              <div
                style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
              >
                {[
                  "Your support ticket has been opened and assigned to our team. We'll be in touch shortly.",
                  "We're currently working on your issue. Thank you for your patience.",
                  "Your ticket has been resolved. Please let us know if you need further assistance.",
                  "We need additional information to proceed with your request. Please reply or call us.",
                ].map((template, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMessage(template)}
                    style={{
                      background: "rgba(102,126,234,0.08)",
                      border: "1px solid rgba(102,126,234,0.2)",
                      borderRadius: 8,
                      padding: "0.6rem 1rem",
                      fontSize: "0.82rem",
                      color: "#667eea",
                      cursor: "pointer",
                      textAlign: "left",
                      maxWidth: 260,
                    }}
                  >
                    {template.length > 60
                      ? template.slice(0, 57) + "..."
                      : template}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ChatSystem;
