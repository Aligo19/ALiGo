import Navbar from './components/Navbar';

export default function Login() {
	return (
		<>
			<Navbar />
			<div className="login-container">
				<div className="login-box">
					<div className="login-header">ALIGO'S PONG</div>
					<div className="login-content">
						<div className="login-title">Log in with Intra42</div>
						<div className="login-subtitle">Connection!</div>
					</div>
				</div>
			</div>
		</>
	);
};
