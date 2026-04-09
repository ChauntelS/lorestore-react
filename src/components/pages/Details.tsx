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
        const fetchData = async () => {
            const res = await fetch('http://localhost:8080/loreSubject/' + id);
            const movie = await res.json();
            setLoreSubject(movie);
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
                item.id === ?.id
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
            <h1>Details</h1>
            {loreSubject ? (
                <>
                    <p className="lead">
                        View full product information for a specific lore creature file.
                    </p>
                    <div className="callout">
                        Add the item to your cart once it matches what you are looking for.
                    </div>
                    <button onClick={handleAddToCart}>Add to Cart</button>
                    {showMessage && <p className="success-message">Item added to cart!</p>}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </section>
    );
}