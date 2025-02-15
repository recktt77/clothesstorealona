import React, { useState, useEffect } from "react";
import { getCart, removeFromCart, processPurchase } from "../../api";

const CardBasket = () => {
    const [items, setItems] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const userEmail = localStorage.getItem("userEmail");

    const fetchCart = async () => {
        if (!userEmail) {
            setItems([]);
            return;
        }
        try {
            const cartItems = await getCart(userEmail);
            console.log("Корзина загружена:", cartItems);
            setItems(cartItems || []);
        } catch (error) {
            console.error("Ошибка загрузки корзины:", error);
            setItems([]);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [userEmail]);

    const removeItem = async (id) => {
        try {
            await removeFromCart(userEmail, id);
            fetchCart();
        } catch (error) {
            console.error("Ошибка удаления товара:", error);
        }
    };     

    const handlePurchase = async () => {
        if (!userEmail || items.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        try {
            setIsProcessing(true);
            await processPurchase(userEmail);
            alert("Purchase completed successfully! 🎉");
            fetchCart();
        } catch (error) {
            alert(`Purchase failed: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const totalAmount = items.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">🛒 your basket</h2>

            {items.length === 0 ? (
                <p className="text-gray-500 text-center">Basket is empty 😔</p>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {items.map(item => (
                        <li key={item.id} className="flex justify-between items-center py-3">
                            <div className="flex items-center space-x-4">
                                <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-md shadow" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                                    <p className="text-gray-500 text-sm">{item.price}₸</p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeItem(item.id)}
                                className="buttonWight bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
                                disabled={isProcessing}
                            >
                                ❌ delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {items.length > 0 && (
                <div className="mt-6 text-right">
                    <p className="text-lg font-semibold">💰 overall: 
                        <span className="text-blue-600 ml-2">
                            {totalAmount}₸
                        </span>
                    </p>
                    <button 
                        onClick={handlePurchase}
                        disabled={isProcessing}
                        className={`buttonWight mt-3 ${
                            isProcessing 
                                ? 'bg-gray-400' 
                                : 'bg-green-500 hover:bg-green-600'
                        } text-white px-6 py-3 rounded-lg font-bold transition duration-300`}
                    >
                        {isProcessing ? '⏳ Processing...' : '✅ buy'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CardBasket;
