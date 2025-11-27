// src/context/VisitorContext.jsx

import { createContext, useState } from "react";

export const VisitorContext = createContext();

export const VisitorProvider = ({ children }) => {
  const [visitors, setVisitors] = useState(
    JSON.parse(localStorage.getItem("visitors")) || []
  );

  // Add new visitor
  const addVisitor = (visitor) => {
    const newVisitor = {
      id: "VIS" + Date.now(),
      name: visitor.name,
      contact: visitor.contact,
      purpose: visitor.purpose,
      checkIn: new Date().toLocaleString(),
      checkOut: "",
    };

    const updated = [...visitors, newVisitor];
    setVisitors(updated);
    localStorage.setItem("visitors", JSON.stringify(updated));
  };

  const checkoutVisitor = (id) => {
    const updated = visitors.map((v) =>
      v.id === id ? { ...v, checkOut: new Date().toLocaleString() } : v
    );

    setVisitors(updated);
    localStorage.setItem("visitors", JSON.stringify(updated));
  };

  const deleteVisitor = (id) => {
    const updated = visitors.filter((v) => v.id !== id);
    setVisitors(updated);
    localStorage.setItem("visitors", JSON.stringify(updated));
  };

  return (
    <VisitorContext.Provider
      value={{ visitors, addVisitor, checkoutVisitor, deleteVisitor }}
    >
      {children}
    </VisitorContext.Provider>
  );
};
