import { useState } from "react";

export default function Login(props) {
  const [user, setUser] = useState({
                            Pseudo : props.Pseudo,
                            Avatar : props.Avatar,
                            update: props.update
                          });

  function update() {user.update(user); console.log("update");}

  return (
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">ALIGO'S PONG</div>
          <div className="login-content">
            <div className="login-title">Login with Intra42 with success !</div>
            <div className="login-input">
                <label htmlFor="pseudo">Pseudo</label>
                <input className="login-content-input" id="pseudo" name="pseudo" type="text" placeholder="Login" value={user.Pseudo}
                   onChange={(e) => setUser(prevUser => ({ ...prevUser, Pseudo: e.target.value }))} />
                <label htmlFor="ing">Avatar</label>
                <input className="login-content-input" id="ing" name="ing" type="file" placeholder="Avatar"
                    onChange={(e) => setUser(prevUser => ({ ...prevUser, Avatar: e.target.value }))} />
                <img className="login-content-img" src={user.Avatar} alt="logo" />
                <button className="login-content-btn" onClick={() => update()}>Submit</button>
            </div>
          </div>
        </div>
      </div>
  );
}