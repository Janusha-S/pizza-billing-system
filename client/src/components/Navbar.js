import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/items", label: "Items" },
    { path: "/manage", label: "Manage Items" },
    { path: "/invoices", label: "Invoices" },
    { path: "/invoices/create", label: "Create Invoice" },
  
  ];

  const [hovered, setHovered] = useState(null);

  const styles = {
    nav: {
      display: "flex",
      alignItems: "center",
      padding: "10px 40px",
      background: "linear-gradient(90deg, #B33A3A, #FF6F3C)",
      boxShadow: "0 4px 12px rgba(179, 58, 58, 0.8)",
      fontFamily: "'Montserrat', sans-serif",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      marginRight: "40px",
      color: "#fff4e6",
      fontWeight: "700",
      fontSize: "1.6rem",
      userSelect: "none",
      cursor: "default",
    },
    pizzaIcon: {
      width: "32px",
      height: "32px",
      marginRight: "12px",
      fill: "#fff4e6",
      filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.2))",
    },
    linkContainer: {
      display: "flex",
      gap: "28px",
    },
    link: {
      color: "#fff4e6",
      textDecoration: "none",
      fontWeight: "600",
      fontSize: "1.1rem",
      padding: "8px 16px",
      borderRadius: "20px",
      transition: "background-color 0.3s ease, transform 0.2s ease",
      boxShadow: "0 2px 8px rgba(255, 111, 60, 0.3)",
      cursor: "pointer",
    },
    activeLink: {
      backgroundColor: "#fff4e6",
      color: "#B33A3A",
      boxShadow: "0 4px 14px rgba(179, 58, 58, 0.9)",
      transform: "scale(1.05)",
      fontWeight: "700",
    },
    hoverEffect: {
      backgroundColor: "rgba(255, 111, 60, 0.3)",
      transform: "scale(1.05)",
    },
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logoContainer}>
        <svg
          style={styles.pizzaIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12c0 3.04 1.4 5.77 3.58 7.47L12 22l6.42-2.53A9.967 9.967 0 0022 12c0-5.52-4.48-10-10-10zM8 14a1 1 0 110-2 1 1 0 010 2zm4 4a2 2 0 110-4 2 2 0 010 4zm4-6a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
        PizzaHub
      </div>

      <div style={styles.linkContainer}>
        {navLinks.map(({ path, label }) => {
          const isActive = location.pathname === path;
          const isHovered = hovered === path;

          return (
            <Link
              key={path}
              to={path}
              style={{
                ...styles.link,
                ...(isActive ? styles.activeLink : {}),
                ...(!isActive && isHovered ? styles.hoverEffect : {}),
              }}
              onMouseEnter={() => setHovered(path)}
              onMouseLeave={() => setHovered(null)}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
