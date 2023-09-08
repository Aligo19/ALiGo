import React, { useState, ChangeEvent } from "react";
import axios from 'axios';
import env from "react-dotenv";


interface LoginProps {
    Pseudo: string;
    Avatar: string;
    update: (user: UserState) => void;
}

interface UserState {
    Pseudo: string;
    Avatar: string;
    update: (user: UserState) => void;
    email: string;
}

export default function Login(props: LoginProps) {
    const [user, setUser] = useState<UserState>({
        Pseudo: props.Pseudo,
        Avatar: props.Avatar,
        update: props.update,
        email: ''
    });

    const [file, setFile] = useState<File | null>(null);

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const chosenFile = event.target.files && event.target.files[0];
        setFile(chosenFile);
    };

    async function update() {
        await user.update(user);
        await AvatarUpload();
    }

    async function AvatarUpload() {

        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        try {
            await axios.post(env.URL_API + '/users/' + props.Pseudo, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const userData = await axios.get(env.URL_API + `/users/${props.Pseudo}/pseudo`);
            sessionStorage.setItem('userData', JSON.stringify(userData.data));
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">ALIGO'S PONG</div>
                <div className="login-content">
                    <div className="login-input">
                        <label htmlFor="pseudo">Pseudo</label>
                        <input className="login-content-input" id="pseudo" name="pseudo" type="text" placeholder="Login" value={user.Pseudo}
                            onChange={(e) => setUser(prevUser => ({ ...prevUser, Pseudo: e.target.value }))} />
                        <label htmlFor="ing">Avatar</label>
                        <input className="login-content-input" id="ing" name="ing" type="file" placeholder="Avatar"
                            onChange={handleFileChange} />
                        {/* <input margin="2%" id="email" name="email" type="text" placeholder="Mail" value={user.email}
                            onChange={(e) => setUser(prevUser => ({ ...prevUser, email: e.target.value }))} /> */}
                        <input id="email" name="email" type="text" placeholder="Mail" value={user.email}
                            onChange={(e) => setUser(prevUser => ({ ...prevUser, email: e.target.value }))} />
                        <button className="login-content-btn" onClick={() => { update(); }}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
