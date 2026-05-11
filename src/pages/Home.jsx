export default function Home({
  user,
  mood,
  setMood,
  moodValue,
  setMoodValue,
  note,
  setNote,
  submitData,
  getMoodData,
}) {

  const moodData = getMoodData(moodValue);

  return (
    <div className="fade-in">

      {/* HEADER */}
      <div style={styles.header}>

        <div>
          <h2 style={styles.greeting}>
            Hi,
          </h2>

          <h1 style={styles.name}>
            {user.displayName}
          </h1>
        </div>

        <div style={styles.avatar}>
          😊
        </div>

      </div>

      {/* MAIN CARD */}
      <div style={styles.card}>

        {/* EMOJI */}
        <div style={styles.emoji}>
          {moodData.emoji}
        </div>

        {/* LABEL */}
        <h2 style={styles.moodLabel}>
          {moodData.label}
        </h2>

        {/* SLIDER */}
        <input
          type="range"
          min="1"
          max="3"
          value={moodValue}
          onChange={(e) => {

            const val = Number(e.target.value);

            setMoodValue(val);

            setMood(
              getMoodData(val).label
            );
          }}
          style={styles.slider}
        />

        {/* QUESTION */}
        <p style={styles.question}>
          Ceritakan perasaan,
          saran, atau keluhan
          kamu tentang lingkungan kerja kita ya..,
        </p>

        {/* TEXTAREA */}
        <textarea
          placeholder="Tulis disini..."
          value={note}
          onChange={(e) =>
            setNote(e.target.value)
          }
          style={styles.textarea}
        />

        {/* BUTTON */}
        <button
          onClick={submitData}
          style={styles.button}
        >
          Submit!
        </button>

      </div>

    </div>
  );
}

const styles = {

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: "25px",
  },

  greeting: {
    fontSize: "18px",
    fontWeight: "500",

    color: "#64748b",
  },

  name: {
    fontSize: "30px",
    fontWeight: "800",

    color: "#0f172a",

    marginTop: "4px",
  },

  avatar: {

    width: "60px",
    height: "60px",

    borderRadius: "50%",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "28px",

    background:
      "linear-gradient(135deg,#6366f1,#8b5cf6)",

    color: "white",

    boxShadow:
      "0 10px 25px rgba(99,102,241,.35)",
  },

  card: {

    background:
      "rgba(255,255,255,0.78)",

    backdropFilter:
      "blur(20px)",

    border:
      "1px solid rgba(255,255,255,0.3)",

    borderRadius: "32px",

    padding: "25px",

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.08)",
  },

  emoji: {
    fontSize: "85px",
    textAlign: "center",
  },

  moodLabel: {

    textAlign: "center",

    marginTop: "10px",
    marginBottom: "20px",

    fontSize: "28px",

    color: "#0f172a",

    fontWeight: "700",
  },

  slider: {
    width: "100%",
    marginBottom: "25px",

    accentColor: "#6366f1",
  },

  question: {

    textAlign: "center",

    lineHeight: "1.7",

    color: "#475569",

    fontSize: "15px",

    marginBottom: "20px",
  },

  textarea: {

    width: "100%",

    minHeight: "130px",

    borderRadius: "22px",

    border:
      "1px solid #dbeafe",

    padding: "16px",

    background: "#fff",

    color: "#0f172a",

    resize: "none",

    fontSize: "15px",

    outline: "none",

    boxSizing: "border-box",

    boxShadow:
      "inset 0 2px 6px rgba(0,0,0,0.04)",
  },

  button: {

    width: "100%",

    marginTop: "22px",

    padding: "16px",

    border: "none",

    borderRadius: "20px",

    background:
      "linear-gradient(135deg,#6366f1,#8b5cf6)",

    color: "white",

    fontWeight: "700",

    fontSize: "16px",

    cursor: "pointer",

    boxShadow:
      "0 12px 30px rgba(99,102,241,.35)",

    transition: ".3s",
  },
};