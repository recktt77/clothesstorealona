import React, { useState, useEffect } from "react";
import { processPurchase, addPaymentMethod, getPaymentMethod, deletePaymentMethod } from "../../api";

const Payment = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const userEmail = localStorage.getItem("userEmail");
  
    useEffect(() => {
        if (userEmail) {
            fetchPaymentMethod();
        } else {
            setPaymentMethod(null);
        }
    }, [userEmail]);

    const fetchPaymentMethod = async () => {

        try {
            const response = await getPaymentMethod(userEmail);
            if (response.paymentMethod) {
                setPaymentMethod(response.paymentMethod);
            }
        } catch (error) {
            console.error("Error fetching payment method:", error);
        }
    };

    const handlePayment = async () => {
        if (!userEmail) {
            alert("Please log in to make a purchase");
            return;
        }
        if (!paymentMethod) {
            alert("Please add a payment method before making a purchase");
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

    const handleAddPaymentMethod = async () => {
        const method = prompt("Enter your payment method (e.g., card number)");
        if (!method) return;
        try {
            const response = await addPaymentMethod(userEmail, method);
            console.log(response);
            if (response.message) {
                setPaymentMethod(method);
                alert("Payment method added successfully!");
            } else {
                alert("Failed to add payment method");
            }
        } catch (error) {
            alert("❌ Failed to add payment method: " + error.message);
        }
    };

    const handleDeletePaymentMethod = async () => {
        try {
            const response = await deletePaymentMethod(userEmail);
            console.log(response);
            if(response.message) {
                setPaymentMethod(null);
                alert("Successfully deleted payment method!");
            } else {
                alert("❌ Failed to delete payment method");
            }
        } catch (error) {
            alert("❌ Failed to delete payment method: " + error.message);
        }
    }
  
    return (
      <div className="bg-white p-4 shadow-md rounded-lg w-full">
        <h2 className="text-lg font-semibold mb-4">💳 Payment</h2>
        <p className="text-sm text-gray-600 mb-4">
            This is a demo store. No real payment will be processed.
        </p>
        {paymentMethod ? (
            <>
                <p className="text-sm text-green-600 mb-4">Payment Method: {paymentMethod}</p>
                <button 
                    onClick={handlePayment} 
                    disabled={isProcessing}
                    className={`buttonWight w-full p-2 rounded text-white font-semibold
                        ${isProcessing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    {isProcessing ? '⏳ Processing...' : '✅ Complete Purchase'}
                </button>
                <button
                    onClick={handleDeletePaymentMethod}
                    className="buttonWight w-full p-2 mt-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold"
                >
                    ❌ Delete Payment Method
                </button>
            </>
        ) : (
            <button 
                onClick={handleAddPaymentMethod} 
                className="buttonWight w-full p-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white font-semibold mb-2"
            >
                ➕ Add Payment Method
            </button>
        )}
      </div>
    );
};

export default Payment;
