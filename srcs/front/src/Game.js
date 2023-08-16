import Navbar from "./components/Navbar";
import PrivateChats from "./components/Main/Groups/PrivateChats"
import GroupChats from "./components/Main/Groups/GroupChats"
import GameCanvas from "./components/Main/GameCanvas";
import UserInfo from "./components/Main/UserInfo"

function App() {
	return (
		<div className="App">
			<Navbar />
			<div className="Main">
				<div className="Groups">
					<div className="PlayButtons">
						<div className="Stream-btn">WATCH MATCH</div>
						<div className="Random-btn">RANDOM PLAYER</div>
						<div className="Friend-btn">PLAY WITH FRIEND</div>
					</div>
					<div className="PrivateChats">
						<p>PRIVATE CHATS</p>
						<PrivateChats />
					</div>
					<div className="GroupChats">
						<p>GROUP CHATS</p>
						<GroupChats />
					</div>
				</div>
				<GameCanvas />
				<UserInfo />
			</div>
		</div>
	);
}

export default App;
