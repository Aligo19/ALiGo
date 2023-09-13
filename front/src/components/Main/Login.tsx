import React, { useState, ChangeEvent } from "react";
import axios from 'axios';
import env from "react-dotenv";
import { extractColors } from "../../utils";
  

export default function Login(props: any) {
    const [user, setUser] = useState<any>({
        Pseudo: props.Pseudo,
        update: props.update,
        email: props.email,
        Actual_skin: props.Actual_skin
    });

    const [file, setFile] = useState<File | null>(null);

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const chosenFile = event.target.files && event.target.files[0];
        setFile(chosenFile);
    };

    async function update() {
        await AvatarUpload();
        await user.update(user);
    }

    async function AvatarUpload() {
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        try {
            await axios.post(env.URL_API + '/users/' + user.Pseudo, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const userData = await axios.get(env.URL_API + `/users/${user.Pseudo}/pseudo`);
            sessionStorage.setItem('userData', JSON.stringify(userData.data));
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">EDIT YOUT PROFIL</div>
                <div className="login-content">
                    <div className="login-input">
                        <label htmlFor="pseudo">Pseudo</label>
                        <input className="login-content-input" id="pseudo" name="pseudo" type="text" placeholder="Login" value={user.Pseudo}
                            onChange={(e) => setUser((prevUser: any) => ({ ...prevUser, Pseudo: e.target.value }))} />
                        <label htmlFor="ing">Avatar</label>
                        <input className="login-content-input" id="ing" name="ing" type="file" placeholder="Avatar"
                            onChange={handleFileChange} />
                        <label htmlFor="email">Email (2AF)</label>
                        <input id="email" name="email" type="text" placeholder="Mail" value={user.email}
                            onChange={(e) => setUser((prevUser:any) => ({ ...prevUser, email: e.target.value }))} />
                        <label>Couleur de la barre de pong</label>
                        <select	onChange={(e) => setUser((prevUser: any) => ({ ...prevUser, Actual_skin: e.target.value }))}
                                className="GameVsFriendForm-dropdown">
                                {props.Global_skin.map((skin: any, index: number) => (
                                    <option key={skin} value={skin} style={extractColors(skin)}>
                                        Couleur {index}: {skin}
                                    </option>))
                                }
                        </select>
                        <button className="login-content-btn" onClick={() => { update(); }}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}