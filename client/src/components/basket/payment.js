import React, { useState } from "react";
import { processPurchase } from "../../api";

const Payment = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const userEmail = localStorage.getItem("userEmail");
  
    const handlePayment = async () => {
        if (!userEmail) {
            alert("Please log in to make a purchase");
            return;
        }

        setIsProcessing(true);
        try {
            await processPurchase(userEmail);
            alert("Purchase completed successfully!");
            window.location.reload();
        } catch (error) {
            alert("❌ Purchase failed: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };
  
    return (
      <div className="bg-white p-4 shadow-md rounded-lg w-full">
        <h2 className="text-lg font-semibold mb-4">💳 Payment</h2>
        <p className="text-sm text-gray-600 mb-4">
            This is a demo store. No real payment will be processed.
        </p>
        <button 
            onClick={handlePayment} 
            disabled={isProcessing}
            className={`buttonWight w-full p-2 rounded text-white font-semibold
                ${isProcessing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
            {isProcessing ? '⏳ Processing...' : '✅ Complete Purchase'}
        </button>
      </div>
    );
};

export default Payment;