import { useState } from "react";

import {
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import emailjs from "@emailjs/browser";

export default function Admin({ allData }) {

  const [replyMap, setReplyMap] = useState({});
  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  // =========================
  // SUMMARY
  // =========================
  const needFollow = allData.filter(
    (d) => d.category === "need_follow_up"
  );

  const onlyText = allData.filter(
    (d) =>
      d.category === "stories" ||
      d.category === "only_text"
  );

  const appreciation = allData.filter(
    (d) =>
      d.category === "appreciate" ||
      d.category === "appreciation"
  );

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (timestamp) => {

    if (!timestamp) return "-";

    try {

      const date = timestamp.toDate();

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

    } catch {

      return "-";
    }
  };

  // =========================
  // FILTER DATA
  // =========================
  const filteredData = allData.filter(
    (item) => {

      const categoryMatch =
        selectedCategory === "all"
          ? true
          : item.category ===
            selectedCategory;

      let dateMatch = true;

      if (item.createdAt) {

        const itemDate =
          item.createdAt
            .toDate()
            .toISOString()
            .split("T")[0];

        if (startDate) {
          dateMatch =
            dateMatch &&
            itemDate >= startDate;
        }

        if (endDate) {
          dateMatch =
            dateMatch &&
            itemDate <= endDate;
        }
      }

      return categoryMatch && dateMatch;
    }
  );

  // =========================
  // SEND REPLY
  // =========================
  const sendReply = async (item) => {

    try {

      if (!replyMap[item.id]) {

        alert("Isi balasan dulu");

        return;
      }

      const docRef = doc(
        db,
        "moods",
        item.id
      );

      await updateDoc(docRef, {
        reply: replyMap[item.id],
        status: "replied",
        replyAt: serverTimestamp(),
        replyRead: false,
      });

      // EMAILJS
      await emailjs.send(
        "service_9e912oa",
        "template_n5ncvx4",
        {
          to_email: item.email,
          mood: item.mood,
          note: item.note,
          reply: replyMap[item.id],
        },
        "mACZL1JrwWfQc1NAY"
      );

      alert("Reply berhasil dikirim");

    } catch (err) {

      console.log(err);

      alert("Gagal kirim reply");
    }
  };

  // =========================
  // EXPORT EXCEL
  // =========================
  const exportExcel = () => {

    const excelData =
      filteredData.map((item) => ({

        Nama: item.name || "-",

        Email: item.email || "-",

        Mood: item.mood || "-",

        Kategori:
          item.category || "-",

        Status:
          item.status || "pending",

        Cerita: item.note || "-",

        Reply:
          item.reply || "-",

        "Tanggal Submit":
          formatDate(
            item.createdAt
          ),

        "Tanggal Reply":
          formatDate(
            item.replyAt
          ),
      }));

    const worksheet =
      XLSX.utils.json_to_sheet(
        excelData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Mood Report"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

    const fileData = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      }
    );

    saveAs(
      fileData,
      `Mood_Report_${Date.now()}.xlsx`
    );
  };

  return (
    <div>

      <h2 style={{ color: "#000" }}>
        📊 Dashboard Mood Share
      </h2>

      {/* FILTER */}
      <div style={styles.filterBox}>

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value
            )
          }
          style={styles.select}
        >

          <option value="all">
            Semua Kategori
          </option>

          <option value="need_follow_up">
            Need Follow Up
          </option>

          <option value="stories">
            Stories
          </option>

          <option value="appreciate">
            Appreciate
          </option>

        </select>

        <div style={styles.dateRow}>

          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(
                e.target.value
              )
            }
            style={styles.dateInput}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(
                e.target.value
              )
            }
            style={styles.dateInput}
          />

        </div>

        <button
          onClick={exportExcel}
          style={styles.exportButton}
        >
          📥 Export Excel
        </button>

      </div>

      {/* SUMMARY */}
      <div style={styles.summary}>

        <Box
          title="🔴 Follow Up"
          value={needFollow.length}
          color="#ef4444"
          active={
            selectedCategory ===
            "need_follow_up"
          }
          onClick={() =>
            setSelectedCategory(
              "need_follow_up"
            )
          }
        />

        <Box
          title="🟡 Stories"
          value={onlyText.length}
          color="#f59e0b"
          active={
            selectedCategory ===
            "stories"
          }
          onClick={() =>
            setSelectedCategory(
              "stories"
            )
          }
        />

        <Box
          title="🟢 Appreciate"
          value={appreciation.length}
          color="#22c55e"
          active={
            selectedCategory ===
            "appreciate"
          }
          onClick={() =>
            setSelectedCategory(
              "appreciate"
            )
          }
        />

      </div>

      {/* LIST */}
      {filteredData.map((item) => (

        <div
          key={item.id}
          style={{
            ...styles.card,

            borderLeft:
              item.category ===
              "need_follow_up"
                ? "5px solid red"
                : item.category ===
                    "appreciate" ||
                  item.category ===
                    "appreciation"
                ? "5px solid green"
                : "5px solid orange",
          }}
        >

          <p style={styles.text}>
            <b>Nama:</b> {item.name}
          </p>

          <p style={styles.text}>
            <b>Mood:</b> {item.mood}
          </p>

          <p style={styles.text}>
            <b>Kategori:</b>{" "}
            {item.category}
          </p>

          <p style={styles.text}>
            <b>Status:</b>{" "}
            {item.status || "pending"}
          </p>

          <p style={styles.text}>
            <b>Tanggal:</b>{" "}
            {formatDate(item.createdAt)}
          </p>

          <p style={styles.text}>
            <b>Cerita:</b>{" "}
            {item.note}
          </p>
            {!item.reply ? (

  <>
    <textarea
      placeholder="Send Reply"
      value={
        replyMap[item.id] || ""
      }
      onChange={(e) =>
        setReplyMap({
          ...replyMap,
          [item.id]:
            e.target.value,
        })
      }
      style={styles.textarea}
    />

    <button
      onClick={() =>
        sendReply(item)
      }
      style={styles.button}
    >
      Send Reply
    </button>
  </>

) : (

  <div style={styles.repliedBadge}>
    ✅✅ Already Replied
  </div>

)}
             {item.reply && (

            <div style={styles.replyBox}>

              <b>
                HRDGA Reply:
              </b>

              <p style={{ color: "#000" }}>{item.reply}</p>

            </div>
          )}

        </div>
      ))}

    </div>
  );
}

