import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import {
  getAcceptRequest,
  getReceivedRequests,
  getSentRequests,
  requestFetch,
  usersFetch,
} from "@/service/Api/chatApi";
import { IRequest, IUser } from "@/types/chat";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  RiUserAddLine,
  RiCheckLine,
  RiTimeLine,
  RiMessage3Line,
  RiArrowLeftLine,
  RiArrowRightLine,
} from "react-icons/ri";

// ─── Inline styles ────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#051F20",
    color: "#DAF1DE",
    fontFamily: "'Inter', system-ui, sans-serif",
  } as React.CSSProperties,

  container: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "2.5rem 1.5rem 4rem",
  } as React.CSSProperties,

  header: {
    marginBottom: "2rem",
    background: "#0B2B26",
    borderBottom: "1px solid rgba(142, 182, 155, 0.12)",
    borderRadius: 16,
    padding: "1.35rem 1.5rem",
  } as React.CSSProperties,

  pageTitle: {
    fontSize: "clamp(1.4rem, 3vw, 1.85rem)",
    fontWeight: 700,
    color: "#DAF1DE",
    letterSpacing: "-0.025em",
    fontFamily: "'Syne', 'Inter', sans-serif",
    marginBottom: "0.35rem",
  } as React.CSSProperties,

  pageSubtitle: {
    fontSize: "0.9rem",
    color: "rgba(142, 182, 155, 0.65)",
    fontWeight: 400,
  } as React.CSSProperties,

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.1rem",
  } as React.CSSProperties,

  emptyState: {
    gridColumn: "1 / -1",
    textAlign: "center" as const,
    padding: "4rem 1rem",
    color: "#8EB69B",
    fontSize: "0.95rem",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: "0.5rem",
  } as React.CSSProperties,
} as const;

// ─── User card ────────────────────────────────────────────────────────────────
interface UserCardProps {
  data: IUser;
  request: IRequest | undefined;
  currentUserId: string | undefined;
  onSendRequest: (id: string) => void;
  onAccept: (id: string) => void;
  onChat: () => void;
}

