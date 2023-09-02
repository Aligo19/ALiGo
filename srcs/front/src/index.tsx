import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './App';
// Si vous décommentez ces lignes plus tard, assurez-vous qu'ils sont également convertis en TypeScript.
// import Login from './Login';
// import Game from './Game';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error("No root element found");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
