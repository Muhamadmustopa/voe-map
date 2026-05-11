import { useState } from "react";

export default function History({
  history,
}) {

  const [openIndex, setOpenIndex] =
    useState(null);

  const getMoodEmoji = (mood) => {

    if (mood === "Unhappy")
      return "😢";

    if (mood === "Normal")
      return "🙂";

    return "😄";
  };

  const formatDate = (
    timestamp
  ) => {

    if (!timestamp) return "-";

    const date =
      timestamp.toDate();

    return date.toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (

    <div>

      {/* HEADER */}
      <div style={styles.header}>

        <h1 style={styles.title}>
          📅 History
        </h1>

      </div>

      {/* EMPTY */}
      {history.length === 0 && (

        <div style={styles.emptyCard}>

          <div style={styles.emptyEmoji}>
            📝
          </div>

          <h3 style={styles.emptyTitle}>
            Belum ada history
          </h3>

          <p style={styles.emptyText}>
            Data mood akan muncul
            disini
          </p>

        </div>
      )}

      {/* LIST */}
      {history.map((item, i) => (

        <div
          key={i}
          style={styles.card}
          onClick={() =>
            setOpenIndex(
              openIndex === i
                ? null
                : i
            )
          }
        >

          {/* TOP */}
          <div style={styles.top}>

            <div style={styles.left}>

              <div style={styles.emoji}>
                {getMoodEmoji(
                  item.mood
                )}
              </div>

              <div>

                <h3 style={styles.mood}>
                  {item.mood}
                </h3>

                <p style={styles.date}>
                  {formatDate(
                    item.createdAt
                  )}
                </p>

              </div>

            </div>

            <div style={styles.arrow}>
              {openIndex === i
                ? "−"
                : "+"}
            </div>

          </div>

          {/* STORY */}
          {openIndex === i && (

            <div style={styles.storyBox}>

              <p style={styles.story}>
                {item.note || "-"}
              </p>

            </div>
          )}

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

    fontSize: "70px",

    marginBottom: "15px",
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
      "rgba(255,255,255,0.75)",

    backdropFilter:
      "blur(20px)",

    borderRadius: "24px",

    padding: "18px",

    marginBottom: "16px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",

    cursor: "pointer",

    transition: ".25s",
  },

  top: {

    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  left: {

    display: "flex",

    alignItems: "center",

    gap: "14px",
  },

  emoji: {

    width: "55px",

    height: "55px",

    borderRadius: "50%",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "25px",

    background:
      "linear-gradient(135deg,#6366f1,#8b5cf6)",

    color: "white",

    boxShadow:
      "0 8px 20px rgba(99,102,241,.3)",
  },

  mood: {

    color: "#0f172a",

    fontWeight: "700",

    marginBottom: "4px",
  },

  date: {

    color: "#64748b",

    fontSize: "13px",
  },

  arrow: {

    fontSize: "28px",

    fontWeight: "300",

    color: "#6366f1",
  },

  storyBox: {

    marginTop: "18px",

    paddingTop: "15px",

    borderTop:
      "1px solid #e2e8f0",
  },

  story: {

    color: "#334155",

    lineHeight: "1.8",

    fontSize: "14px",
  },
};