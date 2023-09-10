import React from 'react';
import env from "react-dotenv";

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
    let user:any = JSON.parse(sessionStorage.getItem('userData') || 'null')
    sessionStorage.setItem('idConv', '0');
    sessionStorage.setItem('idUserInfos', user.ID);
    window.location.replace(env.URL_REACT);
}

export default Navbar;
