import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const styles = {
  container: {
    maxWidth: 700,
    margin: "40px auto",
    padding: 30,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#fff7ed", // soft warm orange-ish bg
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(255, 159, 28, 0.3)", // orange shadow
    border: "1px solid #fbbf24", // subtle border in orange shade
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: "#c2410c", // strong dark orange
    textAlign: "center",
  },
  infoRow: {
    fontSize: 18,
    marginBottom: 12,
    color: "#78350f", // medium dark orange
  },
  label: {
    fontWeight: "600",
    color: "#b45309", // mid orange for labels
  },
  itemList: {
    listStyle: "none",
    padding: 0,
    marginTop: 20,
  },
  item: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    boxShadow: "0 2px 8px rgba(251, 191, 36, 0.2)", // light orange shadow
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontWeight: "600",
    fontSize: 16,
    color: "#7c2d12", // dark orange brownish
  },
  itemDetails: {
    fontSize: 14,
    color: "#92400e", // orange-brownish
  },
  totalRow: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 30,
    color: "#ea580c", // bright orange
  },
  printButton: {
    marginTop: 30,
    padding: "12px 24px",
    backgroundColor: "#ea580c", // bright orange
    color: "white",
    fontWeight: "600",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(234, 88, 12, 0.4)",
    transition: "background-color 0.3s",
  },
  printButtonHover: {
    backgroundColor: "#c2410c", // darker orange on hover
  },
};

const InvoiceDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [hoverPrint, setHoverPrint] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    if (!id) return;

    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/invoices/${id}`);
        setInvoice(res.data.invoice);
        setItems(res.data.items);
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setError("Failed to load invoice details.");
      }
    };

    fetchInvoice();
  }, [id]);

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  if (error)
    return (
      <p style={{ color: "#c2410c", textAlign: "center", marginTop: 40 }}>{error}</p>
    );
  if (!invoice)
    return (
      <p style={{ color: "#78350f", textAlign: "center", marginTop: 40 }}>
        Loading invoice details...
      </p>
    );

  return (
    <div style={styles.container}>
      <div ref={printRef}>
        <h2 style={styles.heading}>Invoice #{invoice.id}</h2>
        <p style={styles.infoRow}>
          <span style={styles.label}>Customer:</span> {invoice.customer_name}
        </p>
        <p style={styles.infoRow}>
          <span style={styles.label}>Created At:</span>{" "}
          {new Date(invoice.created_at).toLocaleString()}
        </p>

        <h3 style={{ ...styles.infoRow, marginTop: 30, color: "#c2410c" }}>Items:</h3>
        <ul style={styles.itemList}>
          {items.map((item) => (
            <li key={item.id} style={styles.item}>
              <span style={styles.itemName}>{item.name}</span>
              <span style={styles.itemDetails}>Qty: {item.quantity}</span>
              <span style={styles.itemDetails}>
                Subtotal: Rs.{item.subtotal.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        <p style={styles.totalRow}>Total: Rs.{invoice.total.toFixed(2)}</p>
      </div>

      <button
        onClick={handlePrint}
        style={{
          ...styles.printButton,
          backgroundColor: hoverPrint
            ? styles.printButtonHover.backgroundColor
            : styles.printButton.backgroundColor,
        }}
        onMouseEnter={() => setHoverPrint(true)}
        onMouseLeave={() => setHoverPrint(false)}
      >
        🖨️ Print Invoice
      </button>
    </div>
  );
};

export default InvoiceDetails;
