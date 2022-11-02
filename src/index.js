import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

if (process.env.NODE_ENV === 'production') {
    disableReactDevTools();
}

const container = document.getElementById('root');
const root = createRoot(container);

if (!window.localStorage.getItem("user") || window.localStorage.getItem("user") === undefined) {
    window.localStorage.setItem("user", JSON.stringify("DEFAULT_VALUE"));
}

root.render(
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path="/*" element={<App />} />
            </Routes>
        </AuthProvider>
    </BrowserRouter>
);