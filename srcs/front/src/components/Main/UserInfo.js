import Stats from "./UserInfo/Stats"
import History from "./UserInfo/History"

export default function UserInfo(props) {
	const currentTime = new Date();
    const lastConnectionTime = new Date(Date.parse(props.lstCo));
	const timeDifference = lastConnectionTime ? (currentTime - lastConnectionTime) / 1000 : null;
	const isOnline = timeDifference !== null && timeDifference <= 600;
	const statusPointClass = isOnline ? 'online' : 'offline';

	return (
		<div className="UserInfo">
			<h2 className="UserInfo--title">{props.name} 
				<div className={`status-point ${statusPointClass}`}></div>
			</h2>
			<img src={`${props.avatar}`} alt={"avatar"} className="Avatar" />
			<Stats level={props.level} winnb={props.winnb} losenb={props.losenb} />
			<History histo={props.matchHisto} />
		</div>
	)
}
