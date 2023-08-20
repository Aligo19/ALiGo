import aligo from "../img/logo_aligo.png"

export default function Navbar() {
	return (
		<div className="Navbar">
			<img src={aligo} alt="logo aligo" className="logo" />
			<button onClick={redirect}>
				<h1>ft_transcendence</h1>
			</button>
		</div>
	)
}
function redirect() {
	window.location.replace('http://127.0.0.1:3000');

}