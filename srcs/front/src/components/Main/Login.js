import { useState } from "react";

export default function Login(props) {
  const [user, setUser] = useState({
                            Pseudo : props.Pseudo,
                            Avatar : props.Avatar,
                            update: props.update
                          });

  function update() {
    user.update(user);
    console.log("update");
  }
  return (
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">ALIGO'S PONG</div>
          <div className="login-content">
            <div className="login-title">Login with Intra42 with success</div>
            <div>
              <div>
                <label htmlFor="pseudo">Login</label>
                <input
                  id="pseudo"
                  name="pseudo"
                  type="text"
                  placeholder="Login"
                  value={user.Pseudo}
                  onChange={(e) => setUser(prevUser => ({ ...prevUser, Pseudo: e.target.value }))} // Gérez les modifications avec un onChange
                />
                <label htmlFor="ing">Logo</label>
                <input
                  id="ing"
                  name="ing"
                  type="text"
                  placeholder="Logo"
                  value={user.Avatar}
                  onChange={(e) => setUser(prevUser => ({ ...prevUser, Avatar: e.target.value }))} // Gérez les modifications avec un onChange
                />
                <img src={user.Avatar} alt="logo" />
              </div>
              <button className="login-button" onClick={() => update()}>
                Valider
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}