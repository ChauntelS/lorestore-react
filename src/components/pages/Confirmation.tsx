import {useEffect, useState} from "react";
import {Navigate} from "react-router";
import Cookies from "js-cookie";

export default function Confirmation() {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');
    const COOKIE_KEY = "shopping_cart"

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('session_id');

        fetch(`http://localhost:8080/checkout/session-status?sessionId=${sessionId}`)
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.status);
                setCustomerEmail(data.customer_email);
            });
    }, []);

    if (status === 'open') {
        return (
            <Navigate to="/checkout" />
        )
    }

    if (status === 'complete') {
        // clear the cookie
        Cookies.remove(COOKIE_KEY)


        return (
            <section id="success" className="page-card success-card">
                <p className="eyebrow">Order confirmed</p>
                <h1>Confirmation</h1>
                <p className="lead">
                    Thanks for shopping with true north unkown. A confirmation email will be sent to {customerEmail}.
                </p>
                <div className="callout">
                    Questions about your order? Email <a href="mailto:orders@example.com">orders@example.com</a>.
                </div>
            </section>
        )
    }

    if (status === 'missing' || status === 'error') {
        return (
            <section className="page-card success-card">
                <p className="eyebrow">Session issue</p>
                <h1>Confirmation</h1>
                <p className="lead">
                    We could not verify this checkout session yet. Please return to checkout and try again.
                </p>
            </section>
        )
    }

    return (
        <section className="page-card success-card">
            <p className="eyebrow">Preparing receipt</p>
            <h1>Confirmation</h1>
            <p className="lead">
                We are checking your payment status and preparing your order confirmation.
            </p>
        </section>
    )
}