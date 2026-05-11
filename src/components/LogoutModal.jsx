export default function LogoutModal({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <h3 style={styles.title}>Konfirmasi Logout?</h3>

        <div style={styles.actions}>
          <button style={styles.cancel} onClick={onClose}>Cancel</button>
          <button style={styles.logout} onClick={onConfirm}>Logout</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    width: "80%",
    maxWidth: "300px",
    textAlign: "center",
  },
  title: {
  color: "#000",
  fontWeight: "700",
  fontSize: "20px",
  },
  actions: {
    display: "flex",
    marginTop: "20px",
  },
  cancel: {
    flex: 1,
    marginRight: "10px",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },
  logout: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    background: "red",
    color: "white",
    border: "none",
  },
};