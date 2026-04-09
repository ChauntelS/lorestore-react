import {loadStripe} from "@stripe/stripe-js";
import {useCallback} from "react";
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from "@stripe/react-stripe-js";
import Cookies from "js-cookie";


export default function Checkout() {
    // Make sure to call `loadStripe` outside of a component's render to avoid
    // recreating the `Stripe` object on every render.
    // This is your test publishable API key.
    const stripePromise = loadStripe("pk_test_51T8PCFIfa2THv2WPJ42FDVayR6DVSO6b2PdtJcjkYnkOE7YUWF2hPX79FzJUpkGPN5psFciTjEGWkoyjS4uV5hF600rA1IOdpE");

    const COOKIE_KEY = "shopping_cart"

    const fetchClientSecret = useCallback(async () => {
        // get shopping cart cookie
        const cart = Cookies.get(COOKIE_KEY)

        // Create a Checkout Session
        const res = await fetch("http://localhost:8080/checkout/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: cart
        });
        const data = await res.json();

        return data.clientSecret;
    }, []);

    const options = {fetchClientSecret};

    return (
        <section className="page-card checkout-card">
            <p className="eyebrow">Secure payment</p>
            <h1>Checkout</h1>
            <p className="lead">
                Complete your order for true north unkown merchandise using Stripes secure embedded checkout.
            </p>

            <div className="checkout-frame">
                
                <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={options}
                >
                    <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
            </div>
        </section>
    )
}