import Stats from "./UserInfo/Stats"
import History from "./UserInfo/History"
import axios from 'axios';

export default function UserInfo(props) {

	async function erase() {
		try {
			await axios.get(`http://127.0.0.1:3001/users/${props.name}/pseudo`);
			await axios.get(`http://127.0.0.1:3001/users/${JSON.parse(sessionStorage.getItem('userData')).ID}/block/${props.name}/add`);
			await axios.get(`http://127.0.0.1:3001/conv/${JSON.parse(sessionStorage.getItem('userData')).ID}/erase/${props.name}`);
			sessionStorage.setItem('idUserInfos', JSON.parse(sessionStorage.getItem('userData')).ID);
			sessionStorage.setItem('idConv', 0);
			window.location.reload();
		}
		catch (error)
		{
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

	if (!JSON.parse(sessionStorage.getItem('userData')))
		return (<div></div>)
	let button = '';
	let isFriend = '';
	if (props.name === JSON.parse(sessionStorage.getItem('userData')).Pseudo)
	{
		button = <button className="erase-btn" onClick={() => sessionStorage.setItem('status', 1)}>Settings</button>
		isFriend = <span></span>
	}
	else
	{
		let friend = JSON.parse(sessionStorage.getItem('userData')).Friends;
		for (let i = 0; i < friend.length; i++)
		{
			if (friend[i].Pseudo === props.name)
			{
				friend = null;
				break;
			}
		}
		if (friend == null)
		{
			button = <button className="erase-btn" onClick={() => {erase()}}>Delete friend</button>
			isFriend = <p className="UserInfo--smiley">&#10084;</p>
		}
		else
			isFriend = <p>&#x2716;</p>
	}

	let pic = '';
	if (props.avatar)
		pic = ((props.avatar).includes('http')) ? props.avatar : `http://127.0.0.1:3001/${props.avatar}` ;

	return (
		<div className="UserInfo">
			<div className="UserInfoProfile">
				{isFriend}
				<h2 className="UserInfo--title">{props.name}</h2>
				<div className={`status-point ${statusPointClass}`}></div>
			</div>
			<img src={pic} alt={"avatar"} className="Avatar" />
			<Stats level={props.level} winnb={props.winnb} losenb={props.losenb} />
			<History histo={props.histo} />
			{button}
		</div>
	)
}
