import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Items from './pages/Items';
import InvoiceList from './pages/InvoiceList';
import CreateInvoice from './pages/CreateInvoice';
import InvoiceDetails from './pages/InvoiceDetails';
import ItemManagement from "./pages/ItemManagement";

function App() {
  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/items" element={<Items />} />
          <Route path="/manage" element={<ItemManagement />} />
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/invoices/create" element={<CreateInvoice />} />
          <Route path="/invoices/:id" element={<InvoiceDetails />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
