import Stats from "./UserInfo/Stats"
import History from "./UserInfo/History"

export default function UserInfo(props) {
	
	return (
		<div className="UserInfo">
			<h2>{props.name}</h2>
			{/* <img alt="user avatar" className="Avatar" /> */}
			{/* <img src={`${props.avatar}`} className="Avatar" /> */}
			<Stats />
			<History />
		</div>
	)
}
