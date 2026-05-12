import {
  Home,
  Calendar,
  BarChart3,
  Inbox,
  ShieldCheck,
  LogOut,
} from "lucide-react";

export default function Navbar({
  menu,
  setMenu,
  onLogout,
  isAdmin,
  unreadInbox,
}) {

  return (

    <div style={styles.wrapper}>

      <NavItem
        icon={<Home size={22} />}
        label="Home"
        active={menu === "home"}
        onClick={() => setMenu("home")}
      />

      <NavItem
        icon={<Calendar size={22} />}
        label="History"
        active={menu === "history"}
        onClick={() => setMenu("history")}
      />

      <NavItem
        icon={<BarChart3 size={22} />}
        label="Analytics"
        active={menu === "analytics"}
        onClick={() => setMenu("analytics")}
      />

      {/* INBOX WITH NOTIFICATION */}
      <NavItem
        icon={
          <div style={{ position: "relative" }}>

            <Inbox size={22} />

            {unreadInbox > 0 && (
              <span style={styles.badge}></span>
            )}

          </div>
        }
        label="Inbox"
        active={menu === "inbox"}
        onClick={() => setMenu("inbox")}
      />

      {isAdmin && (
        <NavItem
          icon={<ShieldCheck size={22} />}
          label="Admin"
          active={menu === "admin"}
          onClick={() => setMenu("admin")}
        />
      )}

      <NavItem
        icon={<LogOut size={22} />}
        label="Logout"
        active={false}
        onClick={onLogout}
      />

    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}) {

  return (

    <div
      onClick={onClick}
      style={{
        ...styles.item,

        color:
          active
            ? "#1e3a8a"
            : "#334155",

        transform:
          active
            ? "translateY(-4px)"
            : "translateY(0)",

        background:
          active
            ? "white"
            : "transparent",

        boxShadow:
          active
            ? "0 8px 25px rgba(99,102,241,.35)"
            : "none",
      }}
    >

      {icon}

      <span style={styles.label}>
        {label}
      </span>

    </div>
  );
}

const styles = {

  wrapper: {

    position: "fixed",

    bottom: "max(18px, env(safe-area-inset-bottom))",

    left: "50%",

    transform: "translateX(-50%)",

    width: "94%",

    maxWidth: "400px",

    display: "flex",

    justifyContent: "space-around",

    alignItems: "center",

    padding: "14px 10px",

    borderRadius: "30px",

    background:
      "rgba(255,255,255,0.12)",

    backdropFilter:
      "blur(20px)",

    border:
      "1px solid rgba(255,255,255,0.2)",

    boxShadow:
      "0 8px 32px rgba(0,0,0,0.2)",

    zIndex: 999,
  },

  item: {

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    gap: "4px",

    padding: "8px 10px",

    borderRadius: "16px",

    transition: ".25s",

    cursor: "pointer",

    minWidth: "55px",

    position: "relative",
  },

  label: {

    fontSize: "10px",

    fontWeight: "600",
  },

  /* RED NOTIFICATION DOT */
  badge: {

    position: "absolute",

    top: "-2px",

    right: "-2px",

    width: "10px",

    height: "10px",

    borderRadius: "50%",

    background: "#ef4444",

    border: "2px solid white",

    boxShadow:
      "0 0 10px rgba(239,68,68,.6)",
  },
};