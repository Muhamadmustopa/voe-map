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

    // UPDATE FIRESTORE
    await updateDoc(docRef, {
      reply: replyMap[item.id],
      status: "replied",
      replyAt: serverTimestamp(),
      replyRead: false,
    });

    // SEND EMAIL
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