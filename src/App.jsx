import { useState, useEffect } from "react";
import { auth, provider, db } from "./firebase";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
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

  const [menu, setMenu] = useState(localStorage.getItem("menu") || "home");

  const [mood, setMood] = useState("");

  const [note, setNote] = useState("");

  const [history, setHistory] = useState([]);

  const [allData, setAllData] = useState([]);

  const [moodValue, setMoodValue] =
    useState(2);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  // =========================
  // SAVE MENU
 useEffect(() => {

  localStorage.setItem(
    "menu",
    menu
  );

}, [menu]);
  // =========================
  // ADMIN
  // =========================
 const adminEmails = [
  "muhamadtopa08@gmail.com",
  "hrdga@mitraasa.co.id",
  "career@mitraasa.co.id",
  "hrd@mitraasa.co.id",
];

const isAdmin =
  adminEmails.includes(user?.email);

const isMobile =
  /Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent);
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

  await signInWithPopup(
    auth,
    provider
  );
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
  };

  useEffect(() => {

  const unsub =
    onAuthStateChanged(
      auth,
      (currentUser) => {

        setUser(currentUser);
      }
    );

  return () => unsub();

}, []);
  // =========================
  // HISTORY USER
  // =========================
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

  const unsub = onSnapshot(

    q,

    (snapshot) => {

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // USER HISTORY
      setHistory(data);
    },

    (error) => {
      console.error(error);
    }
  );

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
            width: "240px",
            height: "240px",
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
        >VoE MAP</h1>

        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "30px",
          }}
        >Voice of Employee & Story Platform</p>

        {/* LOGIN BUTTON */}
        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "14px 18px",
            borderRadius: "14px",
            border: "1px solid #000",
            background: "#fff",
            color: "#000",
            fontWeight: "600",
            fontSize: "15px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            transition: "all .25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f5f5f5";
            e.currentTarget.style.boxShadow =
              "0 6px 18px rgba(0,0,0,.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            style={{
              width: "22px",
              height: "22px",
            }}
          />

      <span>Sign in with Google</span>
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
  const pendingCount = allData.filter(
  (item) =>
    item.status !== "replied"
).length;

// =========================
// BLOCK DESKTOP FOR USER
// =========================
if (!isAdmin && !isMobile) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
        background:
          "linear-gradient(135deg,#eef2ff,#f8fafc)",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "24px",
          maxWidth: "400px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            fontSize: "60px",
            marginBottom: "10px",
          }}
        >
          📱
        </div>

        <h2
          style={{
            color: "#0f172a",
            marginBottom: "10px",
          }}
        >
          Mobile Device Required
        </h2>

        <p
          style={{
            color: "#64748b",
            lineHeight: "1.6",
          }}
        >
          Aplikasi VoE MAP hanya dapat digunakan
          melalui perangkat mobile. Silakan buka
          kembali menggunakan smartphone Anda.
        </p>
      </div>
    </div>
  );
}
  // =========================
  // MAIN APP
  // =========================

    return (
  <div
    style={{
      minHeight: "100vh",

      width: "100%",

      maxWidth: "430px",

      margin: "0 auto",

      position: "relative",

      background:
        "linear-gradient(180deg,#2c7873 0%, #f89849 100%)",

      overflowX: "hidden",

      paddingBottom: "90px",
    }}
  >

      {/* CONTENT */}
      <div
  style={{
    padding: 20,
    paddingBottom: "110px",
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
          history={isAdmin ? allData : history}
          isAdmin={isAdmin}
          />
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
        pendingCount={pendingCount}
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