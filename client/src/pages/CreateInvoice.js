import React, { useState, useEffect } from "react";
import axios from "axios";

const styles = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    padding: 30,
    backgroundColor: "#fff7ed", // soft warm orange background
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(234, 88, 12, 0.15)", // subtle orange shadow
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#7c2d12", // dark burnt orange text
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 25,
    textAlign: "center",
    color: "#c2410c", // strong orange
  },
  messageSuccess: {
    color: "#166534", // dark green success
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  messageError: {
    color: "#b91c1c", // dark red error
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "1rem",
    borderRadius: 6,
    border: "1.5px solid #f97316", // orange border
    outlineColor: "#fb923c", // lighter orange on focus
    transition: "border-color 0.3s",
  },
  invoiceItemRow: {
    marginBottom: 15,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  select: {
    flexGrow: 1,
    padding: "10px 12px",
    fontSize: "1rem",
    borderRadius: 6,
    border: "1.5px solid #f97316",
    outlineColor: "#fb923c",
    cursor: "pointer",
    transition: "border-color 0.3s",
  },
  numberInput: {
    width: 80,
    padding: "10px 12px",
    fontSize: "1rem",
    borderRadius: 6,
    border: "1.5px solid #f97316",
    outlineColor: "#fb923c",
    textAlign: "center",
    transition: "border-color 0.3s",
  },
  subtotalText: {
    minWidth: 140,
    fontWeight: "700",
    fontSize: "1rem",
    textAlign: "right",
    color: "#c2410c",
  },
  addItemBtn: {
    marginTop: 10,
    marginBottom: 30,
    padding: "12px 20px",
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "white",
    backgroundColor: "#ea580c", // bright orange
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(234, 88, 12, 0.5)",
    transition: "background-color 0.3s",
  },
  addItemBtnHover: {
    backgroundColor: "#c2410c",
  },
  totalText: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "right",
    color: "#c2410c",
    marginBottom: 30,
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "white",
    backgroundColor: "#ea580c",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    boxShadow: "0 5px 14px rgba(234, 88, 12, 0.6)",
    transition: "background-color 0.3s",
  },
  submitBtnHover: {
    backgroundColor: "#c2410c",
  },
};

const CreateInvoice = () => {
  const [items, setItems] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hoverAdd, setHoverAdd] = useState(false);
  const [hoverSubmit, setHoverSubmit] = useState(false);

  // Fetch available items on mount
  useEffect(() => {
    axios
      .get("http://localhost:8080/items")
      .then((res) => setItems(res.data))
      .catch(() => setErrorMessage("Failed to load items. Please try again later."));
  }, []);

  // Add a new empty invoice item row
  const addItem = () => {
    setInvoiceItems((prev) => [
      ...prev,
      { itemId: "", quantity: 1, price: 0, subtotal: 0 },
    ]);
  };

  // Update item selection or quantity
  const updateItem = (index, field, value) => {
    setInvoiceItems((prev) => {
      const updated = [...prev];

      if (field === "itemId") {
        const selectedItem = items.find((i) => i.id === parseInt(value));
        if (selectedItem) {
          updated[index] = {
            itemId: selectedItem.id,
            price: selectedItem.price,
            quantity: 1,
            subtotal: selectedItem.price,
          };
        } else {
          updated[index] = { itemId: "", quantity: 1, price: 0, subtotal: 0 };
        }
      } else if (field === "quantity") {
        const qty = parseInt(value);
        if (isNaN(qty) || qty < 1) return prev; // ignore invalid qty

        updated[index].quantity = qty;
        updated[index].subtotal = updated[index].price * qty;
      }

      return updated;
    });
  };

  // Calculate total invoice amount
  const totalAmount = invoiceItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Submit invoice data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!customerName.trim()) {
      setErrorMessage("Customer name is required.");
      return;
    }

    if (invoiceItems.length === 0) {
      setErrorMessage("Add at least one invoice item.");
      return;
    }

    for (const item of invoiceItems) {
      if (!item.itemId) {
        setErrorMessage("Please select an item for all invoice entries.");
        return;
      }
      if (item.quantity < 1) {
        setErrorMessage("Quantity must be at least 1.");
        return;
      }
    }

    // Map keys to snake_case to match backend expectations
    const payloadItems = invoiceItems.map(({ itemId, quantity }) => ({
      item_id: itemId,
      quantity,
    }));

    try {
      await axios.post("http://localhost:8080/invoices", {
        customer_name: customerName.trim(),
        items: payloadItems,
      });

      setSuccessMessage("Invoice created successfully!");
      setInvoiceItems([]);
      setCustomerName("");
    } catch (error) {
      console.error("Error creating invoice:", error);
      setErrorMessage("Failed to create invoice. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Invoice</h2>

      {successMessage && <p style={styles.messageSuccess}>{successMessage}</p>}
      {errorMessage && <p style={styles.messageError}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="customerName" style={styles.label}>
            Customer Name:
          </label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            placeholder="Enter customer name"
            style={styles.input}
          />
        </div>

        {invoiceItems.map((item, index) => (
          <div key={index} style={styles.invoiceItemRow}>
            <select
              value={item.itemId}
              onChange={(e) => updateItem(index, "itemId", e.target.value)}
              required
              style={styles.select}
            >
              <option value="">Select Item</option>
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} - Rs.{i.price}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateItem(index, "quantity", e.target.value)}
              required
              style={styles.numberInput}
            />

            <span style={styles.subtotalText}>
              Subtotal: Rs.{item.subtotal.toFixed(2)}
            </span>
          </div>
        ))}

        <button
          type="button"
          style={{
            ...styles.addItemBtn,
            backgroundColor: hoverAdd
              ? styles.addItemBtnHover.backgroundColor
              : styles.addItemBtn.backgroundColor,
          }}
          onClick={addItem}
          onMouseEnter={() => setHoverAdd(true)}
          onMouseLeave={() => setHoverAdd(false)}
        >
          + Add Item
        </button>

        <h3 style={styles.totalText}>Total: Rs.{totalAmount.toFixed(2)}</h3>

        <button
          type="submit"
          style={{
            ...styles.submitBtn,
            backgroundColor: hoverSubmit
              ? styles.submitBtnHover.backgroundColor
              : styles.submitBtn.backgroundColor,
          }}
          onMouseEnter={() => setHoverSubmit(true)}
          onMouseLeave={() => setHoverSubmit(false)}
        >
          Create Invoice
        </button>
      </form>
    </div>
  );
};

export default CreateInvoice;
