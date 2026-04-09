import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './index.css'

import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/pages/Layout";
import Home from "./components/pages/Home";
import Cart from "./components/pages/Cart";
import Checkout from "./components/pages/Checkout";
import Confirmation from "./components/pages/Confirmation";
import Details from "./components/pages/Details";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="confirmation" element={<Confirmation />} />
                    <Route path="details/:id" element={<Details />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)