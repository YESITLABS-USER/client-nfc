import React from "react";

const UnderConstruction = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <img
          src="/under-construction.jpg"
          alt="Under Construction"
          style={styles.image}
        />
        <h1 style={styles.heading}>Page Under Construction</h1>
        <p style={styles.text}>
          We're working hard to bring you this page soon. Stay tuned!
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    backgroundColor: "#f7f9fc",
    textAlign: "center",
  },
  content: {
    maxWidth: "600px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  image: {
    width: "300px",
    marginBottom: "20px",
  },
  heading: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "10px",
  },
  text: {
    fontSize: "16px",
    color: "#555",
  },
};

export default UnderConstruction;
