import {useEffect, useMemo, useState} from "react";
import {Link} from "react-router";
import Cookies from "js-cookie";
import type {Cart as CartCookie} from "../../types/Cart.tsx";
import type {LoreSubject} from "../../types/LoreSubject.tsx";

type CartLineItem = LoreSubject & {
    quantity: number;
};

const COOKIE_KEY = "shopping_cart";

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartLineItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const persistCart = (items: CartLineItem[]) => {
        if (!items.length) {
            Cookies.remove(COOKIE_KEY);
            return;
        }

        Cookies.set(
            COOKIE_KEY,
            JSON.stringify({
                items: items.map((item) => ({id: item.id, quantity: item.quantity})),
            }),
            {expires: 1}
        );
    };

    const cartTotal = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cartItems]
    );

    useEffect(() => {
        const loadCart = async () => {
            const raw = Cookies.get(COOKIE_KEY);
            const cartCookie: CartCookie = raw ? JSON.parse(raw) : {items: []};

            if (!cartCookie.items.length) {
                setCartItems([]);
                setIsLoading(false);
                return;
            }

            const fetchedItems = await Promise.all(
                cartCookie.items.map(async (cartItem) => {
                    const res = await fetch(`http://localhost:8080/loreSubject/${cartItem.id}`);
                    if (!res.ok) {
                        return null;
                    }

                    const loreSubject: LoreSubject = await res.json();
                    return {
                        ...loreSubject,
                        quantity: cartItem.quantity,
                    };
                })
            );

            const validItems = fetchedItems.filter((item): item is CartLineItem => item !== null);
            persistCart(validItems);
            setCartItems(validItems);
            setIsLoading(false);
        };

        loadCart();
    }, []);

    const updateQuantity = (id: number, change: number) => {
        setCartItems((previousItems) => {
            const updatedItems = previousItems
                .map((item) =>
                    item.id === id
                        ? {...item, quantity: item.quantity + change}
                        : item
                )
                .filter((item) => item.quantity > 0);

            persistCart(updatedItems);
            return updatedItems;
        });
    };

    const removeItem = (id: number) => {
        setCartItems((previousItems) => {
            const updatedItems = previousItems.filter((item) => item.id !== id);
            persistCart(updatedItems);
            return updatedItems;
        });
    };

    return (
        <section className="page-card cart-card">
            <p className="eyebrow">Your haul</p>
            <h1>Cart</h1>
            <p className="lead">
                Review the lore creature merch you selected before checkout.
            </p>

            {isLoading ? (
                <p>Loading cart...</p>
            ) : cartItems.length === 0 ? (
                <div className="callout">
                    <p>Your cart is empty right now.</p>
                    <Link to="/" className="btn btn-outline-light mt-3">Browse Lore Subjects</Link>
                </div>
            ) : (
                <>
                    <ul className="cart-items">
                        {cartItems.map((item) => (
                            <li key={item.id} className="cart-item">
                                <img
                                    className="lore-subject-image"
                                    src={item.imageFilePath}
                                    alt={item.name}
                                    loading="lazy"
                                />

                                <div className="cart-item-body">
                                    <h2>{item.name}</h2>
                                    <p className="cart-price">${item.price.toFixed(2)} each</p>
                                    <p className="cart-line-total"><strong>Line total:</strong> ${(item.price * item.quantity).toFixed(2)}</p>

                                    <div className="cart-controls">
                                        <button
                                            type="button"
                                            className="btn btn-outline-light btn-sm"
                                            onClick={() => updateQuantity(item.id, -1)}
                                            aria-label={`Decrease quantity for ${item.name}`}
                                        >
                                            -
                                        </button>
                                        <span className="qty-pill">Qty: {item.quantity}</span>
                                        <button
                                            type="button"
                                            className="btn btn-outline-light btn-sm"
                                            onClick={() => updateQuantity(item.id, 1)}
                                            aria-label={`Increase quantity for ${item.name}`}
                                        >
                                            +
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="callout cart-summary">
                        <div>
                            <p className="summary-label">Order total</p>
                            <p className="summary-total">${cartTotal.toFixed(2)}</p>
                        </div>
                        <Link to="/checkout" className="btn btn-primary btn-luxury">Proceed to Checkout</Link>
                    </div>
                </>
            )}
        </section>
    );
}