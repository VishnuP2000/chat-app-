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
  RiSparklingLine,
  RiCheckLine,
} from "react-icons/ri";

// ─── Fade-in on scroll hook ───────────────────────────────────────────────────
function useFadeInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
}

// ─── ChatPreview — animated floating mock chat UI ─────────────────────────────
function ChatPreview() {
  const [showTyping, setShowTyping] = useState(true);
  const [thirdMessage, setThirdMessage] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setShowTyping(false);
      setThirdMessage(true);
    }, 2200);
    const t2 = setTimeout(() => {
      setShowTyping(true);
      setThirdMessage(false);
    }, 5000);
    const interval = setInterval(() => {
      setShowTyping(true);
      setThirdMessage(false);
      setTimeout(() => {
        setShowTyping(false);
        setThirdMessage(true);
      }, 2200);
    }, 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(interval);
    };
  }, []);

  const avatarColors = ["#6C63FF", "#EC4899", "#10B981"];

  return (
    <div className="chat-preview-card" style={{ position: "relative" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.25rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            className="avatar-ring"
            style={{ background: "linear-gradient(135deg,#6C63FF,#8B5CF6)", width: 40, height: 40 }}
          >
            S
          </div>
          <div className="online-dot" />
        </div>
        <div>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#f4f4f5", lineHeight: 1.2 }}>
            Sarah
          </p>
          <p style={{ fontSize: "0.72rem", color: "#22c55e", fontWeight: 500 }}>● Online</p>
        </div>
        {/* Decorative dots */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : "#22c55e",
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="chat-message-bubble chat-bubble-received"
        >
          Hey! Are you free to chat? 👋
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="chat-message-bubble chat-bubble-sent"
        >
          Yes! Just joined Talky-Talky ✨
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="chat-message-bubble chat-bubble-received"
        >
          It's so fast and clean 🔥
        </motion.div>

        <AnimatePresence mode="wait">
          {showTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.07)",
                  borderRadius: "14px 14px 14px 4px",
                  padding: "0.6rem 0.9rem",
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                }}
              >
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
              <span style={{ fontSize: "0.7rem", color: "#71717a" }}>Sarah is typing…</span>
            </motion.div>
          )}
          {thirdMessage && (
            <motion.div
              key="reply"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="chat-message-bubble chat-bubble-received"
            >
              Let's connect everyone here! 🚀
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          padding: "0.5rem 0.75rem",
        }}
      >
        <span style={{ fontSize: "0.8rem", color: "#52525b", flex: 1 }}>Type a message…</span>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#6C63FF,#8B5CF6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <RiArrowRightLine style={{ color: "#fff", fontSize: "0.8rem" }} />
        </div>
      </div>

      {/* Online avatars row */}
      <div
        style={{
          marginTop: "0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <div style={{ display: "flex" }}>
          {avatarColors.map((color, i) => (
            <div
              key={i}
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: color,
                border: "2px solid #18181b",
                marginLeft: i > 0 ? -6 : 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {["S", "A", "M"][i]}
            </div>
          ))}
        </div>
        <span style={{ fontSize: "0.72rem", color: "#71717a" }}>+128 online now</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <div
            style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }}
          />
          <span style={{ fontSize: "0.7rem", color: "#22c55e", fontWeight: 500 }}>Live</span>
        </div>
      </div>
    </div>
  );
}

// ─── Features data ────────────────────────────────────────────────────────────
const features = [
  {
    icon: <RiMessage3Line size={22} color="#a78bfa" />,
    title: "Real-Time Messaging",
    desc: "Instant message delivery with zero delay. Conversations flow naturally, the way they should.",
  },
  {
    icon: <RiUserAddLine size={22} color="#a78bfa" />,
    title: "Connect With People",
    desc: "Discover and add people with ease. Build meaningful connections in a click.",
  },
  {
    icon: <RiShieldLine size={22} color="#a78bfa" />,
    title: "Secure Conversations",
    desc: "Your messages stay private. Built with security at the core, not as an afterthought.",
  },
  {
    icon: <RiLayoutLine size={22} color="#a78bfa" />,
    title: "Simple Interface",
    desc: "A clean, distraction-free experience. Everything you need, nothing you don't.",
  },
  {
    icon: <RiFlashlightLine size={22} color="#a78bfa" />,
    title: "Fast Communication",
    desc: "Designed for speed and reliability. Messages arrive before you finish typing.",
  },
  {
    icon: <RiGroupLine size={22} color="#a78bfa" />,
    title: "Group Conversations",
    desc: "Bring teams and friends together. Stay in sync with everyone who matters.",
  },
];

