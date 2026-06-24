import { useState } from "react";


import {
  doc,
  updateDoc,
  deleteDoc,
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

  const [selectedItems, setSelectedItems] =
    useState([]);

  const [bulkAction, setBulkAction] =
    useState("");

  const [openReply, setOpenReply] =
    useState({});

  // =========================
  // FILTER
  // =========================

  const filteredData = allData
    .filter((item) => {
      if (item.archived) return false;

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

      return (
        categoryMatch && dateMatch
      );
    })

    .sort((a, b) => {
      if (a.pinned && !b.pinned)
        return -1;

      if (!a.pinned && b.pinned)
        return 1;

      return 0;
    });

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";

    try {
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
    } catch {
      return "-";
    }
  };

  // =========================
  // SELECT ITEM
  // =========================

  const toggleSelect = (id) => {
    if (
      selectedItems.includes(id)
    ) {
      setSelectedItems(
        selectedItems.filter(
          (item) => item !== id
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        id,
      ]);
    }
  };

  // =========================
  // SELECT ALL
  // =========================

  const handleSelectAll = () => {
    if (
      selectedItems.length ===
      filteredData.length
    ) {
      setSelectedItems([]);
    } else {
      setSelectedItems(
        filteredData.map(
          (item) => item.id
        )
      );
    }
  };

  // =========================
  // BULK ACTION
  // =========================

  const handleBulkAction =
    async (action) => {
      if (
        selectedItems.length === 0
      ) {
        alert("Pilih data dulu");
        return;
      }

      try {
        // DELETE
        if (action === "delete") {
          const confirmDelete =
            window.confirm(
              "Hapus data terpilih?"
            );

          if (!confirmDelete)
            return;

          for (const id of selectedItems) {
            await deleteDoc(
              doc(
                db,
                "moods",
                id
              )
            );
          }

          alert(
            "Data berhasil dihapus"
          );
        }

        // ARCHIVE
        if (action === "archive") {
          for (const id of selectedItems) {
            await updateDoc(
              doc(
                db,
                "moods",
                id
              ),
              {
                archived: true,
              }
            );
          }

          alert(
            "Data berhasil diarchive"
          );
        }

        // PIN
        if (action === "pin") {
          for (const id of selectedItems) {
            await updateDoc(
              doc(
                db,
                "moods",
                id
              ),
              {
                pinned: true,
              }
            );
          }

          alert(
            "Data berhasil dipin"
          );
        }

        setSelectedItems([]);
        setBulkAction("");
      } catch (err) {
        console.log(err);

        alert(
          "Terjadi kesalahan"
        );
      }
    };

  // =========================
  // SEND REPLY
  // =========================

  const sendReply =
    async (item) => {
      try {
        if (
          !replyMap[item.id]
        ) {
          alert(
            "Isi balasan dulu"
          );

          return;
        }

        const docRef = doc(
          db,
          "moods",
          item.id
        );

        await updateDoc(
          docRef,
          {
            reply:
              replyMap[item.id],

            status:
              "replied",

            replyAt:
              serverTimestamp(),

            replyRead: false,
          }
        );

        // DEBUG
        console.log("SERVICE:", "service_4ftcuxi");
        console.log("TEMPLATE:", "template_voe_map");
        console.log("PUBLIC KEY:", "40u6HLK_alJn30t4x");
        
        await emailjs.send(
          "service_4ftcuxi",
          "template_voe_map",
          {
            to_name: item.name,
            to_email: item.email,
            email: item.email,
            mood: item.mood,
            note: item.note,
            reply: replyMap[item.id],
          },
          "40u6HLK_alJn30t4x"
        );

        alert(
          "Reply berhasil dikirim"
        );
      } catch (err) {
      console.log("STATUS:", err?.status);
      console.log("TEXT:", err?.text);
      console.log(err);

      alert("Gagal kirim reply");
    }
    };

  // =========================
  // EXPORT EXCEL
  // =========================

  const exportExcel = () => {
    const excelData =
      filteredData.map(
        (item) => ({
          Nama:
            item.name || "-",

          Email:
            item.email || "-",

          Mood:
            item.mood || "-",

          Kategori:
            item.category || "-",

          Status:
            item.status ||
            "pending",

          Cerita:
            item.note || "-",

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
        })
      );

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

    const fileData =
      new Blob(
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
          value={
            selectedCategory
          }
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
            style={
              styles.dateInput
            }
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(
                e.target.value
              )
            }
            style={
              styles.dateInput
            }
          />
        </div>

        <button
          onClick={
            exportExcel
          }
          style={
            styles.exportButton
          }
        >
          📥 Export Excel
        </button>
      </div>

      {/* ACTION BAR */}
      <div style={styles.actionBar}>
        <label
          style={
            styles.selectAll
          }
        >
          <input
            type="checkbox"
            checked={
              selectedItems.length ===
                filteredData.length &&
              filteredData.length >
                0
            }
            onChange={
              handleSelectAll
            }
          />

          Select All
        </label>

        <select
          value={bulkAction}
          onChange={(e) => {
            const action =
              e.target.value;

            setBulkAction(
              action
            );

            if (action) {
              handleBulkAction(
                action
              );
            }
          }}
          style={
            styles.bulkSelect
          }
        >
          <option value="">
            Action
          </option>

          <option value="pin">
            📌 Pin
          </option>

          <option value="archive">
            📦 Archive
          </option>

          <option value="delete">
            🗑 Delete
          </option>
        </select>
      </div>

      {/* LIST */}
      {filteredData.map(
        (item) => (
          <div
            key={item.id}
            style={styles.card}
          >
            <div
              style={
                styles.topRow
              }
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(
                  item.id
                )}
                onChange={() =>
                  toggleSelect(
                    item.id
                  )
                }
              />

              {item.pinned && (
                <span
                  style={
                    styles.pinText
                  }
                >
                  📌 Pinned
                </span>
              )}
            </div>

            <p style={styles.text}>
              <b>Nama:</b>{" "}
              {item.name}
            </p>

            <p style={styles.text}>
              <b>Mood:</b>{" "}
              {item.mood}
            </p>

            <p style={styles.text}>
              <b>Kategori:</b>{" "}
              {item.category}
            </p>

            <p style={styles.text}>
              <b>Status:</b>{" "}
              {item.status ||
                "pending"}
            </p>

            <p style={styles.text}>
              <b>Tanggal:</b>{" "}
              {formatDate(
                item.createdAt
              )}
            </p>

            <p style={styles.text}>
              <b>Cerita:</b>{" "}
              {item.note}
            </p>

            {/* REPLY AREA */}
            {!item.reply ? (
              <>
                {!openReply[
                  item.id
                ] ? (
                  <div
                    style={
                      styles.tapReply
                    }
                    onClick={() =>
                      setOpenReply(
                        {
                          ...openReply,
                          [item.id]:
                            true,
                        }
                      )
                    }
                  >
                    💬 Tap untuk
                    membalas
                  </div>
                ) : (
                  <>
                    <textarea
                      placeholder="Tulis balasan..."
                      value={
                        replyMap[
                          item.id
                        ] || ""
                      }
                      onChange={(
                        e
                      ) =>
                        setReplyMap(
                          {
                            ...replyMap,
                            [item.id]:
                              e.target
                                .value,
                          }
                        )
                      }
                      style={
                        styles.textarea
                      }
                    />

                    <button
                      onClick={() =>
                        sendReply(
                          item
                        )
                      }
                      style={
                        styles.replyButton
                      }
                    >
                      Kirim Reply
                    </button>
                  </>
                )}
              </>
            ) : (
              <div
                style={
                  styles.replyBox
                }
              >
                <b>
                  HR Reply:
                </b>

                <p>
                  {item.reply}
                </p>
              </div>
            )}
          </div>
        )
      )}
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
    border:
      "1px solid #cbd5e1",
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
    border:
      "1px solid #cbd5e1",
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

  actionBar: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    background:
      "rgba(255,255,255,0.75)",
    padding: "14px",
    borderRadius: "20px",
    marginBottom: "18px",
  },

  selectAll: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "700",
  },

  bulkSelect: {
    padding: "10px",
    borderRadius: "12px",
    border:
      "1px solid #cbd5e1",
  },

  card: {
    background:
      "rgba(255,255,255,0.78)",
    padding: "18px",
    marginTop: "18px",
    borderRadius: "22px",
  },

  topRow: {
    display: "flex",
    justifyContent:
      "space-between",
    marginBottom: "10px",
  },

  pinText: {
    color: "#eab308",
    fontWeight: "700",
  },

  text: {
    color: "#334155",
    marginBottom: "8px",
  },

  tapReply: {
    marginTop: "14px",
    padding: "14px",
    borderRadius: "16px",
    border:
      "1px dashed #94a3b8",
    textAlign: "center",
    cursor: "pointer",
    color: "#475569",
    fontWeight: "600",
    background: "#f8fafc",
  },

  textarea: {
    width: "100%",
    minHeight: "90px",
    marginTop: "14px",
    padding: "14px",
    borderRadius: "16px",
    border:
      "1px solid #cbd5e1",
    resize: "none",
    boxSizing: "border-box",
  },

  replyButton: {
    width: "100%",
    marginTop: "12px",
    padding: "13px",
    border: "none",
    borderRadius: "14px",
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
};

