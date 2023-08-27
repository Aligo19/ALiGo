import { useState } from "react";
import axios from 'axios';

export default function Login(props) {
  const [user, setUser] = useState({
    Pseudo : props.Pseudo,
    Avatar : props.Avatar,
    update: props.update,
    email : ''
  });

    const [file, setFile] = useState(null);

  function handleFileChange(event) {
    setFile(event.target.files[0]);
  };
  async function update() {
    await user.update(user); 
    await AvatarUpload();
  }

  async function AvatarUpload () {
  
      const formData = new FormData();
      formData.append('file', file);
      console.log(file);
      console.log(formData);
      try {
        await axios.post('http://127.0.0.1:3001/users/'+ props.Pseudo, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        let user = await axios.get(`http://127.0.0.1:3001/users/${props.Pseudo}/pseudo`);
        user = user.data;
        sessionStorage.setItem('userData', JSON.stringify(user));
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    };

  return (
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">ALIGO'S PONG</div>
          <div className="login-content">
            <div className="login-title">Login with Intra42 with success !</div>
            <div className="login-input">
                <label htmlFor="pseudo">Pseudo</label>
                <input className="login-content-input" id="pseudo" name="pseudo" type="text" placeholder="Login" value={user.Pseudo}
                   onChange={(e) => setUser(prevUser => ({ ...prevUser, Pseudo: e.target.value }))} 
                   />
                <label htmlFor="ing">Avatar</label>
                <input className="login-content-input" id="ing" name="ing" type="file" placeholder="Avatar"
                    onChange={handleFileChange} />
                <img className="login-content-img" src={user.Avatar} alt="logo" />
                <input id="email" name="email" type="text" placeholder="Mail" value={user.email}
                    onChange={(e) => setUser(prevUser => ({ ...prevUser, email: e.target.value }))}
                    />
                <button className="login-content-btn" onClick={() => { update(); }}>Submit</button>
            </div>
          </div>
        </div>
      </div>
  );
}