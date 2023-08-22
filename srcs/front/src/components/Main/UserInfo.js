import Stats from "./UserInfo/Stats"
import History from "./UserInfo/History"
import axios from 'axios';

export default function UserInfo(props) {

	async function erase() {
		try {
			const response = await axios.get(`http://127.0.0.1:3001/users/${props.name}/pseudo`);
			const reponse2 = await axios.get(`http://127.0.0.1:3001/users/${JSON.parse(sessionStorage.getItem('userData')).ID}/block/${props.name}/add`);
			const reponse3 = await axios.get(`http://127.0.0.1:3001/conv/${JSON.parse(sessionStorage.getItem('userData')).ID}/erase/${props.name}`);
			sessionStorage.setItem('idUserInfos', JSON.parse(sessionStorage.getItem('userData')).ID);
			window.location.reload();
		}
		catch (error) {
			console.error('Error erasing user:', error);
		}
	}
	const currentTime = new Date();
    const lastConnectionTime = new Date(Date.parse(props.lstCo));
	const timeDifference = lastConnectionTime ? (currentTime - lastConnectionTime) / 1000 : null;
	const isOnline = timeDifference !== null && timeDifference <= 600;
	const statusPointClass = isOnline ? 'online' : 'offline';
	if (statusPointClass === 'online')
		if (props.Game_status === true)
			statusPointClass = 'ingame';

	let button = '';
	let friend = JSON.parse(sessionStorage.getItem('userData')).Friends;
	for (let i = 0; i < friend.length; i++)
	{
		if (friend[i].Pseudo === props.name)
		{
			friend = null;
			break;
		}
	}
	if (props.name != JSON.parse(sessionStorage.getItem('userData')).Pseudo && friend == null)
	{
		button = <button className="button" onClick={() => {erase()}}>Erase</button>
	}

	return (
		<div className="UserInfo">
			<h2 className="UserInfo--title">{props.name} 
				<div className={`status-point ${statusPointClass}`}></div>
				{button}
			</h2>
			<img src={`${props.avatar}`} alt={"avatar"} className="Avatar" />
			<Stats level={props.level} winnb={props.winnb} losenb={props.losenb} />
			<History histo={props.matchHisto} />
		</div>
	)
}
