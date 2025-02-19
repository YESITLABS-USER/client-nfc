import React from "react";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <img
          src="/notFound.png"
          alt="404 Not Found"
          style={styles.image}
        />
        <h1 style={styles.heading}>404</h1>
        <p style={styles.text}>Oops! The page you’re looking for doesn’t exist.</p>
        <button style={styles.button} onClick={() => (window.location.href = "/")}>
          Go Back Home
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fc",
    textAlign: "center",
  },
  content: {
    maxWidth: "500px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  image: {
    width: "100px",
    marginBottom: "20px",
  },
  heading: {
    fontSize: "48px",
    color: "#ff6f61",
    marginBottom: "10px",
  },
  text: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default NotFound;
