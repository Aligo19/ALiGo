import Navbar from './components/Navbar';

export default function Login() {
	let user = sessionStorage.getItem('userData');
	return (
		<>
			<Navbar />
			<div className="login-container">
				<div className="login-box">
					<div className="login-header">ALIGO'S PONG</div>
					<div className="login-content">
						<div className="login-title">Login with Intra42 with success</div>
						{/* formulaire avec les donnes preconfig de l'api */}
						<div>
							<div>
								<label htmlFor="pseudo">Login</label>
								<input id="pseudo" name="pseudo" type="text" placeholder="Login" value={user.Pseudo}/>
								<label htmlFor="ing">Logo</label>
								<input id="ing" name="ing" type="text" placeholder="Logo" value={user.Avatar} />
								<img src={user.Logo} alt="logo" />
							</div>
							<button className="login-button" onClick={update}>Valider</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

function update() {
	let pseudo = document.getElementById('pseudo').value;
	let logo = document.getElementById('ing').value;
	let user = sessionStorage.getItem('userData');
	user.Pseudo = pseudo;
	user.Logo = logo;
	console.log(user);
}