import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ItemManagement() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", price: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:8080/items");
      setItems(res.data);
    } catch (err) {
      setError("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.price || !form.type) {
      setError("Please fill all fields");
      return;
    }

    try {
      if (form.id) {
        await axios.put(`http://localhost:8080/items/${form.id}`, {
          name: form.name,
          price: parseFloat(form.price),
          type: form.type,
        });
      } else {
        await axios.post("http://localhost:8080/items", {
          name: form.name,
          price: parseFloat(form.price),
          type: form.type,
        });
      }
      setForm({ id: null, name: "", price: "", type: "" });
      fetchItems();
    } catch {
      setError("Failed to save item");
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      price: item.price.toString(),
      type: item.type,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`http://localhost:8080/items/${id}`);
      fetchItems();
    } catch {
      setError("Failed to delete item");
    }
  };

  const styles = {
    container: {
      maxWidth: 900,
      margin: "40px auto",
      fontFamily: "'Poppins', sans-serif",
      padding: "0 20px",
    },
    heading: {
      fontSize: "2.8rem",
      fontWeight: "700",
      color: "#B33A3A",
      marginBottom: 24,
      textAlign: "center",
      textShadow: "1px 1px 4px rgba(179,58,58,0.4)",
    },
    error: {
      color: "#cc0000",
      marginBottom: 16,
      fontWeight: "600",
      textAlign: "center",
    },
    form: {
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 32,
      justifyContent: "center",
    },
    input: {
      flex: "1 1 180px",
      padding: "10px 14px",
      fontSize: "1rem",
      borderRadius: 6,
      border: "1.5px solid #ff6f3c",
      outline: "none",
      transition: "border-color 0.3s ease",
    },
    inputFocus: {
      borderColor: "#B33A3A",
      boxShadow: "0 0 5px #B33A3A",
    },
    select: {
      flex: "1 1 160px",
      padding: "10px 14px",
      fontSize: "1rem",
      borderRadius: 6,
      border: "1.5px solid #ff6f3c",
      outline: "none",
      transition: "border-color 0.3s ease",
      backgroundColor: "white",
      cursor: "pointer",
    },
    button: {
      padding: "10px 22px",
      fontSize: "1rem",
      borderRadius: 30,
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      backgroundColor: "#B33A3A",
      color: "white",
      boxShadow: "0 4px 8px rgba(179,58,58,0.7)",
      transition: "background-color 0.3s ease",
    },
    buttonSecondary: {
      backgroundColor: "#ff6f3c",
      marginLeft: 12,
      boxShadow: "0 4px 8px rgba(255,111,60,0.7)",
    },
    buttonHover: {
      backgroundColor: "#8c2a2a",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0 12px",
    },
    thead: {},
    th: {
      textAlign: "left",
      padding: "12px 16px",
      fontSize: "1.1rem",
      color: "white",
      backgroundColor: "#B33A3A",
      borderRadius: "8px",
      userSelect: "none",
    },
    tr: {
      backgroundColor: "#fff",
      boxShadow: "0 4px 15px rgba(179, 58, 58, 0.1)",
      borderRadius: 8,
    },
    td: {
      padding: "12px 16px",
      fontSize: "1rem",
      color: "#333",
      verticalAlign: "middle",
    },
    actionBtn: {
      padding: "6px 14px",
      fontSize: "0.9rem",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      marginRight: 8,
      transition: "background-color 0.3s ease",
    },
    editBtn: {
      backgroundColor: "#ff6f3c",
      color: "white",
    },
    deleteBtn: {
      backgroundColor: "#cc0000",
      color: "white",
    },
  };

  // For inputs focus styling, you can extend this as needed.
  // For brevity, keeping basic styling here.

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🍕 Item Management</h1>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={form.price}
          onChange={handleChange}
          style={{ ...styles.input, maxWidth: 120 }}
          min="0"
          step="0.01"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">Select Type</option>
          <option value="pizza">Pizza</option>
          <option value="beverage">Beverage</option>
          <option value="topping">Topping</option>
        </select>
        <button type="submit" style={styles.button}>
          {form.id ? "Update Item" : "Add Item"}
        </button>
        {form.id && (
          <button
            type="button"
            onClick={() => setForm({ id: null, name: "", price: "", type: "" })}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p style={{ textAlign: "center", color: "#999" }}>Loading items...</p>
      ) : items.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999" }}>No items found.</p>
      ) : (
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={{ ...styles.th, borderTopLeftRadius: 8 }}>Name</th>
              <th style={styles.th}>Price (₹)</th>
              <th style={styles.th}>Type</th>
              <th style={{ ...styles.th, borderTopRightRadius: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={styles.tr}>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{item.price.toFixed(2)}</td>
                <td style={styles.td} className={`type-${item.type}`}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{ ...styles.actionBtn, ...styles.editBtn }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#d8582a")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = styles.editBtn.backgroundColor)
                    }
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#a30000")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = styles.deleteBtn.backgroundColor)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
