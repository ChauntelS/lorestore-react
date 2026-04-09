import {Link, Outlet} from "react-router";
import ChatWidget from "../ChatWidget.tsx";

export default function Layout() {
    return(
        <div className="app-shell">
            <header className="site-header">
                <div className="site-branding">
                    <Link to="/" className="site-brand">
                        <span className="brand-mark" aria-hidden="true">☾</span>
                        <span>
                            <strong>True North unkown</strong>
                            <small>Lore creature casefiles</small>
                        </span>
                    </Link>
                </div>

                <nav className="site-nav" aria-label="Primary">
                    <Link to="/">Home</Link>
                    {/*<Link to="/cart">Cart</Link>*/}
                    <Link to="/checkout">Checkout</Link>
                </nav>
            </header>

            <main className="app-main">
                <Outlet/>
            </main>

            <section className="chatBot" >
                <div>
                    <ChatWidget />
                </div>
            </section>

            <footer className="site-footer">
                <span className="footer-note">Collect relics from the creatures of legend.</span>
                <span>true north unkown, &copy; 2026</span>
            </footer>
        </div>
    )
}