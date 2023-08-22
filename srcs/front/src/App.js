import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from "./components/Navbar";
import PrivateChats from "./components/Main/Groups/PrivateChats";
import GroupChats from "./components/Main/Groups/GroupChats";
import MessageCanvas from "./components/Main/MessageCanvas";
import UserInfo from "./components/Main/UserInfo";
import GameCanvas from './components/Main/GameCanvas';
import Login from './components/Main/Login';

export default function App() {
  const [gchats, setGChats] = useState([]);
  const [pchats, setPChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [createGroup, setCreateGroup] = useState([]);
  const [currentView, setCurrentView] = useState("");
  const [userData, setUserData] = useState([]);
  const [timeoutIdConv, setTimeoutIdConv] = useState(null);
  const [timeoutIdConvs, setTimeoutIdConvs] = useState(null);
  const [timeoutIdUserInfos, setTimeouIdUserInfos] = useState(null);
  const [matchHisto, setMatchHisto] = useState([]);

   async function update(newUser) {
	let oldUser = JSON.parse(sessionStorage.getItem('userData'));
		let output = await axios.patch('http://127.0.0.1:3001/users/' + oldUser.ID, newUser);
		if (!output || !output.data || output.status < 200 || output.status >= 300 || output.data.status)
		{
			window.alert("Error while updating user");
			return ;
		}
		sessionStorage.removeItem('status');
		output = await axios.get('http://127.0.0.1:3001/users/' + oldUser.ID);
		if (!output || !output.data || output.status < 200 || output.status >= 300 || output.data.status)
		{
			window.alert("Error while updating user");
			return ;
		}
		output = output.data;
		setUserData(output);
		sessionStorage.setItem('userData', JSON.stringify(output));
	  }

  	async function fetchUserInfo(id = null) {
		try {
			let userProfile;
			if (!id)
			{
				const y = JSON.parse(sessionStorage.getItem('userData'));
				userProfile = (await axios.get(`http://127.0.0.1:3001/users/${y.ID}`));
				if (!userProfile || !userProfile.data || userProfile.status < 200 || userProfile.status >= 300 || userProfile.data.status)
					return ;
				userProfile = userProfile.data;
				sessionStorage.setItem('userData', JSON.stringify(userProfile));
				id = userProfile.ID;
			}
			else
				userProfile = (await axios.get(`http://127.0.0.1:3001/users/${id}`)).data;
			if (timeoutIdUserInfos)
				clearTimeout(timeoutIdUserInfos);
			setTimeouIdUserInfos(setTimeout(() => fetchUserInfo(id), 10000));
			setUserData(userProfile);
		} catch (error) {
			console.error("Error getting user infos: ", error);
		}
	}

	async function fetchMatchHisto() {
		try {
			const x = JSON.parse(sessionStorage.getItem('userData'));
			const response = await axios.get(`http://127.0.0.1:3001/matches/${x.ID}/user`);
			if (!response || !response.data || response.status < 200 || response.status >= 300 || response.data.status)
				return ;
			setMatchHisto(response.data);
		} catch (error) {
			console.error("Error getting match historique: ", error);
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
						response = response.data
						console.log(response);
						if (response.data)
						{
							sessionStorage.setItem('status', 1);
							response = response.data;
						}
						sessionStorage.setItem('userData', JSON.stringify(response));
						window.location.replace('http://127.0.0.1:3000');
					})
			}
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
	console.log(sessionStorage.getItem('status'));

		fetchUserInfo();
		fetchChats();
		fetchMatchHisto();
	}, []);
		

	console.log(sessionStorage.getItem('status'));


	const userInfoComponents = <UserInfo 
		name={userData.Pseudo} avatar={userData.Avatar} lstCo={userData.Last_connection} 
		level={userData.Elo} winnb={userData.Wins} losenb={userData.Loses} histo={matchHisto} />;
	
	let pchatComponents = [],
		gchatComponents = [];

	if (pchats)
	{
		pchatComponents = pchats.map(item => (
			<PrivateChats key={item.ID} name={item.Name} value={item.ID} onOpenConversation={onOpenConversation} fetchUserInfo={fetchUserInfo} />
		));
	}
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
		if (timeoutIdConv)
			clearTimeout(timeoutIdConv);
		if (document.getElementById('inputText').value === '')
			return;
		const datas = JSON.parse(sessionStorage.getItem('userData'));
		let out = await axios.post(`http://127.0.0.1:3001/conv/${oldDatas.ID}/message`, {
			ID_user: datas.ID,
			data: document.getElementById('inputText').value,
			Logged_at: Date.now()});
		document.getElementById('inputText').value = '';
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

		setCreateGroup(	<div className='EmptyCanvas'>
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
						</div>);
		setCurrentView("addPerson");
	}

	async function handleFormSubmit() {
		if (timeoutIdConv)
			clearTimeout(timeoutIdConv);
		// Utilisez les variables groupName, isPrivate, password et selectedPeople pour traiter le formulaire
		let groupName = document.getElementById("name").value,
			isPrivate = document.getElementById("isPrivate").checked,
			password = document.getElementById("password").value,
			selectedPeople = [],
			peopleOptions = JSON.parse(sessionStorage.getItem('userData')).Friends;
		if (!peopleOptions || !groupName || groupName === '' || (isPrivate && password === '') || peopleOptions.length === 0)
		{
			window.alert("Veuillez remplir tous les champs");
			return;
		}
	
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
		{
			window.alert("Erreur lors de la création du groupe");
			return;
		}
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
		let user = JSON.parse(sessionStorage.getItem('userData'));
		const peopleOptions = user.Friends;
		if (!peopleOptions)
			return;

		setCreateGroup(	<div className="addFriendForm">
							<div className="addFriendForm-input-group" >
								<label className="addFriendForm-custom-label" htmlFor="name">CHAT NAME</label>
								<input className="addFriendForm-input" type="text" id="name" name="name" required/>
							</div>
							<div className="addFriendForm-input-group" >
								<label className="addFriendForm-custom-label" htmlFor="pseudo">PSEUDO</label>
								<input className="addFriendForm-input" type="text" id="pseudo" name="pseudo" required/>
							</div>
							<button type="button" className="addFriendForm-button" onClick={handleFormSubmit2}>Confirm</button>
						</div>);
		setCurrentView("addPerson");
	}

	async function handleFormSubmit2() {
		if (timeoutIdConv)
			clearTimeout(timeoutIdConv);
		// Utilisez les variables groupName, isPrivate, password et selectedPeople pour traiter le formulaire
		let groupName = document.getElementById("name").value;
		let pseudo = document.getElementById("pseudo").value;
		if (!groupName || !pseudo || groupName.length === 0 || pseudo.length === 0)
		{
			window.alert("Veuillez remplir tous les champs");
			return;
		}

		let user = await axios.get(`http://127.0.0.1:3001/users/${pseudo}/pseudo`);
		if (!user || !user.data || user.status !== 200 || user.data.status)
		{
			window.alert("User not found");
			return;
		}

		user = user.data;

		let tout = await axios.get(`http://127.0.0.1:3001/users/${JSON.parse(sessionStorage.getItem('userData')).ID}/friends/${user.Pseudo}/add`);
		if (!tout || !tout.data || tout.status < 200 || tout.status >= 300 || tout.data.status)
		{
			window.alert("Add failed");
			//Redirection vers la conv avec le user et le friend en commun et le status 2
			let conv = await axios.get('http://127.0.0.1:3001/conv/' + JSON.parse(sessionStorage.getItem('userData')).ID + '/user');
			if (!conv || !conv.data || conv.status < 200 || conv.status >= 300 || conv.data.status)
			{
				window.alert("Redirect failed");
				return;
			}
			conv = conv.data;
			for (let i = 0; i < conv.length; i++)
			{
				let find = await axios.get(`http://127.0.0.1:3001/conv/${conv[i].ID}`);
				if (!find || !find.data || find.status < 200 || find.status >= 300 || find.data.status)
					continue;
				find = find.data;
				if (find.Users.length !== 2 || find.Status !== 2)
					continue;
				if (find.Users[0].ID === user.ID || find.Users[1].ID === user.ID)
				{
					setCurrentView("messages");
					onOpenConversation(find);
					return;
				}
			}
			return;
		}
		let out = await axios.post('http://127.0.0.1:3001/conv', {
			name: groupName,
			status: 2,
			password: null
		});
		if (!out || !out.data || out.status < 200 || out.status >= 300 || out.data.status)
		{
			window.alert("Creation failed");
			return;
		}
		out = out.data;
		await axios.get(`http://127.0.0.1:3001/conv/${out.ID}/users/${user.ID}`);
		await axios.get(`http://127.0.0.1:3001/conv/${out.ID}/users/${JSON.parse(sessionStorage.getItem('userData')).ID}`);
		await axios.get(`http://127.0.0.1:3001/conv/${out.ID}/admins/${JSON.parse(sessionStorage.getItem('userData')).ID}`);
		setCurrentView("messages");
		onOpenConversation((await axios.get(`http://127.0.0.1:3001/conv/${out.ID}`)).data);
	}


	let content;
	if (sessionStorage.getItem('status') )
	{
		const localUser = JSON.parse(sessionStorage.getItem('userData'));
		content = <Login Pseudo={localUser.Pseudo} Avatar={localUser.Avatar} update={update} />;

	}
	else
	{
		content = <div className="Main">
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
		{((currentView === "game") ? <GameCanvas /> : (currentView === "messages") ? messages:(currentView === "addPerson") ? createGroup :(currentView === "login") ? <Login />: ( <div className='EmptyCanvas'></div>))}
		{userInfoComponents}
		</div>
	}
	console.log("currentView: " + currentView);
	return (<div className="App">
				<Navbar />
				{content}
			</div>);
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