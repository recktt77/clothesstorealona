import React, { useEffect, useState } from "react";
import "./admin.css";
import { getAllGoods, addGood, updateGood, deleteGood } from "../../api";

const AdminGoods = () => {
    const [goods, setGoods] = useState([]);
    const [newGood, setNewGood] = useState({ title: "", price: "", image: "", category: "" });
    const [editGood, setEditGood] = useState(null);
    const [aaddGood, setAddGood] = useState(null);

    useEffect(() => {
        fetchGoods();
    }, []);
 
    const fetchGoods = async () => {
        try {
            const response = await getAllGoods();
            console.log("API response:", response);
    
            if (Array.isArray(response.data)) {
                setGoods(response.data);
                console.log("Updated goods state:", response.data);
            } else {
                console.error("Invalid API response format:", response.data);
                setGoods([]);
            }
        } catch (error) {
            console.error("Ошибка загрузки товаров:", error);
            setGoods([]);
        }
    };
    
    const handleAddGood = async () => {
        const formattedGood = {
            title: newGood.title,
            price: parseFloat(newGood.price),
            image: newGood.image,
            category: newGood.category
        };
    
        console.log("Formatted good:", formattedGood);
    
        try {
            await addGood(formattedGood);
            setNewGood({ title: "", price: "", image: "", category: "" });
            fetchGoods();
            setAddGood(false)
        } catch (error) {
            console.error("Ошибка добавления товара:", error);
        }
    };

    const handleButtonAdd = async () =>{
        setAddGood(!aaddGood)
    }
    
    const handleUpdateGood = async () => {
        if (!editGood) {
            console.error("No good selected for update.");
            return;
        }

        const formattedGood = {
            title: editGood.title,
            price: parseFloat(editGood.price),
            image: editGood.image,
            category: editGood.category
        };

        console.log("Updating good:", formattedGood);

        try {
            await updateGood(editGood.Id, formattedGood);
            setEditGood(null);
            fetchGoods();
        } catch (error) {
            console.error("Ошибка обновления товара:", error);
        }
    };

    const handleDeleteGood = async (goodId) => {
        if (!goodId) {
            console.error("No good ID provided for deletion.");
            return;
        }

        console.log("Deleting good with ID:", goodId);

        try {
            await deleteGood(goodId);
            fetchGoods();
        } catch (error) {
            console.error("Ошибка удаления товара:", error);
        }
    };

    return (
        <div className="container">
            <h2>Admin Panel - Goods</h2>
            <button className="buttonWight" onClick={handleButtonAdd}>addGood</button>
            {aaddGood && (<div className="addGoods">
                <h3>Add Good</h3>
                <input type="text" placeholder="Title" value={newGood.title} onChange={(e) => setNewGood({ ...newGood, title: e.target.value })} />
                <input type="number" placeholder="Price" value={newGood.price} onChange={(e) => setNewGood({ ...newGood, price: e.target.value })} />
                <input type="text" placeholder="Image URL" value={newGood.image} onChange={(e) => setNewGood({ ...newGood, image: e.target.value })} />
                <input type="text" placeholder="Category" value={newGood.category} onChange={(e) => setNewGood({ ...newGood, category: e.target.value })} />
                <button className="buttonWight" onClick={handleAddGood}>Add Good</button>
                <button className="buttonWight" onClick={handleButtonAdd}>Cancel</button>
            </div>)}

            {editGood && (
                <div className="editGoods">
                    <h3>Edit Good</h3>
                    <input type="text" placeholder="Title" value={editGood.title} onChange={(e) => setEditGood({ ...editGood, title: e.target.value })} />
                    <input type="number" placeholder="Price" value={editGood.price} onChange={(e) => setEditGood({ ...editGood, price: e.target.value })} />
                    <input type="text" placeholder="Image URL" value={editGood.image} onChange={(e) => setEditGood({ ...editGood, image: e.target.value })} />
                    <input type="text" placeholder="Category" value={editGood.category} onChange={(e) => setEditGood({ ...editGood, category: e.target.value })} />
                    <button className="buttonWight" onClick={handleUpdateGood}>Save Changes</button>
                    <button className="buttonWight" onClick={() => setEditGood(null)}>Cancel</button>
                </div>
            )}

            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(goods) && goods.length > 0 ? (
                        goods.map((good, index) => (
                            <tr key={index}>
                                <td>{good.Id || "N/A"}</td>
                                <td>{good.Title || "No Title"}</td>
                                <td>${good.Price || 0}</td>
                                <td>{good.Image ? <img src={good.Image} alt={good.Title} width="50" /> : "No Image"}</td>
                                <td>{good.Category || "No Category"}</td>
                                <td>
                                    <button className="buttonWight" onClick={() => setEditGood(good)}>Edit</button>
                                    <button className="buttonWight" onClick={() => handleDeleteGood(good.Id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No goods found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminGoods;