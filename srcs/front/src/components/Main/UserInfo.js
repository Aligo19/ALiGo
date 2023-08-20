import Stats from "./UserInfo/Stats"
import History from "./UserInfo/History"

export default function UserInfo(props) {
	return (
		<div className="UserInfo">
			<h2 className="UserInfo--title">{props.name}</h2>
			<img src={`${props.avatar}`} alt={"avatar"} className="Avatar" />
			<Stats level={props.level} winnb={props.winnb} losenb={props.losenb} />
			<History history={props.history}/>
		</div>
	)
}
