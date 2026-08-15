import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconMessageCircle,
  IconMail,
  IconUser,
  IconCode,
  IconEdit,
} from "@tabler/icons-react";

function Profile() {
  console.log("enter the showUser");
  const { user } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name?: string | null) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?";

  return (
    <div
      className="min-h-screen"
      style={{
        background: `
          radial-gradient(circle at 20% 15%, rgba(35, 83, 71, 0.18), transparent 70%),
          radial-gradient(circle at 85% 80%, rgba(22, 56, 50, 0.25), transparent 65%),
          #051F20
        `,
        color: "#DAF1DE",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Top bar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(5, 31, 32, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(142, 182, 155, 0.12)",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "0 1.5rem",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(142, 182, 155, 0.65)",
              fontSize: "0.875rem",
              fontWeight: 500,
              fontFamily: "inherit",
              padding: "0.4rem 0",
              transition:
                "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#DAF1DE")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(142, 182, 155, 0.65)")
            }
          >
            <IconArrowLeft size={16} />
            Back
          </button>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg, #8EB69B, #235347)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 12px rgba(142, 182, 155, 0.25)",
              }}
            >
              <IconMessageCircle size={14} color="#051F20" />
            </div>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#DAF1DE",
                letterSpacing: "-0.02em",
                fontFamily: "'Syne', 'Inter', sans-serif",
              }}
            >
              Talky<span style={{ color: "#8EB69B" }}>Talky</span>
            </span>
          </div>

          {/* Open chat */}
          <button
            onClick={() => navigate("/Dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.4rem 0.9rem",
              background: "linear-gradient(135deg, #8EB69B, #235347)",
              border: "none",
              borderRadius: 10,
              color: "#051F20",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition:
                "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 10px 25px rgba(142, 182, 155, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <IconMessageCircle size={13} />
            Open chat
          </button>
        </div>
      </nav>

      {/* Page body */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {/* ── Profile card ── */}
          <div
            style={{
              background: "#0B2B26",
              border: "1px solid rgba(142, 182, 155, 0.12)",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.28)",
            }}
          >
            {/* Hero strip */}
            <div
              style={{
                height: 100,
                background:
                  "linear-gradient(135deg, rgba(35, 83, 71, 0.55) 0%, rgba(22, 56, 50, 0.35) 60%, transparent 100%)",
                position: "relative",
              }}
            >
              {/* Subtle grid overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(rgba(142, 182, 155, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(142, 182, 155, 0.06) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
            </div>

            {/* Avatar + name section */}
            <div style={{ padding: "0 1.75rem 1.75rem" }}>
              {/* Avatar */}
              <div style={{ position: "relative", display: "inline-block", marginTop: -44 }}>
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    border: "3px solid #8EB69B",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #163832, #235347)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 25px rgba(142, 182, 155, 0.15)",
                    transition:
                      "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.borderColor = "#DAF1DE";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.borderColor = "#8EB69B";
                  }}
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: 700,
                        color: "#DAF1DE",
                        fontFamily: "'Syne', sans-serif",
                        lineHeight: 1,
                      }}
                    >
                      {getInitials(user?.name)}
                    </span>
                  )}
                </div>

                {/* Online dot */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#8EB69B",
                    border: "2.5px solid #0B2B26",
                    boxShadow: "0 0 8px rgba(142, 182, 155, 0.45)",
                  }}
                />
              </div>

              {/* Name + meta */}
              <div style={{ marginTop: "0.9rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <h1
                      style={{
                        fontSize: "1.35rem",
                        fontWeight: 700,
                        color: "#DAF1DE",
                        letterSpacing: "-0.025em",
                        marginBottom: "0.25rem",
                        fontFamily: "'Syne', 'Inter', sans-serif",
                      }}
                    >
                      {user?.name || "Unknown User"}
                    </h1>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.2rem 0.7rem",
                        background: "rgba(35, 83, 71, 0.35)",
                        border: "1px solid rgba(142, 182, 155, 0.2)",
                        borderRadius: 100,
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "#8EB69B",
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: "#8EB69B",
                          display: "inline-block",
                        }}
                      />
                      Active
                    </span>
                  </div>

                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.45rem 1rem",
                      background: "rgba(11, 43, 38, 0.6)",
                      border: "1px solid rgba(142, 182, 155, 0.2)",
                      borderRadius: 10,
                      color: "#8EB69B",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition:
                        "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#163832";
                      e.currentTarget.style.borderColor = "#8EB69B";
                      e.currentTarget.style.color = "#DAF1DE";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(11, 43, 38, 0.6)";
                      e.currentTarget.style.borderColor = "rgba(142, 182, 155, 0.2)";
                      e.currentTarget.style.color = "#8EB69B";
                    }}
                  >
                    <IconEdit size={13} color="currentColor" />
                    Edit profile
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  margin: "1.25rem 0",
                  height: 1,
                  background: "rgba(142, 182, 155, 0.1)",
                }}
              />

              {/* Info rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {user?.email && (
                  <InfoRow icon={<IconMail size={15} />} label="Email" value={user.email} />
                )}
                <InfoRow icon={<IconUser size={15} />} label="Display name" value={user?.name || "—"} />
                <InfoRow icon={<IconCode size={15} />} label="Role" value="Software Developer" />
              </div>
            </div>
          </div>

          {/* ── Quick actions ── */}
          <div
            style={{
              marginTop: "1.25rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.85rem",
            }}
          >
            <ActionCard
              icon={<IconMessageCircle size={18} />}
              title="Start chatting"
              subtitle="Open your conversations"
              onClick={() => navigate("/Dashboard")}
            />
            <ActionCard
              icon={<IconUser size={18} />}
              title="Discover people"
              subtitle="Find and connect with others"
              onClick={() => navigate("/showUsers")}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: "#163832",
          border: "1px solid rgba(142, 182, 155, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8EB69B",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            fontSize: "0.7rem",
            color: "#8EB69B",
            fontWeight: 500,
            marginBottom: "0.1rem",
          }}
        >
          {label}
        </p>
        <p style={{ fontSize: "0.875rem", color: "#DAF1DE", fontWeight: 500 }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.5rem",
        padding: "1rem 1.1rem",
        background: hovered ? "#235347" : "#163832",
        border: hovered
          ? "1px solid rgba(142, 182, 155, 0.25)"
          : "1px solid rgba(142, 182, 155, 0.1)",
        borderRadius: 14,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        transition:
          "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
        boxShadow: hovered
          ? "0 12px 32px rgba(0, 0, 0, 0.28)"
          : "0 2px 8px rgba(0, 0, 0, 0.2)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: "linear-gradient(135deg, #8EB69B, #235347)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#051F20",
          boxShadow: hovered
            ? "0 4px 14px rgba(142, 182, 155, 0.25)"
            : "none",
          transition: "box-shadow 0.2s ease",
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#DAF1DE",
            marginBottom: "0.15rem",
          }}
        >
          {title}
        </p>
        <p style={{ fontSize: "0.72rem", color: "rgba(142, 182, 155, 0.65)" }}>
          {subtitle}
        </p>
      </div>
    </button>
  );
}

import React from "react";

export default Profile;
