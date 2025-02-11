import React, { useState, useEffect } from "react";
import { getCart, removeFromCart } from "../../api";

const CardBasket = () => {
    const [items, setItems] = useState([]); // ✅ Гарантируем, что `items` всегда массив
    const userEmail = localStorage.getItem("userEmail");

    useEffect(() => {
        if (userEmail) {
            fetchCart();
        }
    }, [userEmail]);

    const fetchCart = async () => {
        try {
            const cartItems = await getCart(userEmail);
            setItems(cartItems || []); // ✅ Если API вернул `null`, заменяем на `[]`
        } catch (error) {
            console.error("Ошибка загрузки корзины:", error);
            setItems([]); // ✅ В случае ошибки не ломаем рендер, а показываем пустой массив
        }
    };

    const removeItem = async (id) => {
        try {
            await removeFromCart(userEmail, id);
            setItems(prevItems => prevItems.filter(item => item.id !== id)); // ✅ Корректный state update
        } catch (error) {
            console.error("Ошибка удаления товара:", error);
        }
    };

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
                            {items.reduce((acc, item) => acc + item.price, 0)}₸
                        </span>
                    </p>
                    <button className="buttonWight mt-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition duration-300">
                        ✅ buy
                    </button>
                </div>
            )}
        </div>
    );
};

export default CardBasket;
