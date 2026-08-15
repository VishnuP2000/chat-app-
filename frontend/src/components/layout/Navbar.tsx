import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { RiMessage3Line, RiMenuLine, RiCloseLine } from "react-icons/ri";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useAuth();
  const navigat = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    navigat("/");
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(5, 31, 32, 0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(142, 182, 155, 0.12)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 1.5rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <button
          id="navbar-logo"
          onClick={() => navigat("/")}
          aria-label="TalkyTalky home"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
            padding: 0,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "linear-gradient(135deg, #8EB69B, #235347)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 18px rgba(142, 182, 155, 0.25)",
            }}
          >
            <RiMessage3Line size={16} color="#051F20" />
          </div>
          <span
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "#DAF1DE",
              letterSpacing: "-0.02em",
              fontFamily: "'Syne', 'Inter', sans-serif",
            }}
          >
            Talky<span style={{ color: "#8EB69B" }}>Talky</span>
          </span>
        </button>

        {/* Desktop actions */}
        <div
          className="hidden md:flex"
          style={{ alignItems: "center", gap: "0.65rem" }}
        >
          <button
            id="navbar-chat-btn"
            onClick={() => navigat("/Dashboard")}
            style={{
              padding: "0.45rem 1.1rem",
              background: "rgba(11, 43, 38, 0.6)",
              border: "1px solid rgba(142, 182, 155, 0.12)",
              borderRadius: 9,
              color: "#8EB69B",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s, color 0.2s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#163832";
              e.currentTarget.style.borderColor = "rgba(142, 182, 155, 0.3)";
              e.currentTarget.style.color = "#DAF1DE";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(11, 43, 38, 0.6)";
              e.currentTarget.style.borderColor = "rgba(142, 182, 155, 0.12)";
              e.currentTarget.style.color = "#8EB69B";
            }}
          >
            Start Chatting
          </button>

          <button
            id="navbar-profile-btn"
            onClick={() => navigat("/profile")}
            style={{
              padding: "0.45rem 1.1rem",
              background: "rgba(11, 43, 38, 0.6)",
              border: "1px solid rgba(142, 182, 155, 0.12)",
              borderRadius: 9,
              color: "#8EB69B",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s, color 0.2s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#163832";
              e.currentTarget.style.borderColor = "rgba(142, 182, 155, 0.3)";
              e.currentTarget.style.color = "#DAF1DE";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(11, 43, 38, 0.6)";
              e.currentTarget.style.borderColor = "rgba(142, 182, 155, 0.12)";
              e.currentTarget.style.color = "#8EB69B";
            }}
          >
            Profile
          </button>

          {user ? (
            <button
              id="navbar-logout-btn"
              onClick={logout}
              style={{
                padding: "0.45rem 1.1rem",
                background: "linear-gradient(135deg, #8EB69B, #235347)",
                border: "none",
                borderRadius: 9,
                color: "#051F20",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "transform 0.15s, box-shadow 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(142, 182, 155, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Log out
            </button>
          ) : (
            <button
              id="navbar-signin-btn"
              onClick={() => navigat("/sign-in")}
              style={{
                padding: "0.45rem 1.1rem",
                background: "linear-gradient(135deg, #8EB69B, #235347)",
                border: "none",
                borderRadius: 9,
                color: "#051F20",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "transform 0.15s, box-shadow 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(142, 182, 155, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Sign in
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          id="navbar-hamburger"
          className="flex md:hidden"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          style={{
            background: "rgba(11, 43, 38, 0.8)",
            border: "1px solid rgba(142, 182, 155, 0.2)",
            borderRadius: 8,
            padding: "0.4rem",
            cursor: "pointer",
            color: "#8EB69B",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s, border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#163832";
            e.currentTarget.style.borderColor = "#8EB69B";
            e.currentTarget.style.color = "#DAF1DE";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(11, 43, 38, 0.8)";
            e.currentTarget.style.borderColor = "rgba(142, 182, 155, 0.2)";
            e.currentTarget.style.color = "#8EB69B";
          }}
        >
          {isOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className="flex md:hidden"
          style={{
            background: "rgba(5, 31, 32, 0.98)",
            borderTop: "1px solid rgba(142, 182, 155, 0.1)",
            padding: "1rem 1.5rem 1.5rem",
            flexDirection: "column",
            gap: "0.6rem",
          }}
        >
          {[
            {
              label: "Start Chatting",
              action: () => {
                setIsOpen(false);
                navigat("/Dashboard");
              },
            },
            {
              label: "Profile",
              action: () => {
                setIsOpen(false);
                navigat("/profile");
              },
            },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                padding: "0.7rem 0.5rem",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(142, 182, 155, 0.08)",
                color: "#8EB69B",
                fontSize: "0.95rem",
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#163832";
                e.currentTarget.style.color = "#DAF1DE";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#8EB69B";
              }}
            >
              {item.label}
            </button>
          ))}
          {user ? (
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              style={{
                marginTop: "0.5rem",
                padding: "0.7rem",
                background: "linear-gradient(135deg, #8EB69B, #235347)",
                border: "none",
                borderRadius: 9,
                color: "#051F20",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(142, 182, 155, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Log out
            </button>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                navigat("/sign-in");
              }}
              style={{
                marginTop: "0.5rem",
                padding: "0.7rem",
                background: "linear-gradient(135deg, #8EB69B, #235347)",
                border: "none",
                borderRadius: 9,
                color: "#051F20",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(142, 182, 155, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Sign in
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
