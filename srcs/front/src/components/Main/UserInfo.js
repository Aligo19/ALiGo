import Stats from "./UserInfo/Stats"
import History from "./UserInfo/History"

function UserInfo() {
	return (
		<div className="UserInfo">
			<h2>User</h2>
			<img alt="user avatar" className="avatar" />
			<Stats />
			<History />
		</div>
	)
}

export default UserInfo