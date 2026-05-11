import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
} from "recharts";

export default function Analytics({ history }) {

  // =========================
  // TOTAL MOOD
  // =========================
  const unhappy = history.filter(
    (h) => h.mood === "Unhappy"
  ).length;

  const normal = history.filter(
    (h) => h.mood === "Normal"
  ).length;

  const happy = history.filter(
    (h) => h.mood === "Happy"
  ).length;

  // =========================
  // PIE DATA
  // =========================
  const pieData = [
    {
      name: "Unhappy 😢",
      value: unhappy,
    },
    {
      name: "Normal 🙂",
      value: normal,
    },
    {
      name: "Happy 😄",
      value: happy,
    },
  ];

  // =========================
  // BAR DATA
  // =========================
  const barData = [
    {
      mood: "😢",
      total: unhappy,
    },
    {
      mood: "🙂",
      total: normal,
    },
    {
      mood: "😄",
      total: happy,
    },
  ];

  // =========================
  // COLORS
  // =========================
  const COLORS = [
    "#ef4444",
    "#f59e0b",
    "#10b981",
  ];

  return (
    <div>

      {/* HEADER */}
      <div style={styles.header}>

        <h1 style={styles.title}>
          📊 Analytics
        </h1>

        <p style={styles.subtitle}>
          Employee mood statistic
        </p>

      </div>

      {/* TOTAL */}
      <div style={styles.totalCard}>

        <h2 style={styles.totalNumber}>
          {history.length}
        </h2>

        <p style={styles.totalLabel}>
          Total Mood Submit
        </p>

      </div>

      {/* PIE CHART */}
      <div style={styles.chartCard}>

        <h3 style={styles.chartTitle}>
          Mood Distribution
        </h3>

        <ResponsiveContainer
          width="100%"
          height={260}
        >

          <PieChart>

            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={85}
              dataKey="value"
              label
            >

              {pieData.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index]}
                />

              ))}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* BAR CHART */}
      <div style={styles.chartCard}>

        <h3 style={styles.chartTitle}>
          Favorite Emoji
        </h3>

        <ResponsiveContainer
          width="100%"
          height={260}
        >

          <BarChart data={barData}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="mood" />

            <YAxis allowDecimals={false} /> 

            <Tooltip />

            <Bar
              dataKey="total"
              radius={[10,10,0,0]}
            >

              {barData.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index]}
                />

              ))}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* DETAIL CARD */}
      <div style={styles.detailCard}>

        <div style={styles.detailItem}>
          <span style={styles.detailEmoji}>
            😢
          </span>

          <div>
            <h3 style={styles.detailTitle}>
              Unhappy
            </h3>

            <p style={styles.detailValue}>
              {unhappy} User
            </p>
          </div>
        </div>

        <div style={styles.detailItem}>
          <span style={styles.detailEmoji}>
            🙂
          </span>

          <div>
            <h3 style={styles.detailTitle}>
              Normal
            </h3>

            <p style={styles.detailValue}>
              {normal} User
            </p>
          </div>
        </div>

        <div style={styles.detailItem}>
          <span style={styles.detailEmoji}>
            😄
          </span>

          <div>
            <h3 style={styles.detailTitle}>
              Happy
            </h3>

            <p style={styles.detailValue}>
              {happy} User
            </p>
          </div>
        </div>

      </div>

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

  totalCard: {

    background:
      "linear-gradient(135deg,#6366f1,#8b5cf6)",

    borderRadius: "28px",

    padding: "30px",

    textAlign: "center",

    color: "white",

    marginBottom: "22px",

    boxShadow:
      "0 15px 35px rgba(99,102,241,.35)",
  },

  totalNumber: {

    fontSize: "52px",

    margin: 0,
  },

  totalLabel: {

    opacity: 0.9,

    marginTop: "10px",

    fontSize: "15px",
  },

  chartCard: {

    background:
      "rgba(255,255,255,0.78)",

    backdropFilter:
      "blur(20px)",

    borderRadius: "28px",

    padding: "20px",

    marginBottom: "20px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  chartTitle: {

    color: "#0f172a",

    marginBottom: "15px",

    fontSize: "18px",

    fontWeight: "700",
  },

  detailCard: {

    background:
      "rgba(255,255,255,0.78)",

    backdropFilter:
      "blur(20px)",

    borderRadius: "28px",

    padding: "20px",

    marginBottom: "100px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  detailItem: {

    display: "flex",

    alignItems: "center",

    gap: "15px",

    padding: "15px 0",

    borderBottom:
      "1px solid rgba(0,0,0,0.05)",
  },

  detailEmoji: {

    fontSize: "34px",
  },

  detailTitle: {

    margin: 0,

    color: "#0f172a",

    fontSize: "17px",
  },

  detailValue: {

    marginTop: "4px",

    color: "#64748b",

    fontSize: "14px",
  },
};