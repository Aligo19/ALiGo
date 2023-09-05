import React from 'react';

const Navbar: React.FC = () => {
    return (
        <div className="Navbar">
            <img src="logo_aligo.png" alt="logo aligo" className="logo" />
            <button onClick={redirect}>
                <h1>ft_transcendence</h1>
            </button>
        </div>
    );
};

function redirect() {
    window.location.replace('http://127.0.0.1:3000');
}

export default Navbar;
