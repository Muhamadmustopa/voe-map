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
        <div
          style={{
            ...styles.emoji,
            transform: `translateX(${(moodValue - 2) * 20}px) scale(${1 + moodValue * 0.05})`,
          }}
        >
          {moodData.emoji}
        </div>

        {/* LABEL */}
        <h2 style={styles.moodLabel}>
          {moodData.label}
        </h2>

        {/* TEXT SLIDER */}
        <p style={styles.sliderText}>
          Geser untuk menunjukan
          perasaan kamu hari ini
        </p>

        {/* SLIDER */}
        <div style={styles.sliderWrapper}>

          <span style={styles.sliderEmoji}></span>

          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={moodValue}
            onChange={(e) => {

              const val =
                Number(e.target.value);

              setMoodValue(val);

              setMood(
                getMoodData(val).label
              );
            }}
            style={styles.slider}
          />

          <span style={styles.sliderEmoji}></span>
        </div>

        {/* QUESTION */}
        <p style={styles.question}>
          Ceritakan perasaan,
          saran masukan atau keluhan
          kamu tentang lingkungan
          kerja kita ya..
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
    fontSize: "90px",
    textAlign: "center",

    transition:
      "all .35s ease",
  },

  moodLabel: {

    textAlign: "center",

    marginTop: "10px",
    marginBottom: "16px",

    fontSize: "28px",

    color: "#0f172a",

    fontWeight: "700",
  },

  sliderText: {

    textAlign: "center",

    fontSize: "13px",

    color: "#64748b",

    marginBottom: "12px",

    fontWeight: "500",
  },

  sliderWrapper: {

    display: "flex",

    alignItems: "center",

    gap: "12px",

    marginBottom: "24px",
  },

  sliderEmoji: {

    fontSize: "22px",
  },

  slider: {
    width: "100%",

    accentColor: "#6366f1",

    cursor: "pointer",
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
    marginBottom: "100px",
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