import React, { useEffect, useState } from "react";
import axios from "axios";

// Images for item types (replace with your actual image paths)
import pizzaImg from "../assets/delicious-pizza-indoors.jpg";
import beverageImg from "../assets/two-milk-shakes-table.jpg";
import toppingImg from "../assets/side-view-pizza-with-slices-bell-pepper-pizza-slices-flour-board-cookware.jpg";

// Fallback/default image if no matching type found
import pizzaFallback from "../assets/delicious-pizza-indoors.jpg";

// Map item types (lowercase) to images
const imageMap = {
  pizza: pizzaImg,
  beverage: beverageImg,
  topping: toppingImg,
};

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/items")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setItems(res.data);
          setError(null);
        } else {
          setItems([]);
          setError("Invalid data format received");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch items:", err);
        setError("Failed to fetch items from server.");
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const styles = {
    page: {
      padding: "40px 20px",
      backgroundColor: "#fffaf0",
      fontFamily: "'Montserrat', sans-serif",
      minHeight: "100vh",
      color: "#333",
    },
    heading: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "3.6rem",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: "50px",
      color: "linear-gradient(90deg, #FF6F3C, #B33A3A)", // fallback if gradient doesn't work on text
      background: "linear-gradient(90deg, #FF6F3C, #B33A3A)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      MozBackgroundClip: "text",
      MozTextFillColor: "transparent",
      userSelect: "none",
      textShadow: "1px 1px 3px rgba(179,58,58,0.3)",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "30px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 8px 20px rgba(179, 58, 58, 0.12)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    cardHover: {
      transform: "scale(1.05)",
      boxShadow: "0 16px 40px rgba(179, 58, 58, 0.25)",
    },
    img: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
      borderTopLeftRadius: "20px",
      borderTopRightRadius: "20px",
      flexShrink: 0,
      transition: "transform 0.4s ease",
    },
    content: {
      padding: "24px 20px",
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    title: {
      fontSize: "1.8rem",
      fontWeight: "700",
      marginBottom: "12px",
      color: "#B33A3A",
      fontFamily: "'Playfair Display', serif",
      userSelect: "none",
    },
    price: {
      fontSize: "1.3rem",
      fontWeight: "600",
      color: "#FF6F3C",
      marginBottom: "8px",
    },
    type: {
      fontSize: "1rem",
      fontStyle: "italic",
      color: "#999",
      userSelect: "none",
    },
    error: {
      color: "red",
      textAlign: "center",
      marginBottom: "20px",
      fontWeight: "600",
    },
    loadingText: {
      textAlign: "center",
      color: "#aaa",
      fontSize: "1.1rem",
      marginTop: 40,
    },
    noItemsText: {
      textAlign: "center",
      color: "#bbb",
      fontSize: "1.2rem",
      marginTop: 40,
    },
  };

  // Track hover state for card effect
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>🍕 Menu Items</h1>

      {loading ? (
        <p style={styles.loadingText}>Loading items...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : items.length === 0 ? (
        <p style={styles.noItemsText}>No items available.</p>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => {
            const lowerType = item.type?.toLowerCase();
            const imgSrc = imageMap[lowerType] || pizzaFallback;
            const isHovered = hoveredCard === item.id;

            return (
              <div
                key={item.id}
                style={{
                  ...styles.card,
                  ...(isHovered ? styles.cardHover : {}),
                }}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <img
                  src={imgSrc}
                  alt={item.name}
                  style={{
                    ...styles.img,
                    ...(isHovered ? { transform: "scale(1.1)" } : {}),
                  }}
                  loading="lazy"
                />
                <div style={styles.content}>
                  <h2 style={styles.title}>{item.name}</h2>
                  <p style={styles.price}>₹ {item.price.toFixed(2)}</p>
                  <p style={styles.type}>Type: {item.type}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
