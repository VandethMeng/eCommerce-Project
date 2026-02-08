import { useEffect, useState } from "react";
import ChatWidget from "./ChatWidget";
import "./Homepage.css";

export function Homepage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(
        /\/$/,
        ""
    );

    useEffect(() => {
        let isMounted = true;
        const loadProducts = async () => {
            setIsLoading(true);
            setError("");
            try {
                const res = await fetch(`${apiBaseUrl}/api/products`);
                if (!res.ok) {
                    throw new Error(`Request failed: ${res.status}`);
                }
                const data = await res.json();
                if (isMounted) {
                    setProducts(Array.isArray(data.products) ? data.products : []);
                }
            } catch (err) {
                if (isMounted) {
                    setError("Could not load products.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadProducts();
        return () => {
            isMounted = false;
        };
    }, [apiBaseUrl]);

    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <p className="hero-kicker">Angkor Market</p>
                    <h1 className="hero-title">Everyday essentials, curated with care.</h1>
                    <p className="hero-subtitle">
                        Explore a handpicked collection of home, lifestyle, and travel
                        favorites. Ask our assistant anytime for product help.
                    </p>
                    <div className="hero-actions">
                        <button className="hero-cta">Shop new arrivals</button>
                        <button className="hero-ghost">View best sellers</button>
                    </div>
                </div>
                <div className="hero-card">
                    <div className="hero-card-badge">New</div>
                    <h3 className="hero-card-title">Canvas Weekender</h3>
                    <p className="hero-card-text">
                        Lightweight, durable, and ready for spontaneous trips.
                    </p>
                    <div className="hero-card-price">$89.00</div>
                </div>
            </section>

            <section className="product-section">
                <div className="section-header">
                    <h2 className="section-title">Featured products</h2>
                    <p className="section-subtitle">Popular picks updated weekly.</p>
                </div>

                {isLoading ? (
                    <div className="section-state">Loading products...</div>
                ) : error ? (
                    <div className="section-state error">{error}</div>
                ) : (
                    <div className="product-grid">
                        {products.map((product) => (
                            <article className="product-card" key={product.id}>
                                <div className="product-image">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="product-body">
                                    <div className="product-tag">{product.category}</div>
                                    <h3 className="product-title">{product.name}</h3>
                                    <p className="product-description">{product.description}</p>
                                    <div className="product-meta">
                                        <span className="product-price">${product.price}</span>
                                        <button className="product-cta">Add to cart</button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <ChatWidget />
        </div>
    );
}