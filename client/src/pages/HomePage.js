import React from "react";
import pizzaHero from "../assets/delicious-pizza-indoors.jpg";
import { FaPizzaSlice, FaReceipt, FaRegClock, FaChartLine } from "react-icons/fa";

export default function HomePage() {
  const [hoverBtn, setHoverBtn] = React.useState(false);

  const styles = {
    homepage: {
      margin: 0,
      padding: 0,
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: "#fffaf4",
      color: "#333",
      overflowX: "hidden",
    },
    hero: {
  position: "relative",
  inset: 0,
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
  zIndex: 1,
  margin: 0,
  padding: 0,
},

heroImage: {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  filter: "brightness(60%)",
  margin: 0,
  padding: 0,
},
    overlay: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      color: "#fff",
      zIndex: 2,
      padding: "0 20px",
      maxWidth: "90vw",
    },
    heading: {
      fontSize: "4.5rem",
      fontWeight: 800,
      marginBottom: "20px",
      textShadow: "3px 3px 10px rgba(0,0,0,0.6)",
      background: "linear-gradient(to right, #ff7300, #ff4800)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "2px",
    },
    paragraph: {
      fontSize: "1.5rem",
      color: "#f4f4f4",
      marginBottom: "30px",
      textShadow: "1px 1px 5px rgba(0,0,0,0.4)",
    },
    btnStart: {
      padding: "16px 40px",
      fontSize: "1.2rem",
      backgroundColor: "#ff4500",
      color: "#fff",
      borderRadius: "12px",
      textDecoration: "none",
      fontWeight: "bold",
      boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
      transition: "transform 0.3s, background-color 0.3s",
      cursor: "pointer",
      display: "inline-block",
    },
    featuresSection: {
      padding: "80px 20px",
      textAlign: "center",
      backgroundColor: "#fffdf7",
    },
    sectionTitle: {
      fontSize: "2.8rem",
      fontWeight: 700,
      marginBottom: "40px",
      color: "#333",
    },
    featureGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "30px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    featureCard: {
      backgroundColor: "#fff",
      padding: "30px 20px",
      borderRadius: "16px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      transition: "transform 0.3s",
    },
    icon: {
      fontSize: "2.5rem",
      color: "#ff4500",
      marginBottom: "16px",
    },
    featureTitle: {
      fontSize: "1.3rem",
      fontWeight: 600,
      marginBottom: "10px",
      color: "#222",
    },
    featureText: {
      fontSize: "1rem",
      color: "#555",
    },
  };

  return (
    <div style={styles.homepage}>
      {/* HERO SECTION */}
      <div style={styles.hero}>
        <img src={pizzaHero} alt="Pizza" style={styles.heroImage} />
        <div style={styles.overlay}>
          <h1 style={styles.heading}>Welcome to PizzaHub Billing 🍕</h1>
          <p style={styles.paragraph}>Smart & Simple Pizza Order Management</p>
          <a
            href="/invoices/create"
            style={{
              ...styles.btnStart,
              ...(hoverBtn
                ? { transform: "scale(1.05)", backgroundColor: "#e84300" }
                : {}),
            }}
            onMouseEnter={() => setHoverBtn(true)}
            onMouseLeave={() => setHoverBtn(false)}
          >
            Create New Invoice
          </a>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Why Choose PizzaHub?</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <FaPizzaSlice style={styles.icon} />
            <h3 style={styles.featureTitle}>Menu Simplicity</h3>
            <p style={styles.featureText}>
              Easily track and bill pizzas, toppings, and combos in one click.
            </p>
          </div>
          <div style={styles.featureCard}>
            <FaReceipt style={styles.icon} />
            <h3 style={styles.featureTitle}>Invoice Automation</h3>
            <p style={styles.featureText}>
              Generate and download customer bills instantly.
            </p>
          </div>
          <div style={styles.featureCard}>
            <FaRegClock style={styles.icon} />
            <h3 style={styles.featureTitle}>Faster Billing</h3>
            <p style={styles.featureText}>
              Complete billing in seconds – ideal for rush hours!
            </p>
          </div>
          <div style={styles.featureCard}>
            <FaChartLine style={styles.icon} />
            <h3 style={styles.featureTitle}>Sales Reports</h3>
            <p style={styles.featureText}>
              Track your daily, weekly, and monthly pizza sales.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
