import React, { useState, useEffect } from "react";

const Payment = () => {
    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");
    const [expDate, setExpDate] = useState("");
  
    const handlePayment = () => {
      alert("Оплата успешно проведена!");
    };
  
    return (
      <div className="bg-white p-4 shadow-md rounded-lg w-full">
        <h2 className="text-lg font-semibold mb-2">Payment</h2>
        <input type="text" placeholder="Номер карты" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="block w-full p-2 mb-2 border rounded" />
        <input type="text" placeholder="Дата истечения" value={expDate} onChange={e => setExpDate(e.target.value)} className="block w-full p-2 mb-2 border rounded" />
        <input type="text" placeholder="CVV" value={cvv} onChange={e => setCvv(e.target.value)} className="block w-full p-2 mb-2 border rounded" />
        <button onClick={handlePayment} className="buttonWight bg-blue-500 text-white p-2 rounded w-full">Pay</button>
      </div>
    );
  };

export default Payment