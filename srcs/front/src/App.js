import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import Navbar from "./components/Navbar";
import PrivateChats from "./components/Main/Groups/PrivateChats";
import GroupChats from "./components/Main/Groups/GroupChats";
import MessageCanvas from "./components/Main/MessageCanvas";
import UserInfo from "./components/Main/UserInfo";
import GameCanvas from './components/Main/GameCanvas';

export default function App() {
  const [gchats, setGChats] = useState([]);
  const [pchats, setPChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [createGroup, setCreateGroup] = useState([]);
  const [currentView, setCurrentView] = useState("");
  const [userData, setUserData] = useState([]);
  const [timeoutIdConv, setTimeoutIdConv] = useState(null);
  const [timeoutIdConvs, setTimeoutIdConvs] = useState(null);

  async function fetchUserInfo(id = null) {

	try {
		let userProfile;
		if (!id)
		{
			const y = JSON.parse(sessionStorage.getItem('userData'));
			userProfile = (await axios.get(`http://127.0.0.1:3001/users/${y.ID}`)).data;
			sessionStorage.setItem('userData', JSON.stringify(userProfile));
		}
		else
			userProfile = (await axios.get(`http://127.0.0.1:3001/users/${id}`)).data;
		setUserData(userProfile);
	} catch (error) {
		console.error("Error getting user infos: ", error);
	}
	}
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
			if (timeoutIdConvs)
				clearTimeout(timeoutIdConvs);
			setTimeoutIdConvs( await setTimeout(async () => { fetchChats() }, 1000));
		} catch (error) {
			console.error("Error fetching chats:", error);
		}
    }
	connect();
	fetchUserInfo();
    fetchChats();
	}, []);
	
  const userInfoComponents = <UserInfo name={userData.Pseudo} avatar={userData.Avatar} level={userData.Elo} winnb={userData.Wins} losenb={userData.Loses} />;
  
  let pchatComponents = [];

	if (pchats)
	{
		pchatComponents = pchats.map(item => (
			<PrivateChats key={item.ID} name={item.Name} value={item.ID} onOpenConversation={onOpenConversation} fetchUserInfo={fetchUserInfo} />
		));
	}	

	let gchatComponents = [];

	if (gchats)
	{
		gchatComponents = gchats.map(item => (
			<GroupChats key={item.ID} name={item.Name} value={item.ID} onOpenConversation={onOpenConversation} fetchUserInfo={fetchUserInfo} />
		));
	}

  async function onOpenConversation(datas) {
	showMessageCanvas();
	const datasUser = JSON.parse(sessionStorage.getItem('userData'));
	let newMessages = [];
	
	if (datas.Messages)
	{
		newMessages = datas.Messages.map((item, index) => {
			const user = datas.Users.find((user) => user.ID === item.ID_user);
			return (
			  <MessageCanvas key={index} content={item.data} sent={datasUser.ID === item.ID_user} user={user} fetchUserInfo={fetchUserInfo}/>
			);
		});
	}

	  setMessages(	<div className="MessageCanvas">
	  					<div className="MessageContainer">
							{newMessages}
	  					</div>
          				<div style={{ display: 'flex', alignItems: 'center' }}>
							<textarea
								id="inputText"
								className="Text-input"
								type="text"
								name="send-message"
								placeholder="Send message..."
								rows={1}
								style={{ width: '95%' }} // Ajout d'une marge à droite pour séparer les éléments
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
									  sendMessage(datas);
									}
								  }}
							/>
							<button className="SendMessage-btn" onClick={() => {
								sendMessage(datas);}}>
								<span>&#8594;</span> {/* Arrow Right Unicode */}
							</button>
						</div>
        			</div>);
			if (timeoutIdConv)
				clearTimeout(timeoutIdConv);
			setTimeoutIdConv( await setTimeout(async () => {
				onOpenConversation((await axios.get(`http://127.0.0.1:3001/conv/${datas.ID}`)).data)
			}, 1000));
  }

	async function sendMessage(oldDatas) {
		if (document.getElementById('inputText').value === '')
			return;
		const datas = JSON.parse(sessionStorage.getItem('userData'));
		await axios.post(`http://127.0.0.1:3001/conv/${oldDatas.ID}/message`, {
			ID_user: datas.ID,
			data: document.getElementById('inputText').value,
			Logged_at: Date.now()});
		document.getElementById('inputText').value = '';
		await onOpenConversation((await axios.get(`http://127.0.0.1:3001/conv/${oldDatas.ID}`)).data);
  	}

  	// Fonction pour changer la vue actuelle en "game"
	function showGameCanvas() {
		setCurrentView("game");
	}

	// Fonction pour changer la vue actuelle en "messages"
	function showMessageCanvas() {
		setCurrentView("messages");
	}

	function handleAddPerson() {
		if (timeoutIdConv)
			clearTimeout(timeoutIdConv);
		let user = JSON.parse(sessionStorage.getItem('userData'));
		const peopleOptions = user.Friends;
		if (!peopleOptions)
			return;

		setCreateGroup(
		<div className='EmptyCanvas'>
			<div>
			<label htmlFor="name">Nom:</label>
			<input type="text" id="name" name="name" required/>
			</div>
			<div>
			<label htmlFor="isPrivate">Privée:</label>
			<input type="checkbox" id="isPrivate" name="isPrivate"/>
			</div>
			<div>
			<label htmlFor="password">Mot de passe:</label>
			<input type="password" id="password" name="password"/>
			</div>
			<div>
			<label>Ajouter des gens:</label>
			{peopleOptions.map((person, index) => (
				<div key={index}>
				<input
					type="checkbox"
					id={`person-${person.ID}`}
					name={`person-${person.ID}`}
					value={person.ID}
				/>
				<label htmlFor={`person-${person.ID}`}>{person.Pseudo}</label>
				</div>
			))}
			</div>
			<button type="button" onClick={handleFormSubmit}>Soumettre</button>
		</div>
		);
		setCurrentView("addPerson");
	}

	async function handleFormSubmit() {
		// Utilisez les variables groupName, isPrivate, password et selectedPeople pour traiter le formulaire
		let groupName = document.getElementById("name").value;
		let isPrivate = document.getElementById("isPrivate").checked;
		let password = document.getElementById("password").value;
		let selectedPeople = [];
		let peopleOptions = JSON.parse(sessionStorage.getItem('userData')).Friends;
		if (!peopleOptions || !groupName || groupName === '' || (isPrivate && password === '') || peopleOptions.length === 0)
			return;
	
		for (let i = 0; i < peopleOptions.length; i++)
			if (document.getElementById(`person-${peopleOptions[i].ID}`).checked)
				selectedPeople.push(peopleOptions[i].ID);

		password = (!isPrivate) ? null: password;
		isPrivate = (!isPrivate) ? 0: 1;
		let out = await axios.post('http://127.0.0.1:3001/conv', {
			name: groupName,
			status: isPrivate,
			password: password
		});
		if (!out || !out.data || out.status < 200 || out.status >= 300 || out.data.status)
			return;
		out = out.data;
		for (let i = 0; i < selectedPeople.length; i++)
			await axios.get(`http://127.0.0.1:3001/conv/${out.ID}/users/${selectedPeople[i]}`);
		await axios.get(`http://127.0.0.1:3001/conv/${out.ID}/users/${JSON.parse(sessionStorage.getItem('userData')).ID}`);
		await axios.get(`http://127.0.0.1:3001/conv/${out.ID}/admins/${JSON.parse(sessionStorage.getItem('userData')).ID}`);
		setCurrentView("messages");
		onOpenConversation((await axios.get(`http://127.0.0.1:3001/conv/${out.ID}`)).data);
	}

	function handleAddFriend() {
		if (timeoutIdConv)
			clearTimeout(timeoutIdConv);
		user = JSON.parse(sessionStorage.getItem('userData'));
		const peopleOptions = user.Friends;
		if (!peopleOptions)
			return;

		setCreateGroup(
		<div className='EmptyCanvas'>
			<div>
				<label htmlFor="name">Nom du chat:</label>
				<input type="text" id="name" name="name" required/>
			</div>
			<div>
				<label htmlFor="pseudo">Pseudo:</label>
				<input type="text" id="pseudo" name="pseudo" required/>
			</div>
			<button type="button" onClick={handleFormSubmit2}>Soumettre</button>
		</div>
		);
		setCurrentView("addPerson");
	}

	async function handleFormSubmit2() {
		// Utilisez les variables groupName, isPrivate, password et selectedPeople pour traiter le formulaire
		let groupName = document.getElementById("name").value;
		let pseudo = document.getElementById("pseudo").value;
		if (!groupName || !pseudo || groupName.length === 0 || pseudo.length === 0)
			return;

		let user = await axios.get(`http://127.0.0.1:3001/users/${pseudo}/pseudo`);
		if (!user || !user.data || user.status !== 200 || user.data.status)
			return;
		user = user.data;
		let out = await axios.post('http://127.0.0.1:3001/conv', {
			name: groupName,
			status: 2,
			password: null
		});
		if (!out || !out.data || out.status < 200 || out.status >= 300 || out.data.status)
			return;
		out = out.data;
		let tout = await axios.get(`http://127.0.0.1:3001/users/${JSON.parse(sessionStorage.getItem('userData')).ID}/friends/${user.Pseudo}/add`);
		if (!tout || !tout.data || tout.status < 200 || tout.status >= 300 || tout.data.status)
			return;
		await axios.get(`http://127.0.0.1:3001/conv/${out.ID}/users/${user.ID}`);
		await axios.get(`http://127.0.0.1:3001/conv/${out.ID}/users/${JSON.parse(sessionStorage.getItem('userData')).ID}`);
		await axios.get(`http://127.0.0.1:3001/conv/${out.ID}/admins/${JSON.parse(sessionStorage.getItem('userData')).ID}`);
		setCurrentView("messages");
		onOpenConversation((await axios.get(`http://127.0.0.1:3001/conv/${out.ID}`)).data);
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
				<button className="CreateGroupChat-btn" onClick={handleAddFriend}>ADD FRIEND</button>
				{pchatComponents}
				</div>
				<div className="GroupChats">
				<p>GROUP CHATS</p>
				<button className="CreateGroupChat-btn" onClick={handleAddPerson}>CREAT A NEW GROUP</button>
				{gchatComponents}
				</div>
			</div>
			{/* Conditionnellement afficher soit le GameCanvas, soit le MessageCanvas */}
			{((currentView === "game") ? <GameCanvas /> : (currentView === "messages") ? messages:(currentView === "addPerson") ? createGroup : ( <div className='EmptyCanvas'></div>))}
			{userInfoComponents}
			</div>
		</div>
	);
}


//Il faut creer un timeoutid  remplacer timeoutidconv par celui que l'on veut
/*
const [timeoutId, setTimeoutId] = useState(null);


if (timeoutIdConv)
	clearTimeout(timeoutIdConv);
setTimeoutIdConv( await setTimeout(async () => {
onOpenConversation((await axios.get(`http://127.0.0.1:3001/conv/${datas.ID}`)).data)
}, 1000));
*/