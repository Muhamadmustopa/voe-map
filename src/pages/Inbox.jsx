import { useState } from "react";
import { Mail } from "lucide-react";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export default function Inbox({
  history,
}) {

  const [openId, setOpenId] =
    useState(null);

  const formatDate = (
    timestamp
  ) => {

    if (!timestamp) return "-";

    const date =
      timestamp.toDate();

    return date.toLocaleString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =========================
  // OPEN REPLY
  // =========================
  const openReply = async (
    item
  ) => {

    setOpenId(
      openId === item.id
        ? null
        : item.id
    );

    // tandai sudah dibaca
    if (!item.replyRead) {

      try {

        await updateDoc(
          doc(
            db,
            "moods",
            item.id
          ),
          {
            replyRead: true,
          }
        );

      } catch (err) {

        console.log(err);
      }
    }
  };

  // FILTER REPLY
  const replies = history.filter(
    (item) => item.reply
  );

  return (
    <div>

      {/* TITLE */}
      <div style={styles.header}>

        <h1 style={styles.title}>
          📩 Inbox
        </h1>
      </div>

      {/* EMPTY */}
      {replies.length === 0 && (

        <div style={styles.emptyCard}>

          <div style={styles.emptyEmoji}>
            <Mail size={58} />
          </div>

          <h3 style={styles.emptyTitle}>
            Belum ada balasan
          </h3>

          <p style={styles.emptyText}>
            Feedback-mu sudah kami terima. Kami akan senantiasa berupaya terbaik menindaklanjuti feedback yang kamu sampaikan untuk kebaikan bersama.</p>

        </div>
      )}

      {/* LIST */}
      {replies.map((item) => (

        <div
          key={item.id}
          style={styles.card}
          onClick={() =>
            openReply(item)
          }
        >

          {/* USER SIDE */}
          <div style={styles.userBubble}>

            <div style={styles.date}>
              🕒{" "}
              {formatDate(
                item.createdAt
              )}
            </div>

            <p style={styles.label}>
              Today's Mood
            </p>

            <p style={styles.value}>
              {item.mood}
            </p>

            <p style={styles.label}>
              My Story
            </p>

            <p style={styles.story}>
              {item.note}
            </p>

          </div>

          {/* ADMIN REPLY */}
          <div style={styles.replyBox}>

            <div style={styles.replyHeader}>

              <span>
                💬 HRDGA Reply
              </span>

              <span
                style={
                  styles.replyDate
                }
              >
                {formatDate(
                  item.replyAt
                )}
              </span>

            </div>

            {/* EXPAND */}
            {openId === item.id && (

              <p style={styles.replyText}>
                {item.reply}
              </p>

            )}

            {/* COLLAPSE */}
            {openId !== item.id && (

              <p
                style={
                  styles.tapText
                }
              >
                Tap untuk melihat
                balasan
              </p>

            )}

          </div>

        </div>
      ))}
    </div>
  );
}

const styles = {

  header: {
    marginBottom: "25px",
  },

  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "5px",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "15px",
  },

  emptyCard: {

    background:
      "rgba(255,255,255,0.7)",

    backdropFilter:
      "blur(20px)",

    borderRadius: "30px",

    padding: "40px 20px",

    textAlign: "center",

    boxShadow:
      "0 10px 35px rgba(0,0,0,0.08)",
  },

  emptyEmoji: {

  width: "90px",

  height: "90px",

  margin: "0 auto 18px",

  borderRadius: "50%",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  background:
    "linear-gradient(135deg,#dbeafe,#bfdbfe)",

  color: "#2563eb",

  boxShadow:
    "0 10px 25px rgba(37,99,235,.18)",
},

  emptyTitle: {
    color: "#0f172a",
    marginBottom: "10px",
  },

  emptyText: {
    color: "#64748b",
    lineHeight: "1.6",
  },

  card: {

    background:
      "rgba(255,255,255,0.72)",

    backdropFilter:
      "blur(20px)",

    padding: "18px",

    borderRadius: "28px",

    marginBottom: "18px",

    boxShadow:
      "0 10px 35px rgba(0,0,0,0.08)",

    cursor: "pointer",

    transition: ".25s",
  },

  userBubble: {

    background:
      "linear-gradient(135deg,#eef2ff,#f5f3ff)",

    padding: "16px",

    borderRadius: "22px",

    marginBottom: "15px",
  },

  date: {

    fontSize: "12px",

    color: "#64748b",

    marginBottom: "12px",

    fontWeight: "600",
  },

  label: {

    color: "#6366f1",

    fontWeight: "700",

    fontSize: "13px",

    marginBottom: "4px",
  },

  value: {

    color: "#0f172a",

    fontWeight: "700",

    fontSize: "18px",

    marginBottom: "12px",
  },

  story: {

    color: "#334155",

    lineHeight: "1.7",

    fontSize: "14px",
  },

  replyBox: {

    background:
      "linear-gradient(135deg,#dbeafe,#eff6ff)",

    padding: "18px",

    borderRadius: "22px",

    border:
      "1px solid #bfdbfe",
  },

  replyHeader: {

    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    color: "#1d4ed8",

    fontWeight: "700",

    marginBottom: "10px",
  },

  replyText: {

    color: "#1e3a8a",

    lineHeight: "1.7",

    fontSize: "14px",
  },

  replyDate: {

    fontSize: "11px",

    color: "#64748b",

    fontWeight: "600",
  },

  tapText: {

    color: "#64748b",

    fontSize: "13px",

    fontStyle: "italic",
  },
};