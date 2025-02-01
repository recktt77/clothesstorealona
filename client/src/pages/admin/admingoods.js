import React from "react";
import "./admin.css";
import { getAllGoods, addGood, updateGood, deleteGood } from "../../api";

class AdminGoods extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goods: null,
            newTitle: "",
            newPrice: "",
            newImage: "",
            newCategory: "",
            editGoodId: null,
            editTitle: "",
            editPrice: "",
            editImage: "",
            editCategory: "",
        };
    }

    async componentDidMount() {
        await this.fetchGoods();
    }

    async fetchGoods() {
        try {
            const goods = await getAllGoods();
            this.setState({ goods });
        } catch (error) {
            console.error("Ошибка загрузки товаров:", error);
            this.setState({ goods: [] });
        }
    }

    async handleAddGood() {
        try {
            await addGood({
                title: this.state.newTitle,
                price: parseFloat(this.state.newPrice),
                images: this.state.newImage,
                category: this.state.newCategory,
            });
            this.setState({ newTitle: "", newPrice: "", newImage: "", newCategory: "" });
            await this.fetchGoods();
        } catch (error) {
            console.error("Ошибка добавления товара:", error);
        }
    }

    async handleUpdateGood() {
        try {
            await updateGood(this.state.editGoodId, {
                title: this.state.editTitle,
                price: parseFloat(this.state.editPrice),
                images: this.state.editImage,
                category: this.state.editCategory,
            });
            this.setState({ editGoodId: null, editTitle: "", editPrice: "", editImage: "", editCategory: "" });
            await this.fetchGoods();
        } catch (error) {
            console.error("Ошибка обновления товара:", error);
        }
    }

    async handleDeleteGood(goodId) {
        try {
            await deleteGood(goodId);
            await this.fetchGoods();
        } catch (error) {
            console.error("Ошибка удаления товара:", error);
        }
    }

    render() {
        const { goods, newTitle, newPrice, newImage, newCategory, editGoodId, editTitle, editPrice, editImage, editCategory } = this.state;

        return (
            <div className="Admin">
                <h2>Admin Panel - Goods</h2>

                <div>
                    <h3>Add Good</h3>
                    <input type="text" placeholder="Title" value={newTitle} onChange={(e) => this.setState({ newTitle: e.target.value })} />
                    <input type="number" placeholder="Price" value={newPrice} onChange={(e) => this.setState({ newPrice: e.target.value })} />
                    <input type="text" placeholder="Image URL" value={newImage} onChange={(e) => this.setState({ newImage: e.target.value })} />
                    <input type="text" placeholder="Category" value={newCategory} onChange={(e) => this.setState({ newCategory: e.target.value })} />
                    <button onClick={() => this.handleAddGood()}>Add Good</button>
                </div>

                {goods === null ? (
                    <p>Loading goods...</p>
                ) : goods.length === 0 ? (
                    <p>No goods found</p>
                ) : (
                    <table>
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
                            {goods.map((good) => (
                                <tr key={good.id}>
                                    <td>{good.id}</td>
                                    <td>{good.title}</td>
                                    <td>${good.price}</td>
                                    <td><img src={good.images} alt={good.title} width="50" /></td>
                                    <td>{good.category}</td>
                                    <td>
                                        <button onClick={() => this.setState({ editGoodId: good.id, editTitle: good.title, editPrice: good.price, editImage: good.images, editCategory: good.category })}>
                                            Edit
                                        </button>
                                        <button onClick={() => this.handleDeleteGood(good.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }
}

export default AdminGoods;
