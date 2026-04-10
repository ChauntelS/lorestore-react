import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Cookies from "js-cookie";
import type {Cart, CartItem} from "../../types/Cart.tsx";
import type {LoreSubject} from "../../types/LoreSubject.tsx";


export default function Details() {
    const { id } = useParams();
    const [loreSubject, setLoreSubject] = useState<LoreSubject>();
    const [showMessage, setShowMessage] = useState(false);
    const COOKIE_KEY = "shopping_cart";

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchData = async () => {
            const res = await fetch('http://localhost:8080/loreSubject/' + id);
            const loreSubject = await res.json();
            setLoreSubject(loreSubject);
        };

        fetchData();
    }, [id]);

    const handleAddToCart = () => {
        const raw = Cookies.get(COOKIE_KEY);
        const cart: Cart = raw ? JSON.parse(raw) : { items: [] };
        const existing = cart.items.find((item: CartItem) => item.id === loreSubject?.id);
        const quantity = 1;

        const updatedItems = existing
            ? cart.items.map((item: CartItem) =>
                item.id === loreSubject?.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            )
            : [...cart.items, { id: loreSubject?.id, quantity }];

        Cookies.set(COOKIE_KEY, JSON.stringify({ items: updatedItems }), { expires: 1 });
        setShowMessage(true);
    };

    return (
        <section className="page-card">
            <p className="eyebrow">Item profile</p>
            <h1>Creature Details</h1>
            {loreSubject ? (
                <>
                    <p className="lead">
                        View full product information for a specific lore creature file.
                    </p>
                    <div className="callout">
                        <h2>{loreSubject.name}</h2>
                        <img
                            className="lore-subject-image"
                            src={loreSubject.imageFilePath}
                            alt={loreSubject.name}
                            loading="lazy"
                        />
                        <p>{loreSubject.loreSummary}</p>
                        <p><strong>Region:</strong> {loreSubject.region}</p>
                        <p><strong>Habitat:</strong> {loreSubject.habitat}</p>
                        <p><strong>Evidence Level:</strong> {loreSubject.evidenceLevel}</p>
                        <p><strong>Active Sightings:</strong> {loreSubject.activeSightings}</p>
                        <p><strong>Threat Level:</strong> {loreSubject.threatLevel}</p>
                        <p><strong>Price:</strong> ${loreSubject.price.toFixed(2)}</p>
                    </div>

                    <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
                    {showMessage && <p className="success-message">Item added to cart!</p>}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </section>
    );
}