import axios from 'axios';

export default function Stream(props) {
	
	function fetchMatchs() {
		try {
			let id = sessionStorage.getItem('idUserInfos');
			let userProfile = (await axios.get(`http://127.0.0.1:3001/users/${id}`));
		if (!userProfile || !userProfile.data || userProfile.status < 200 || userProfile.status >= 300 || userProfile.data.status)
		return ;
		userProfile = userProfile.data;
		if (id == JSON.parse(sessionStorage.getItem('userData')).ID)
			sessionStorage.setItem('userData', JSON.stringify(userProfile));
		setUserData(userProfile);
		if (timeoutIdUserInfos)
		clearTimeout(timeoutIdUserInfos);
		setTimeouIdUserInfos(setTimeout(() => fetchUserInfo(), clock));
		} catch (error) {
			console.error("Error getting user infos: ", error);
			return (
				<div className="streamForm">'stream'</div>);
			}
	}
}
