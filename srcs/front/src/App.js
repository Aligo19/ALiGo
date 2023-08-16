import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assurez-vous que vous avez importé Axios

import Navbar from "./components/Navbar";
import PrivateChats from "./components/Main/Groups/PrivateChats";
import GroupChats from "./components/Main/Groups/GroupChats";
import MessageCanvas from "./components/Main/MessageCanvas";
import UserInfo from "./components/Main/UserInfo";
import GameCanvas from './components/Main/GameCanvas';

function App() {
  const [gchats, setGChats] = useState([]);
  const [pchats, setPChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentView, setCurrentView] = useState("");

  const id = 1;

  useEffect(() => {
	function connect()
	{
		if (!JSON.parse(sessionStorage.getItem('userData'))) 
		{
			const code = new URLSearchParams(window.location.search).get('code');
			if (!code)
			{
				window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-3877a3e700b6b8841a31f110495b6d430ce41dc60be48f28aeca81423a03577b&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000&response_type=code');
				return;
			}
			axios.get(`http://127.0.0.1:3001/users/${code}/login`)
				.then(response => {
					sessionStorage.setItem('userData', JSON.stringify(response.data));
					window.location.replace('http://127.0.0.1:3000');
				})
		}
		console.log(JSON.parse(sessionStorage.getItem('userData')));
	}
    async function fetchChats() {
		try {

			const response = await axios.get(`http://127.0.0.1:3001/conv/${JSON.parse(sessionStorage.getItem('userData')).ID}/user`);
			const 	chats = response.data,
					privateChats = [],
					groupChats = [];

			chats.forEach(element => {
				if (element.Status === 2)
					privateChats.push(element);
				else
					groupChats.push(element);
			});

			setPChats(privateChats);
			setGChats(groupChats);
		} catch (error) {
			console.error("Error fetching chats:", error);
		}
    }
	connect();
    fetchChats();
  }, []);
  
  const pchatComponents = pchats.map(item => (
    <PrivateChats key={item.ID} name={item.Name} value={item.ID}  />
  ));

  const gchatComponents = gchats.map(item => (
    <GroupChats key={item.ID} name={item.Name} value={item.ID} onOpenConversation={onOpenConversation} />
  ));

  async function onOpenConversation(datas) {
	showMessageCanvas();
	let index = 0;
	const datasUser = JSON.parse(sessionStorage.getItem('userData'));
	const newMessages = datas.Messages.map((item) => (
		<MessageCanvas key={index++} content={item.data} sent={(datasUser.ID === item.ID_user)? true: false} />
	  ));
	  setMessages(	<div className="MessageCanvas">
	  					<div className="MessageContainer">
							{newMessages}
	  					</div>
          				<textarea className="Text-input" type="text" name="send-message" placeholder="Send message..." rows={1} />
        			</div>);
  }

    // Fonction pour changer la vue actuelle en "game"
	function showGameCanvas() {
		setCurrentView("game");
	}

		// Fonction pour changer la vue actuelle en "messages"
	function showMessageCanvas() {
		setCurrentView("messages");
	}

	return (
		<div className="App">
			<Navbar />
			<div className="Main">
			<div className="Groups">
				<div className="PlayButtons">
				{/* Utilisation des fonctions pour changer la vue actuelle */}
				<div className="Stream-btn" onClick={showGameCanvas}>WATCH MATCH</div>
				<div className="Random-btn" onClick={showGameCanvas}>RANDOM PLAYER</div>
				<div className="Friend-btn" onClick={showGameCanvas}>PLAY WITH FRIEND</div>
				</div>
				<div className="PrivateChats">
				<p>PRIVATE CHATS</p>
				{pchatComponents}
				</div>
				<div className="GroupChats">
				<p>GROUP CHATS</p>
				{gchatComponents}
				</div>
			</div>
			{/* Conditionnellement afficher soit le GameCanvas, soit le MessageCanvas */}
			{((currentView === "game") ? <GameCanvas /> : (currentView === "messages") ? messages:( <div className='EmptyCanvas'></div>))}
			<UserInfo />
			</div>
		</div>
	);
}

export default App;
