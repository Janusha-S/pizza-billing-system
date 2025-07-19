import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaFileInvoice, FaMoneyBillWave } from 'react-icons/fa';

// Inline CSS with orange shades
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fff7ed', // soft warm orange-ish background
    fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
    padding: '40px',
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 30px auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#c2410c', // strong dark orange
  },
  createBtn: {
    backgroundColor: '#ea580c', // bright orange
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '500',
    boxShadow: '0 4px 6px rgba(234, 88, 12, 0.4)', // orange shadow
    transition: 'all 0.2s',
  },
  createBtnHover: {
    backgroundColor: '#c2410c', // darker orange on hover
  },
  cardGrid: {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(234, 88, 12, 0.15)', // subtle orange shadow
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHover: {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 18px rgba(234, 88, 12, 0.3)', // stronger shadow on hover
  },
  iconRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    color: '#c2410c', // orange for icons and text
  },
  icon: {
    marginRight: '10px',
    fontSize: '20px',
  },
  customerRow: {
    display: 'flex',
    alignItems: 'center',
    color: '#78350f', // medium dark orange
    fontSize: '14px',
    marginBottom: '8px',
  },
  amountRow: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: '600',
    color: '#ea580c', // bright orange
    fontSize: '14px',
  },
  viewBtn: {
    marginTop: '12px',
    display: 'inline-block',
    backgroundColor: '#c2410c', // dark orange
    color: 'white',
    padding: '8px 14px',
    fontSize: '13px',
    borderRadius: '5px',
    textDecoration: 'none',
    transition: 'background 0.2s',
  },
  viewBtnHover: {
    backgroundColor: '#9a3412', // even darker orange on hover
  },
};

const InvoiceList = () => {
  const [invoices, setInvoices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoverCreate, setHoverCreate] = useState(false);
  const [hoverView, setHoverView] = useState(null); // track hovered invoice id

  useEffect(() => {
    axios
      .get('http://localhost:8080/invoices')
      .then((res) => {
        setInvoices(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching invoices:', err);
        setInvoices([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ ...styles.page, textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#78350f' }}>Loading invoices...</p>
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div style={{ ...styles.page, textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#78350f' }}>No invoices found.</p>
        <Link
          to="/invoices/create"
          style={{
            ...styles.createBtn,
            backgroundColor: hoverCreate ? styles.createBtnHover.backgroundColor : styles.createBtn.backgroundColor,
          }}
          onMouseEnter={() => setHoverCreate(true)}
          onMouseLeave={() => setHoverCreate(false)}
        >
          + Create Invoice
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>📄 All Invoices</h2>
        <Link
          to="/invoices/create"
          style={{
            ...styles.createBtn,
            backgroundColor: hoverCreate ? styles.createBtnHover.backgroundColor : styles.createBtn.backgroundColor,
          }}
          onMouseEnter={() => setHoverCreate(true)}
          onMouseLeave={() => setHoverCreate(false)}
        >
          + Create Invoice
        </Link>
      </div>

      <div style={styles.cardGrid}>
        {invoices.map((inv) => (
          <div
            key={inv.id}
            style={{
              ...styles.card,
              ...(hoverView === inv.id ? styles.cardHover : {}),
            }}
            onMouseOver={() => setHoverView(inv.id)}
            onMouseOut={() => setHoverView(null)}
          >
            <div style={styles.iconRow}>
              <FaFileInvoice style={styles.icon} />
              <span>Invoice #{inv.id}</span>
            </div>
            <div style={styles.customerRow}>
              <FaUser style={styles.icon} />
              <span>{inv.customer_name}</span>
            </div>
            <div style={styles.amountRow}>
              <FaMoneyBillWave style={styles.icon} />
              <span>Rs. {inv.total}</span>
            </div>
            <Link
              to={`/invoices/${inv.id}`}
              style={{
                ...styles.viewBtn,
                backgroundColor: hoverView === inv.id ? styles.viewBtnHover.backgroundColor : styles.viewBtn.backgroundColor,
              }}
              onMouseEnter={() => setHoverView(inv.id)}
              onMouseLeave={() => setHoverView(null)}
            >
              View Invoice
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceList;
