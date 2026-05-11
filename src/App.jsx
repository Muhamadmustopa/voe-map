import { useState, useEffect } from "react";
import { auth, provider, db } from "./firebase";

import {
  signInWithPopup,
  signOut,
} from "firebase/auth";

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import Navbar from "./components/Navbar";
import LogoutModal from "./components/LogoutModal";

import Home from "./pages/Home";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import Inbox from "./pages/Inbox";
import Admin from "./pages/Admin";

export default function App() {

  // =========================
  // STATE
  // =========================
  const [user, setUser] = useState(null);

  const [menu, setMenu] = useState("home");

  const [mood, setMood] = useState("");

  const [note, setNote] = useState("");

  const [history, setHistory] = useState([]);

  const [allData, setAllData] = useState([]);

  const [moodValue, setMoodValue] = useState(2);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  // =========================
  // ADMIN
  // =========================
  const isAdmin =
    user?.email === "muhamadtopa08@gmail.com";

  // =========================
  // MOOD DATA
  // =========================
  const getMoodData = (value) => {
    if (value <= 1) {
      return {
        label: "Unhappy",
        emoji: "😢",
      };
    }

    if (value === 2) {
      return {
        label: "Normal",
        emoji: "🙂",
      };
    }

    return {
      label: "Happy",
      emoji: "😄",
    };
  };

  // =========================
  // LOGIN
  // =========================
  const login = async () => {

  provider.setCustomParameters({
    prompt: "select_account",
  });

  const res = await signInWithPopup(
    auth,
    provider
  );

  setUser(res.user);
};

  // =========================
  // LOGOUT
  // =========================
  const confirmLogout = async () => {
    await signOut(auth);

    setUser(null);

    setShowLogoutModal(false);
  };

  // =========================
  // ANALYZE TEXT
  // =========================
  const analyzeText = (text) => {
    const lower = text.toLowerCase();

    if (
      lower.includes("tolong") ||
      lower.includes("masalah") ||
      lower.includes("error") ||
      lower.includes("perbaiki") ||
      lower.includes("segera") ||
      lower.includes("urgent") ||
      lower.includes("bantu") ||
      lower.includes("kendala") ||
      lower.includes("komplain") ||
      lower.includes("bermasalah") ||
      lower.includes("belum proses") ||
      lower.includes("gagal") ||
      lower.includes("tidak bisa") ||
      lower.includes("lama") ||
      lower.includes("lambat") ||
      lower.includes("tidak berfungsi") ||
      lower.includes("mati") ||
      lower.includes("mohon") ||
      lower.includes("mendesak") ||
      lower.includes("bantuan") ||
      lower.includes("rusak")
    ) {
      return "need_follow_up";
    }

    if (
      lower.includes("keren") ||
      lower.includes("bagus") ||
      lower.includes("baik") ||
      lower.includes("ok") ||
      lower.includes("oke") ||
      lower.includes("mantap") ||
      lower.includes("cepat") ||
      lower.includes("memuaskan") ||
      lower.includes("terima kasih") ||
      lower.includes("nyaman") ||
      lower.includes("suka") ||
      lower.includes("luar biasa") ||
      lower.includes("puas") ||
      lower.includes("hebat") ||
      lower.includes("mantap")
    ) {
      return "appreciate";
    }

    return "stories";
  };

  // =========================
  // SUBMIT DATA
  // =========================
  const submitData = async () => {

    if (!mood) {
      return alert("Pilih mood dulu");
    }

    const category = analyzeText(note);

    await addDoc(collection(db, "moods"), {
  userId: user.uid,
  email: user.email,
  name: user.displayName,
  mood,
  note,
  category,
  createdAt: serverTimestamp(),
  });

    setNote("");

    alert("Data berhasil dikirim");
  };

  // =========================
  // HISTORY USER
  // =========================
  useEffect(() => {

    if (!user) return;

    const q = query(
      collection(db, "moods"),

      where("userId", "==", user.uid),

      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHistory(data.slice(0, 7));
    });

    return () => unsub();

  }, [user]);

  // =========================
  // ADMIN ALL DATA
  // =========================
  useEffect(() => {

    const q = query(
      collection(db, "moods"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllData(data);

    });

    return () => unsub();

  }, []);


  // =========================
  // LOGIN PAGE
  // =========================
  // =========================
// LOGIN PAGE
// =========================
if (!user) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#eef2ff,#f8fafc)",
        padding: "20px",
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "white",
          borderRadius: "32px",
          padding: "40px 28px",
          boxShadow:
            "0 20px 45px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >

        {/* LOGO */}
        <img
          src="/logo.png"
          alt="Company Logo"
          style={{
            width: "90px",
            height: "90px",
            objectFit: "contain",
            marginBottom: "18px",
          }}
        />

        {/* TITLE */}
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "800",
            color: "#0f172a",
            marginBottom: "8px",
          }}
        >
          Mind Share MAP
        </h1>

        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "30px",
          }}
        >
          Employee Mood & Story Platform
          HRDGA Internal System
        </p>

        {/* LOGIN BUTTON */}
        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "18px",
            border: "none",
            background:
              "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "white",
            fontWeight: "700",
            fontSize: "15px",
            cursor: "pointer",
            boxShadow:
              "0 10px 25px rgba(99,102,241,.35)",
          }}
        >
          Login dengan Google
        </button>
      </div>
    </div>
  );
}
    const unreadInbox = history.filter(
    (item) =>
      item.reply &&
      !item.replyRead
  ).length;
  // =========================
  // MAIN APP
  // =========================
  return (
    <div
  style={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f4f6f8",
  }}
  >

      {/* CONTENT */}
      <div
  style={{
    flex: 1,
    padding: 20,
    paddingBottom: "180px",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
  }}
>
        {menu === "home" && (
          <Home
            user={user}
            mood={mood}
            setMood={setMood}
            moodValue={moodValue}
            setMoodValue={setMoodValue}
            note={note}
            setNote={setNote}
            submitData={submitData}
            getMoodData={getMoodData}
          />
        )}

        {menu === "history" && (
          <History history={history} />
        )}

        {menu === "analytics" && (
         <Analytics
          history={isAdmin? allData: history} />
        )}

        {menu === "inbox" && (
         <Inbox history={history} />
        )}

        {menu === "admin" && isAdmin && (
          <Admin allData={allData} />
        )}

      </div>

      {/* NAVBAR */}
      <Navbar
        menu={menu}
        setMenu={setMenu}
        onLogout={() =>
        setShowLogoutModal(true)
      }
      isAdmin={isAdmin}
      unreadInbox={unreadInbox}
      />

      {/* LOGOUT MODAL */}
      <LogoutModal
        show={showLogoutModal}
        onClose={() =>
          setShowLogoutModal(false)
        }
        onConfirm={confirmLogout}
      />

    </div>
  );
}