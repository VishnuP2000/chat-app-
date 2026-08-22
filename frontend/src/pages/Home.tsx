import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  RiMessage3Line,
  RiUserAddLine,
  RiShieldLine,
  RiLayoutLine,
  RiFlashlightLine,
  RiGroupLine,
  RiMenuLine,
  RiCloseLine,
  RiArrowRightLine,
  RiWifiLine,
  RiCheckLine,
  RiSendPlaneLine,
} from "react-icons/ri";

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useFadeInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
}

// ─── Signal waveform — the page's signature element ──────────────────────────
function SignalLine() {
  return (
    <div className="signal-line" aria-hidden="true">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="signal-bar" />
      ))}
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────
const steps = [
  {
    title: "Create your account",
    desc: "Sign up in under a minute with your name and email. Once you're in, you're ready to connect with new people.",
  },
  {
    title: "Find your people",
    desc: "Search for friends or colleagues, send them a chat request, and start a conversation once they accept.",
  },
  {
    title: "Just talk",
    desc: "Once your request is accepted, start chatting instantly. Send and receive messages in real time and keep the conversation going.",
  },
];

// ─── Home Page ────────────────────────────────────────────────────────────────
function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigat = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const featuresSection = useFadeInView(0.1);
  const stepsSection = useFadeInView(0.1);
  const ctaSection = useFadeInView(0.2);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetStarted = () => navigate("/showUsers");

  return (
    <div className="home-page" id="home">
      {/* ─────────────────────────── NAVBAR ─────────────────────────────── */}
      <nav className={`home-nav ${scrolled ? "scrolled" : ""}`} aria-label="Main navigation">
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 1.5rem",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <button
            id="nav-logo"
            onClick={() => navigate("/")}
            aria-label="TalkyTalky home"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: 0,
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
                boxShadow: "0 0 18px rgba(142,182,155,0.35)",
              }}
            >
              <RiMessage3Line size={18} color="#051F20" />
            </div>
            <span
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#DAF1DE",
                letterSpacing: "-0.025em",
              }}
            >
              Talky<span style={{ color: "#8EB69B" }}>Talky</span>
            </span>
          </button>

          {/* Desktop nav links */}
          <ul
            className="hidden md:flex"
            style={{ display: "flex", alignItems: "center", gap: "2rem", listStyle: "none" }}
          >
          </ul>

          {/* Desktop CTA buttons */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "0.75rem" }}>
            {user ? (
              <>
                <button
                  id="nav-dashboard-btn"
                  className="btn-ghost"
                  onClick={() => navigate("/Dashboard")}
                >
                  Start Chatting
                </button>
                <button
                  id="nav-openchat-btn"
                  className="btn-primary"
                  onClick={handleGetStarted}
                >
                  Get Started <RiArrowRightLine />
                </button>
                <button
                  id="navbar-profile-btn"
                  onClick={() => navigat("/profile")}
                  style={{
                    padding: "0.45rem 1.1rem",
                    background: "rgba(142,182,155,0.06)",
                    border: "1px solid rgba(142,182,155,0.15)",
                    borderRadius: 9,
                    color: "#8EB69B",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background 0.2s, color 0.2s, border-color 0.2s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(142,182,155,0.12)";
                    e.currentTarget.style.color = "#DAF1DE";
                    e.currentTarget.style.borderColor = "rgba(142,182,155,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(142,182,155,0.06)";
                    e.currentTarget.style.color = "#8EB69B";
                    e.currentTarget.style.borderColor = "rgba(142,182,155,0.15)";
                  }}
                >
                  Profile
                </button>
              </>
            ) : (
              <>
                <button
                  id="nav-login-btn"
                  className="btn-ghost"
                  onClick={() => navigate("/sign-in")}
                >
                  Log in
                </button>
                <button
                  id="nav-getstarted-btn"
                  className="btn-primary"
                  onClick={() => navigate("/sign-up")}
                >
                  Sign-Up <RiArrowRightLine />
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            id="nav-hamburger-btn"
            className="flex md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{
              background: "rgba(142,182,155,0.06)",
              border: "1px solid rgba(142,182,155,0.18)",
              borderRadius: 8,
              padding: "0.45rem",
              cursor: "pointer",
              color: "#8EB69B",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {menuOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              className="mobile-menu md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  background: "rgba(5,31,32,0.98)",
                  borderTop: "1px solid rgba(142,182,155,0.08)",
                  padding: "1rem 1.5rem 1.5rem",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                    marginTop: "0.75rem",
                  }}
                >
                  {user ? (
                    <>
                      <button
                        id="mobile-dashboard-btn"
                        className="btn-ghost"
                        style={{ width: "100%", justifyContent: "center" }}
                        onClick={() => { setMenuOpen(false); navigate("/Dashboard"); }}
                      >
                        Dashboard
                      </button>
                      <button
                        id="mobile-openchat-btn"
                        className="btn-primary"
                        style={{ width: "100%", justifyContent: "center" }}
                        onClick={() => { setMenuOpen(false); handleGetStarted(); }}
                      >
                        Open Chat <RiArrowRightLine />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        id="mobile-login-btn"
                        className="btn-ghost"
                        style={{ width: "100%", justifyContent: "center" }}
                        onClick={() => { setMenuOpen(false); navigate("/sign-in"); }}
                      >
                        Log in
                      </button>
                      <button
                        id="mobile-signup-btn"
                        className="btn-primary"
                        style={{ width: "100%", justifyContent: "center" }}
                        onClick={() => { setMenuOpen(false); navigate("/sign-up"); }}
                      >
                        Get Started <RiArrowRightLine />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─────────────────────────── HERO ───────────────────────────────── */}


      {/* ─────────────────────────── FEATURES ───────────────────────────── */}


      {/* ─────────────────────────── HOW IT WORKS ───────────────────────── */}
      <section
        id="how-it-works"
        style={{
          background: "rgba(11,43,38,0.55)",
          borderTop: "1px solid rgba(142,182,155,0.08)",
          borderBottom: "1px solid rgba(142,182,155,0.08)",
          padding: "7rem 1.5rem",
        }}
        ref={stepsSection.ref}
        aria-labelledby="steps-heading"
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={stepsSection.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <div className="section-label" style={{ justifyContent: "center" }}>
              Getting started
            </div>
            <h2
              id="steps-heading"
              className="font-display"
              style={{
                fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#DAF1DE",
                marginBottom: "1rem",
              }}
            >
              Up and running in minutes
            </h2>
            <p style={{ color: "#8EB69B", fontSize: "1rem", maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>
              No tutorial needed. You already know how this works.
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 28 }}
                animate={stepsSection.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                id={`step-card-${i + 1}`}
                style={{
                  background: "rgba(22,56,50,0.6)",
                  border: "1px solid rgba(142,182,155,0.12)",
                  borderRadius: 16,
                  padding: "2rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1.25rem",
                    fontSize: "4.5rem",
                    fontWeight: 900,
                    color: "rgba(142,182,155,0.05)",
                    lineHeight: 1,
                    userSelect: "none",
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  {i + 1}
                </div>
                <div className="step-number" style={{ marginBottom: "1.25rem" }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: "1.025rem", fontWeight: 700, color: "#DAF1DE", marginBottom: "0.55rem" }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#8EB69B", lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── CTA ─────────────────────────────────── */}


      {/* ─────────────────────────── FOOTER ─────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid rgba(142,182,155,0.08)",
          padding: "3rem 1.5rem",
          background: "rgba(5,31,32,0.98)",
        }}
        role="contentinfo"
      >
        <div
          className="footer-grid"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #8EB69B, #235347)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RiMessage3Line size={15} color="#051F20" />
              </div>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "#DAF1DE" }}>
                Talky<span style={{ color: "#8EB69B" }}>Talky</span>
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "rgba(142,182,155,0.5)", maxWidth: 260, lineHeight: 1.65 }}>
              Real-time messaging for real people. Fast, clean, always on.
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "rgba(142,182,155,0.35)",
                marginTop: "1.25rem",
              }}
            >
              © {new Date().getFullYear()} TalkyTalky · Founded by{" "}
              <span style={{ fontWeight: "bold", color: "#8EB69B" }}>Vishnu P</span>
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "3rem", justifyContent: "flex-end" }}>
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(142,182,155,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.9rem" }}>
                Product
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {["Home", "Features", "How It Works"].map((link) => (
                  <li key={link}>
                    <a
                      id={`footer-link-${link.toLowerCase().replace(/\s+/g, "-")}`}
                      href={link === "Home" ? "#home" : `#${link.toLowerCase().replace(/\s+/g, "-")}`}
                      style={{ fontSize: "0.85rem", color: "rgba(142,182,155,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#8EB69B")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(142,182,155,0.5)")}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(link === "Home" ? "home" : link.toLowerCase().replace(/\s+/g, "-"));
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(142,182,155,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.9rem" }}>
                Account
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[
                  { label: "Log in", route: "" },
                  { label: "Sign up", route: "" },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      id={`footer-account-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => navigate(item.route)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        color: "rgba(142,182,155,0.5)",
                        transition: "color 0.2s",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#8EB69B")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(142,182,155,0.5)")}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .footer-grid {
              grid-template-columns: 1fr !important;
            }
            .footer-grid > div:last-child {
              justify-content: flex-start !important;
              gap: 2rem !important;
            }
          }
        `}</style>
      </footer>
    </div>
  );
}

export default Home;