import aligo from "../img/logo_aligo.png"

export default function BadRequest() {
	return (
		<div className="BadRequest">
			<h2 className="BadRequest--title">Error 400: Bad Request</h2>
			<p className="BadRequest--text">The server cannot or will not process the request due to an apparent client error.</p>
			<p className="BadRequest--text">It may come from the SessionStorage.</p>
			<img src={aligo} alt="logo aligo" className="BadRequest--img" />
		</div>
	)
}
