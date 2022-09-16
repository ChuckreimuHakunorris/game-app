import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Register from "./Register";
import Login from "./Login";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <main className="App">
        <Login />
    </main>
);