// ─── Steps data ───────────────────────────────────────────────────────────────
const steps = [
  {
    number: "01",
    title: "Create Your Account",
    desc: "Sign up in seconds. No credit card, no fuss. Just your name and you're in.",
  },
  {
    number: "02",
    title: "Connect With People",
    desc: "Find friends and colleagues. Start conversations that actually matter.",
  },
  {
    number: "03",
    title: "Start Chatting",
    desc: "Send messages and communicate in real time. It's that simple.",
  },
];

// ─── Home Page ────────────────────────────────────────────────────────────────
function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ── Scroll detection for navbar ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close menu on resize ──
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Scroll-reveal refs ──
  const featuresSection = useFadeInView(0.1);
  const stepsSection = useFadeInView(0.1);
  const ctaSection = useFadeInView(0.2);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
  ];

  const handleGetStarted = () => navigate("/showUsers");
  const handleLearnMore = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page" id="home">
      {/* ─────────────────────────── NAVBAR ─────────────────────────────── */}
      <nav className={`home-nav ${scrolled ? "scrolled" : ""}`}>
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
                background: "linear-gradient(135deg, #6C63FF, #8B5CF6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 16px rgba(108,99,255,0.5)",
              }}
            >
              <RiMessage3Line size={18} color="#fff" />
            </div>
            <span
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#f4f4f5",
                letterSpacing: "-0.02em",
              }}
            >
              Talky
              <span style={{ color: "#8B5CF6" }}>Talky</span>
            </span>
          </button>

          {/* Desktop Nav Links */}
          <ul
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              listStyle: "none",
            }}
            className="hidden md:flex"
          >
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="nav-link"
                  id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={(e) => {
                    if (link.href.startsWith("#")) {
                      e.preventDefault();
                      document
                        .getElementById(link.href.slice(1))
                        ?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop Buttons */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: "0.75rem" }}>
            {user ? (
              <>
                <button
                  id="nav-dashboard-btn"
                  className="btn-ghost"
                  onClick={() => navigate("/Dashboard")}
                >
                  Dashboard
                </button>
                <button
                  id="nav-getstarted-btn"
                  className="btn-primary"
                  onClick={handleGetStarted}
                >
                  Open Chat <RiArrowRightLine />
                </button>
              </>
            ) : (
              <>
                <button
                  id="nav-login-btn"
                  className="btn-ghost"
                  onClick={() => navigate("/sign-in")}
                >
                  Login
                </button>
                <button
                  id="nav-signup-btn"
                  className="btn-primary"
                  onClick={() => navigate("/sign-up")}
                >
                  Get Started <RiArrowRightLine />
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            id="nav-hamburger-btn"
            className="flex md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: "0.45rem",
              cursor: "pointer",
              color: "#a1a1aa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {menuOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
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
              <div style={{ padding: "1rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    id={`mobile-nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    style={{
                      padding: "0.7rem 0.5rem",
                      color: "#a1a1aa",
                      textDecoration: "none",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      transition: "color 0.15s",
                    }}
                    onClick={(e) => {
                      if (link.href.startsWith("#")) {
                        e.preventDefault();
                        setMenuOpen(false);
                        setTimeout(() => {
                          document
                            .getElementById(link.href.slice(1))
                            ?.scrollIntoView({ behavior: "smooth" });
                        }, 200);
                      }
                    }}
                  >
                    {link.label}
                  </a>
                ))}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.75rem" }}>
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
                        Login
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
      <section
        className="hero-gradient-bg"
        style={{ position: "relative", overflow: "hidden", paddingBottom: "6rem" }}
      >
        {/* Grid background */}
        <div className="grid-overlay" style={{ opacity: 0.5 }} />

        {/* Blurred orbs */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "20%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "-5%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
            filter: "blur(40px)",
          }}
        />

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "6rem 1.5rem 0",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
          className="hero-grid"
        >
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <div className="section-label" style={{ marginBottom: "1.5rem" }}>
              <RiSparklingLine size={13} />
              Real-time messaging, redefined
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "#f4f4f5",
                marginBottom: "1.5rem",
              }}
            >
              Connect.{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #6C63FF 0%, #a78bfa 50%, #EC4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Communicate.
              </span>{" "}
              Together.
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.75,
                color: "#71717a",
                marginBottom: "2.25rem",
                maxWidth: 440,
              }}
            >
              A clean, fast, and secure real-time chat experience. No noise, no
              clutter — just meaningful conversations with the people that matter.
            </p>

            {/* Perks row */}
            <div
              style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}
            >
              {["Instant delivery", "Secure by design", "Always online"].map((perk) => (
                <div
                  key={perk}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.85rem",
                    color: "#a1a1aa",
                  }}
                >
                  <RiCheckLine size={15} color="#22c55e" />
                  {perk}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <button
                id="hero-start-chatting-btn"
                className="btn-primary btn-primary-lg"
                onClick={handleGetStarted}
              >
                Start Chatting <RiArrowRightLine size={18} />
              </button>
              <button
                id="hero-learn-more-btn"
                className="btn-outline-lg"
                onClick={handleLearnMore}
              >
                Learn More
              </button>
            </div>
          </motion.div>

          {/* Right — Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: "100%", maxWidth: 400 }}
            >
              <ChatPreview />
            </motion.div>
          </motion.div>
        </div>

        {/* Responsive hero grid styles */}
        <style>{`
          @media (max-width: 768px) {
            .hero-grid {
              grid-template-columns: 1fr !important;
              gap: 3rem !important;
              padding-top: 4rem !important;
            }
            .hero-grid > div:last-child {
              justify-content: center !important;
            }
          }
        `}</style>
      </section>

      {/* ─────────────────────────── FEATURES ───────────────────────────── */}
      <section
        id="features"
        style={{
          padding: "6rem 1.5rem",
          maxWidth: 1200,
          margin: "0 auto",
        }}
        ref={featuresSection.ref}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={featuresSection.isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <div className="section-label" style={{ justifyContent: "center" }}>
            <RiSparklingLine size={13} />
            Everything you need
          </div>
          <h2
            style={{
              fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#f4f4f5",
              marginBottom: "1rem",
            }}
          >
            Built for real conversations
          </h2>
          <p style={{ color: "#71717a", fontSize: "1.05rem", maxWidth: 520, margin: "0 auto" }}>
            Every feature is designed to get out of your way and let you focus on
            what matters — the people you're talking to.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="feature-card"
              initial={{ opacity: 0, y: 28 }}
              animate={featuresSection.isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              id={`feature-card-${i}`}
            >
              <div className="feature-icon-wrap">{feature.icon}</div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#f4f4f5",
                  marginBottom: "0.6rem",
                }}
              >
                {feature.title}
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#71717a", lineHeight: 1.65 }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────── HOW IT WORKS ───────────────────────── */}
      <section
        id="how-it-works"
        style={{
          background: "rgba(18, 18, 22, 0.6)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "6rem 1.5rem",
        }}
        ref={stepsSection.ref}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={stepsSection.isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <div className="section-label" style={{ justifyContent: "center" }}>
              Simple as 1-2-3
            </div>
            <h2
              style={{
                fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#f4f4f5",
                marginBottom: "1rem",
              }}
            >
              Up and running in minutes
            </h2>
            <p style={{ color: "#71717a", fontSize: "1.05rem", maxWidth: 480, margin: "0 auto" }}>
              Getting started is effortless. No manual, no tutorial needed.
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
              position: "relative",
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
                  background: "rgba(24, 24, 27, 0.7)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 16,
                  padding: "2rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Step background number */}
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1.25rem",
                    fontSize: "4rem",
                    fontWeight: 900,
                    color: "rgba(108,99,255,0.06)",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {step.number}
                </div>

                <div className="step-number" style={{ marginBottom: "1.25rem" }}>
                  {i + 1}
                </div>

                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "#f4f4f5",
                    marginBottom: "0.6rem",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: "0.88rem", color: "#71717a", lineHeight: 1.65 }}>
                  {step.desc}
                </p>

                {/* Connecting arrow (except last) */}
                {i < steps.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      right: "-1.2rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                      display: "none",
                    }}
                    className="step-connector"
                  >
                    <RiArrowRightLine size={20} color="rgba(108,99,255,0.4)" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── CTA SECTION ────────────────────────── */}
      <section
        style={{ padding: "6rem 1.5rem", maxWidth: 1200, margin: "0 auto" }}
        ref={ctaSection.ref}
      >
        <motion.div
          className="cta-section"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={ctaSection.isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            padding: "4.5rem 2rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glow orb */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="section-label" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
              <RiSparklingLine size={13} />
              Join thousands of people
            </div>

            <h2
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: "#f4f4f5",
                marginBottom: "1rem",
                lineHeight: 1.15,
              }}
            >
              Ready to start a conversation?
            </h2>

            <p
              style={{
                color: "#71717a",
                fontSize: "1.05rem",
                marginBottom: "2.5rem",
                maxWidth: 460,
                margin: "0 auto 2.5rem",
              }}
            >
              Join a growing community of people having better, faster, and more
              meaningful conversations every day.
            </p>

            <button
              id="cta-start-chatting-btn"
              className="btn-primary btn-primary-lg"
              onClick={handleGetStarted}
              style={{ fontSize: "1.05rem", padding: "0.9rem 2.5rem" }}
            >
              Start Chatting — It's Free <RiArrowRightLine size={20} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ─────────────────────────── FOOTER ─────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "3rem 1.5rem",
          background: "rgba(9,9,11,0.9)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "2rem",
            alignItems: "start",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "linear-gradient(135deg,#6C63FF,#8B5CF6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RiMessage3Line size={15} color="#fff" />
              </div>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "#f4f4f5" }}>
                Talky<span style={{ color: "#8B5CF6" }}>Talky</span>
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#52525b", maxWidth: 280, lineHeight: 1.65 }}>
              Real-time messaging, designed for humans. Fast, clean, and always
              available.
            </p>
            <p
              style={{ fontSize: "0.78rem", color: "#3f3f46", marginTop: "1.25rem" }}
            >
              © {new Date().getFullYear()} TalkyTalky. All rights reserved.
            </p>
          </div>

          {/* Footer Links */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "3rem",
              justifyContent: "flex-end",
            }}
          >
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.9rem" }}>
                Product
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {["Home", "Features", "How It Works"].map((link) => (
                  <li key={link}>
                    <a
                      id={`footer-link-${link.toLowerCase().replace(/\s+/g, "-")}`}
                      href={link === "Home" ? "#home" : `#${link.toLowerCase().replace(/\s+/g, "-")}`}
                      style={{ fontSize: "0.85rem", color: "#52525b", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#a1a1aa")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#52525b")}
                      onClick={(e) => {
                        e.preventDefault();
                        const id = link === "Home" ? "home" : link.toLowerCase().replace(/\s+/g, "-");
                        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.9rem" }}>
                Legal
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {["Privacy Policy", "Terms of Service"].map((link) => (
                  <li key={link}>
                    <a
                      id={`footer-legal-${link.toLowerCase().replace(/\s+/g, "-")}`}
                      href="#"
                      style={{ fontSize: "0.85rem", color: "#52525b", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#a1a1aa")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#52525b")}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.9rem" }}>
                Account
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[
                  { label: "Sign In", route: "/sign-in" },
                  { label: "Create Account", route: "/sign-up" },
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
                        color: "#52525b",
                        transition: "color 0.2s",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#a1a1aa")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#52525b")}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer responsive */}
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