function UserCard({
  data,
  request,
  currentUserId,
  onSendRequest,
  onAccept,
  onChat,
}: UserCardProps) {
  const [hovered, setHovered] = useState(false);

  // ── determine button state ──
  let btn: { label: string; color: "indigo" | "teal" | "muted"; onClick?: () => void } =
    { label: "Connect", color: "indigo", onClick: () => onSendRequest(data._id) };

  if (request) {
    if (request.status === "pending") {
      if (request.sender === currentUserId) {
        btn = { label: "Pending", color: "muted" };
      } else {
        btn = { label: "Accept", color: "teal", onClick: () => onAccept(request._id) };
      }
    } else if (request.status === "accepted") {
      btn = { label: "Open Chat", color: "teal", onClick: onChat };
    } else {
      btn = { label: "Connect", color: "indigo", onClick: () => onSendRequest(data._id) };
    }
  }

  const btnStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.55rem 0",
    borderRadius: 10,
    border: "none",
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: btn.color === "muted" ? "default" : "pointer",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.4rem",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease",
    ...(btn.color === "indigo"
      ? {
          background: "linear-gradient(135deg, #8EB69B, #235347)",
          color: "#051F20",
          boxShadow: hovered ? "0 8px 25px rgba(142, 182, 155, 0.2)" : "none",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
        }
      : btn.color === "teal"
      ? {
          background: "rgba(11, 43, 38, 0.8)",
          color: "#8EB69B",
          border: "1px solid rgba(142, 182, 155, 0.2)",
        }
      : {
          background: "rgba(11, 43, 38, 0.6)",
          color: "rgba(142, 182, 155, 0.65)",
          border: "1px solid rgba(142, 182, 155, 0.12)",
        }),
  };

  const btnIcon =
    btn.label === "Connect" ? (
      <RiUserAddLine size={14} />
    ) : btn.label === "Accept" ? (
      <RiCheckLine size={14} />
    ) : btn.label === "Pending" ? (
      <RiTimeLine size={14} />
    ) : (
      <RiMessage3Line size={14} />
    );

  return (
    <div
      id={`user-card-${data._id}`}
      style={{
        background: hovered ? "#235347" : "#163832",
        border: hovered
          ? "1px solid rgba(142, 182, 155, 0.3)"
          : "1px solid rgba(142, 182, 155, 0.12)",
        borderRadius: 16,
        overflow: "hidden",
        transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.2s",
        boxShadow: hovered
          ? "0 10px 30px rgba(0, 0, 0, 0.25)"
          : "0 4px 16px rgba(0, 0, 0, 0.2)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Profile image — square, object-cover */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          background: "#0B2B26",
          position: "relative",
          borderBottom: "2px solid rgba(142, 182, 155, 0.35)",
        }}
      >
        {data.image?.url ? (
          <img
            src={data.image.url}
            alt={data.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.35s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
          />
        ) : (
          // Fallback avatar with initials
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #163832, #235347)",
              fontSize: "2.5rem",
              fontWeight: 700,
              color: "#DAF1DE",
              fontFamily: "'Syne', sans-serif",
              border: "2px solid rgba(142, 182, 155, 0.35)",
              boxSizing: "border-box",
            }}
          >
            {data.name?.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Online indicator — decorative */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#8EB69B",
            border: "2px solid #051F20",
            boxShadow: "0 0 6px rgba(142, 182, 155, 0.5)",
          }}
        />
      </div>

      {/* Card body */}
      <div style={{ padding: "1rem" }}>
        {/* Name */}
        <p
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "#DAF1DE",
            marginBottom: "0.2rem",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {data.name}
        </p>

        {/* Secondary info — email / role */}
        <p
          style={{
            fontSize: "0.78rem",
            color: "#8EB69B",
            marginBottom: "1rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {data.email || "Software Developer"}
        </p>

        {/* Action button */}
        <button
          id={`user-card-btn-${data._id}`}
          style={btnStyle}
          onClick={btn.onClick}
          disabled={btn.color === "muted"}
          aria-label={`${btn.label} ${data.name}`}
          onMouseEnter={(e) => {
            if (btn.color === "indigo") {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(142, 182, 155, 0.2)";
            } else if (btn.color === "teal") {
              e.currentTarget.style.background = "#163832";
              e.currentTarget.style.borderColor = "#8EB69B";
            }
          }}
          onMouseLeave={(e) => {
            if (btn.color === "indigo") {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            } else if (btn.color === "teal") {
              e.currentTarget.style.background = "rgba(11, 43, 38, 0.8)";
              e.currentTarget.style.borderColor = "rgba(142, 182, 155, 0.2)";
            }
          }}
        >
          {btnIcon}
          {btn.label}
        </button>
      </div>
    </div>
  );
}

// ─── ShowUsers page ───────────────────────────────────────────────────────────
function ShowUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState<IRequest[]>([]);
  console.log("requests", requests);
  const [receivedRequests, setReceivedRequests] = useState<IRequest[]>([]);
  console.log("receivedRequests", receivedRequests);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();
  console.log("users:", users);
  console.log("requests:", requests);

  useEffect(() => {
    fetchUsers();
    fetchSentRequests();
    fetchReceivedRequests();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const response = await usersFetch(page, 4);
      console.log("response fetchUsers", response);
      console.log("Array?", Array.isArray(response));
      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      // setLoadingUsers(false);
    }
  };

  const sendRequest = async (userId: string) => {
    try {
      console.log("enter sendRequest", userId);
      const response = await requestFetch(userId);
      console.log("sendRequest++", response.data);
      setRequests((prev) => [...prev, response.data]);
      toast.success("Request sent");
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to send request");
    }
  };

  const fetchSentRequests = async () => {
    try {
      const response = await getSentRequests();
      console.log("SENT REQUESTS:", response.data);
      setRequests(response.data ?? []);
    } catch (error) {
      console.error("error", error);
      toast.error("Failed to send request");
    }
  };

  const fetchReceivedRequests = async () => {
    try {
      const response = await getReceivedRequests();
      console.log("RECEIVED REQUESTS:", response.data);
      setReceivedRequests(response.data ?? []);
    } catch (error) {
      console.error("Error fetching received requests:", error);
    }
  };

  const fetchAcceptRequest = async (requestId: string) => {
    try {
      const response = await getAcceptRequest(requestId);
      console.log("Accepted response:", response.data);
      setReceivedRequests((prev) =>
        prev.map((request) =>
          request._id === requestId ? { ...request, status: "accepted" } : request
        )
      );
      toast.success("Request accepted");
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // ── pagination helpers ──
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const paginationBtnBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.5rem 1.1rem",
    borderRadius: 10,
    fontSize: "0.85rem",
    fontWeight: 600,
    fontFamily: "inherit",
    border: "1px solid rgba(142, 182, 155, 0.2)",
    cursor: "pointer",
    transition: "background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s",
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* ── Page header ── */}
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Discover People</h1>
          <p style={styles.pageSubtitle}>
            Find and connect with others — start a conversation.
          </p>
        </div>

        {/* ── User grid ── */}
        <div style={styles.grid}>
          {users.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#235347", border: "1px solid rgba(142, 182, 155, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.25rem" }}>
                <RiUserAddLine size={22} color="#8EB69B" />
              </div>
              <p style={{ color: "#DAF1DE", fontWeight: 600, fontSize: "0.95rem" }}>No users found</p>
              <p style={{ color: "#8EB69B", fontSize: "0.82rem" }}>Try a different page or check back later.</p>
            </div>
          ) : (
            users.map((data) => {
              const allRequests = [...requests, ...receivedRequests];
              console.log("allRequest", allRequests);

              const request = allRequests.find(
                (req) =>
                  (req.sender === user?.id && req.receiver === data._id) ||
                  (req.receiver === user?.id && req.sender === data._id)
              );

              console.log("Logged user:", user?.id);
              console.log("User card:", data._id);
              console.log("Request found:", request);

              return (
                <UserCard
                  key={data._id}
                  data={data}
                  request={request}
                  currentUserId={user?.id}
                  onSendRequest={sendRequest}
                  onAccept={fetchAcceptRequest}
                  onChat={() => navigate("/Dashboard")}
                />
              );
            })
          )}
        </div>

        {/* ── Pagination ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.85rem",
            marginTop: "3rem",
          }}
        >
          {/* Previous */}
          <button
            id="pagination-prev"
            disabled={!canGoPrev}
            onClick={() => setPage((prev) => prev - 1)}
            style={{
              ...paginationBtnBase,
              background: canGoPrev ? "rgba(11, 43, 38, 0.8)" : "rgba(11, 43, 38, 0.4)",
              color: canGoPrev ? "#8EB69B" : "rgba(142, 182, 155, 0.35)",
              borderColor: canGoPrev ? "rgba(142, 182, 155, 0.2)" : "rgba(142, 182, 155, 0.1)",
              cursor: canGoPrev ? "pointer" : "not-allowed",
            }}
            aria-label="Previous page"
            onMouseEnter={(e) => {
              if (canGoPrev) {
                e.currentTarget.style.background = "#163832";
                e.currentTarget.style.borderColor = "#8EB69B";
              }
            }}
            onMouseLeave={(e) => {
              if (canGoPrev) {
                e.currentTarget.style.background = "rgba(11, 43, 38, 0.8)";
                e.currentTarget.style.borderColor = "rgba(142, 182, 155, 0.2)";
              }
            }}
          >
            <RiArrowLeftLine size={15} />
            Previous
          </button>

          {/* Page indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              padding: "0.45rem 1rem",
              background: "#0B2B26",
              border: "1px solid rgba(142, 182, 155, 0.15)",
              borderRadius: 10,
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#8EB69B",
              minWidth: 80,
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#DAF1DE" }}>{page}</span>
            <span style={{ color: "rgba(142, 182, 155, 0.65)", margin: "0 2px" }}>/</span>
            <span style={{ color: "#8EB69B" }}>{totalPages}</span>
          </div>

          {/* Next */}
          <button
            id="pagination-next"
            disabled={!canGoNext}
            onClick={() => setPage((prev) => prev + 1)}
            style={{
              ...paginationBtnBase,
              background: canGoNext ? "rgba(11, 43, 38, 0.8)" : "rgba(11, 43, 38, 0.4)",
              color: canGoNext ? "#8EB69B" : "rgba(142, 182, 155, 0.35)",
              borderColor: canGoNext ? "rgba(142, 182, 155, 0.2)" : "rgba(142, 182, 155, 0.1)",
              cursor: canGoNext ? "pointer" : "not-allowed",
            }}
            aria-label="Next page"
            onMouseEnter={(e) => {
              if (canGoNext) {
                e.currentTarget.style.background = "#163832";
                e.currentTarget.style.borderColor = "#8EB69B";
              }
            }}
            onMouseLeave={(e) => {
              if (canGoNext) {
                e.currentTarget.style.background = "rgba(11, 43, 38, 0.8)";
                e.currentTarget.style.borderColor = "rgba(142, 182, 155, 0.2)";
              }
            }}
          >
            Next
            <RiArrowRightLine size={15} />
          </button>
        </div>
      </div>

      {/* Responsive grid style */}
      <style>{`
        @media (max-width: 640px) {
          #show-users-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          #show-users-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ShowUsers;
