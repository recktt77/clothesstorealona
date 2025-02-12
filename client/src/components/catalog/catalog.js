import React from "react";
import axios from "axios";
import { addToCart } from "../../api";
import "./catalog.css"

class Catalog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filteredData: [],
            loading: true,
            error: null,
            searchTerm: "",
            categoryFilter: "all",
            priceFilter: "none",
        };
    }

    componentDidMount() {
        axios.get("http://localhost:4000/goods")
            .then((response) => {
                this.setState({
                    data: response.data,
                    filteredData: response.data,
                    loading: false
                });
            })
            .catch((err) => {
                this.setState({
                    error: err.message,
                    loading: false,
                });
            });
    }

    handleAddToCart = async (goodId) => {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
            alert("You are not logged in");
            return;
        }
        try {
            console.log(goodId)
            await addToCart(userEmail, goodId);
            alert("Item added to cart!");
        } catch (error) {
            alert(error.message);
        }
    };

    handleSearchChange = (event) => {
        this.setState({ searchTerm: event.target.value }, this.filterItems);
    };

    handleCategoryChange = (event) => {
        this.setState({ categoryFilter: event.target.value }, this.filterItems);
    };

    handlePriceFilterChange = (event) => {
        this.setState({ priceFilter: event.target.value }, this.filterItems);
    };

    filterItems = () => {
        const { data, searchTerm, categoryFilter, priceFilter } = this.state;

        let filtered = data;

        // Поиск по названию
        if (searchTerm) {
            filtered = filtered.filter((item) =>
                item.Title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Фильтр по категории
        if (categoryFilter !== "all") {
            filtered = filtered.filter((item) => item.Category === categoryFilter);
        }

        // Фильтр по цене
        if (priceFilter === "low") {
            filtered = [...filtered].sort((a, b) => a.Price - b.Price);
        } else if (priceFilter === "high") {
            filtered = [...filtered].sort((a, b) => b.Price - a.Price);
        }

        this.setState({ filteredData: filtered });
    };

    render() {
        const { filteredData, loading, error, searchTerm, categoryFilter, priceFilter } = this.state;

        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;

        return (
            <div className="catalogsss">
                {/* Фильтры */}
                <div className="filters">
                    <input className="filter_input"
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={this.handleSearchChange}
                    />

                    <select value={categoryFilter} onChange={this.handleCategoryChange}>
                        <option value="all">All categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothes">Clothes</option>
                        <option value="Shoes">Shoes</option>
                        <option value="Furniture">Furniture</option>
                    </select>

                    <select value={priceFilter} onChange={this.handlePriceFilterChange}>
                        <option value="none">No sorting</option>
                        <option value="low">Price: Low to High</option>
                        <option value="high">Price: High to Low</option>
                    </select>
                </div>

                {/* Каталог товаров */}
                <div className="catalog-items">
                    {filteredData.map((item) => (
                        <div className="item" id={item.id} key={item.Id}>
                            <img className="catalog-image" src={item.Image} alt={item.Title} />
                            <h2 className="title">{item.Title}</h2>
                            <h3 className="price">${item.Price}</h3>
                            <button className="buttonWight" onClick={() => this.handleAddToCart(Number(item.Id))}>
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Catalog;