function Box({
  title,
  value,
  color,
  active,
  onClick,
}) {

  return (

    <div
      onClick={onClick}
      style={{
        ...styles.box,

        borderColor: color,

        background:
          active
            ? color
            : "rgba(255,255,255,0.7)",

        color:
          active
            ? "white"
            : "#0f172a",
      }}
    >

      <p>{title}</p>

      <h2>{value}</h2>

    </div>
  );
}

const styles = {

  filterBox: {
    background:
      "rgba(255,255,255,0.75)",
    padding: "14px",
    borderRadius: "22px",
    marginBottom: "18px",
  },

  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    marginBottom: "10px",
  },

  dateRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },

  dateInput: {
    flex: 1,
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
  },

  exportButton: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg,#10b981,#059669)",
    color: "white",
    fontWeight: "700",
  },

  summary: {
    display: "flex",
    gap: "10px",
    margin: "18px 0",
  },

  box: {
    flex: 1,
    padding: "14px",
    borderRadius: "18px",
    textAlign: "center",
    border: "2px solid",
    cursor: "pointer",
  },

  card: {
    background:
      "rgba(255,255,255,0.78)",
    padding: "18px",
    marginTop: "18px",
    borderRadius: "22px",
  },

  text: {
    color: "#334155",
    marginBottom: "8px",
  },

  textarea: {
    width: "100%",
    minHeight: "90px",
    marginTop: "14px",
    padding: "14px",
    borderRadius: "16px",
    border: "1px solid #cbd5e1",
    resize: "none",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    marginTop: "14px",
    padding: "14px",
    borderRadius: "16px",
    border: "none",
    background:
      "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "white",
    fontWeight: "700",
  },

  replyBox: {
  marginTop: "14px",
  padding: "14px",
  borderRadius: "16px",
  background:
    "linear-gradient(135deg,#eff6ff,#dbeafe)",

  color: "#000",
},
repliedBadge: {

  marginTop: "14px",

  padding: "10px 14px",

  borderRadius: "14px",

  background: "#dcfce7",

  color: "#166534",

  fontWeight: "700",

  fontSize: "14px",

  display: "inline-block",
},
};