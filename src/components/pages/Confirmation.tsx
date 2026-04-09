import {useEffect, useState} from "react";
import {Navigate} from "react-router";
import Cookies from "js-cookie";

export default function Confirmation() {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    const [status, setStatus] = useState<string | null>(sessionId ? null : 'missing');
    const [customerEmail, setCustomerEmail] = useState('');
    const COOKIE_KEY = "shopping_cart"

    useEffect(() => {
        if (!sessionId) {
            return;
        }

        let isActive = true;

        fetch(`http://localhost:8080/checkout/session-status?sessionId=${sessionId}`)
            .then((res) => res.json())
            .then((data) => {
                if (!isActive) {
                    return;
                }
                setStatus(data.status);
                setCustomerEmail(data.customer_email);
            })
            .catch(() => {
                if (isActive) {
                    setStatus('error');
                }
            });

        return () => {
            isActive = false;
        };
    }, [sessionId]);

    if (status === 'open') {
        return (
            <Navigate to="/checkout" />
        )
    }

    if (status === 'complete') {
        // clear the cookie
        Cookies.remove(COOKIE_KEY);

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