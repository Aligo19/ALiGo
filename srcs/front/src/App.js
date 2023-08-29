import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from "./components/Navbar";
import PrivateChats from "./components/Main/Groups/PrivateChats";
import GroupChats from "./components/Main/Groups/GroupChats";
import MessageCanvas from "./components/Main/MessageCanvas";
import UserInfo from "./components/Main/UserInfo";
import Login from './components/Main/Login';
import Game from './components/Main/Game';

const clock = 500;

// try {
// 	output = await axios.patch('http://127.0.0.1:3001/users/' + oldUser.ID, newUser);
// } catch (error) {
// 	window.location.replace('http://127.0.0.1:3000/error.html');
// }

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
	const [gestion, setGestion] = useState([]);

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

  	async function fetchUserInfo() {
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
		async function connect()
		{
			if (!JSON.parse(sessionStorage.getItem('userData'))) 
			{
				sessionStorage.setItem('statusConv', 0);
				sessionStorage.setItem('idConv', 0);
				const code = new URLSearchParams(window.location.search).get('code');
				if (!code)
				{
					window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-3877a3e700b6b8841a31f110495b6d430ce41dc60be48f28aeca81423a03577b&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000&response_type=code');
					return;
				}
				let response = await axios.get(`http://127.0.0.1:3001/users/${code}/login`);
				response = response.data;
				if (response.data)
				{
					sessionStorage.setItem('status', 1);
					response = response.data;
				}
				sessionStorage.setItem('idUserInfos', response.ID);
				
				if (response.email && response.email.length > 0 && sessionStorage.getItem('status') != 2)
				{
					sessionStorage.setItem('status', 2);
					axios.post(`http://127.0.0.1:3001/mail/welcome`, {
						email: response.email,
						pseudo: response.Pseudo
					})
					sessionStorage.setItem('userData', JSON.stringify({
						data: "bouh"
					}));
				}
				else if (sessionStorage.getItem('status') != 2)
					sessionStorage.setItem('userData', JSON.stringify(response));
				window.location.replace('http://127.0.0.1:3000');
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
				setTimeoutIdConvs( await setTimeout(async () => { fetchChats() }, clock));
			} catch (error) {
				console.error("Error fetching chats:", error);
			}
		}

		connect();
		fetchUserInfo();
		fetchChats();
		fetchMatchHisto();
		onOpenConversation();
	}, []);

	const userInfoComponents = <UserInfo 
		name={userData.Pseudo} avatar={userData.Avatar} lstCo={userData.Last_connection} 
		level={userData.Elo} winnb={userData.Wins} losenb={userData.Loses} histo={matchHisto} />;
	
	let pchatComponents = [],
		gchatComponents = [];

	if (pchats)
	{
		pchatComponents = pchats.map(item => (
			<PrivateChats key={item.ID} name={item.Name} value={item.ID} fetchUserInfo={fetchUserInfo} />
		));
	}
	if (gchats)
	{
		gchatComponents = gchats.map(item => (
			<GroupChats key={item.ID} name={item.Name} value={item.ID} status={item.Status} fetchUserInfo={fetchUserInfo} />
		));
	}
	
	function onSubmitPassword(datas, password) {
		if (!password || datas.Password !== password)
			return ;
		sessionStorage.setItem('statusConv', 0);
		sessionStorage.setItem('idConv', datas.ID);
	}

	async function control(datasConv) {
		sessionStorage.setItem('statusConv', 0);
		sessionStorage.setItem('idConv', 0);
		setCurrentView("gestion");
		let user = '';
		if (datasConv.Users)
		{
			user = datasConv.Users.map((user, index) => {
				let buttonUser= '';
				let buttonAdmin = '';
				let buttonMuted = '';
				let owner = '';
				if (datasConv.Admin && datasConv.Admin.find((admin) => admin.ID === user.ID))
				{
					if (datasConv.Admin && datasConv.Admin[0].ID === user.ID && datasConv.Admin[0].ID !== JSON.parse(sessionStorage.getItem('userData')).ID)
					{
						buttonAdmin = '';
					}
					else
					{
						buttonAdmin = <button className="ConvSettingsContent-btn" onClick={async () => {
							if (datasConv.Admin && datasConv.Admin.length === 1)
								return ;
							await axios.get(`http://127.0.0.1:3001/conv/${datasConv.ID}/admins/${user.ID}/remove`);
							window.alert("User demoted");
							sessionStorage.setItem('idConv', datasConv.ID);
							window.location.reload();
						}}>DEMOTE</button>;
					}
				}

				else
					buttonAdmin = <button className="ConvSettingsContent-btn" onClick={async () => {
						await axios.get(`http://127.0.0.1:3001/conv/${datasConv.ID}/admins/${user.ID}`);
						window.alert("User promoted");
						sessionStorage.setItem('idConv', datasConv.ID);
						window.location.reload();
					}}>PROMOTE</button>;
				if (datasConv.Muted && datasConv.Muted.find((muted) => muted.ID === user.ID))
					buttonMuted = <button className="ConvSettingsContent-btn" onClick={async () => {
						await axios.get(`http://127.0.0.1:3001/conv/${datasConv.ID}/muteds/${user.ID}/remove`);
						window.alert("User unmuted");
						sessionStorage.setItem('idConv', datasConv.ID);
						window.location.reload();
					}}>UNMUTE</button>;
				else
					buttonMuted = <button className="ConvSettingsContent-btn" onClick={async () => {
						await axios.get(`http://127.0.0.1:3001/conv/${datasConv.ID}/muteds/${user.ID}`);
						window.alert("User muted");
						sessionStorage.setItem('idConv', datasConv.ID);
						window.location.reload();
					}}>MUTE</button>;
				buttonUser = <button className="ConvSettingsContent-btn" onClick={async () => {
					await axios.get(`http://127.0.0.1:3001/conv/${datasConv.ID}/users/${user.ID}/remove`);
					window.alert("User removed");
					window.location.reload();
				}}>REMOVE</button>;
				if (datasConv.Admin && datasConv.length && datasConv.Admin[0].ID === user.ID)
					owner = "Owner";
				
				return (
					<div key={index} className="ConvSettingsContent">
						<div className="ConvSettingsContent-name">{user.Pseudo + " " + owner}</div>
						{buttonUser}
						{buttonAdmin}
						{buttonMuted}
					</div>
				);
		})
		}
		setGestion(	<div className="MessageCanvas">
						<div className="MessageContainer">
							<div className="ConvSettings-title">
								{datasConv.Name} chat settings
							</div>
						</div>
						<div align-content="stretch">{user}</div>
						<button className="ConvSettingsBack-btn" onClick={async () => {
							sessionStorage.setItem('statusConv', 0);
							sessionStorage.setItem('idConv', datasConv.ID);
						}}>Back</button>
					</div>);
	}

	async function onOpenConversation() {
		let id = sessionStorage.getItem('idConv');
		if (id == undefined)
			id = 0;
		if (id == 0)
		{
			if (timeoutIdConv)
				clearTimeout(timeoutIdConv);
			setTimeoutIdConv( await setTimeout(async () => {
				onOpenConversation();
			}, clock));
			return ;
		}
		showMessageCanvas();
		let datas = null;
		try {
			datas = await axios.get(`http://127.0.0.1:3001/conv/${id}`);
			datas = datas.data;
		}
		catch (error)
		{
			if (timeoutIdConv)
				clearTimeout(timeoutIdConv);
			setTimeoutIdConv( await setTimeout(async () => {
				onOpenConversation();
			}, clock));
			return ;
		}
		const datasUser = JSON.parse(sessionStorage.getItem('userData'));
		let newMessages = [];
		
		if (sessionStorage.getItem('statusConv') == 1)
		{
			setMessages(	<div className="MessageCanvas">
								<div className="MessageContainer">
									<div className="ConvSettings-title">
										{datas.Name}
									</div>
								</div>
									<input
										id="password"
										className="Text-input"
										type="password"
										name="password"
										placeholder="Password"
										style={{ width: '95%' }}
										onKeyDown={(e) => {
											if (e.key === 'Enter')
												onSubmitPassword(datas, document.getElementById('password').value);
										}}
									/>
									<button
										className="ConvSettings-btn"
										onClick={() => onSubmitPassword(datas, document.getElementById('password').value)}
									>
										Submit
									</button>
							</div>);
			if (timeoutIdConv)
				clearTimeout(timeoutIdConv);
			setTimeoutIdConv( await setTimeout(async () => {
				onOpenConversation();
			}, clock));
			return ;
		}

		if (datas.Messages)
		{
			newMessages = datas.Messages.map((item, index) => {
				const user = datas.Users.find((user) => user.ID === item.ID_user);
				return (
				<MessageCanvas key={index} content={item.data} sent={datasUser.ID === item.ID_user} user={user} fetchUserInfo={fetchUserInfo}/>
				);
			});
		}

		let button = '';
		if (datas.Status !== 2 /*&& datas.Admins && datas.Admins.find((user) => user.ID === datasUser.ID)*/)
		{
			button = <button className="ConvSettings-btn" onClick={() => {control(datas)}}>
						Settings
					</button>;
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
								{button}
						</div>);
		if (timeoutIdConv)
			clearTimeout(timeoutIdConv);
		setTimeoutIdConv( await setTimeout(async () => {
			onOpenConversation();
		}, clock));
	}

	async function sendMessage(oldDatas) {
		if (document.getElementById('inputText').value === '')
			return;
		const datas = JSON.parse(sessionStorage.getItem('userData'));
		if (oldDatas.Muted.find((user) => user.ID === datas.ID))
		{
			window.alert("Vous êtes mute");
			return;
		}
		if (oldDatas.Blocked && oldDatas.Blocked.find((user) => user.ID === datas.ID))
		{
			window.alert("Vous êtes bloqué");
			return;
		}
		let out = await axios.post(`http://127.0.0.1:3001/conv/${oldDatas.ID}/message`, {
			ID_user: datas.ID,
			data: document.getElementById('inputText').value,
			Logged_at: Date.now()});
		document.getElementById('inputText').value = '';
	}

	function showGameCanvas() {
		if (timeoutIdConv)
				clearTimeout(timeoutIdConv);
		setCurrentView("game");
	}

	function showMessageCanvas() {
		setCurrentView("messages");
	}

	function handleAddPerson() {
		sessionStorage.setItem('statusConv', 0);
		sessionStorage.setItem('idConv', 0);
		let user = JSON.parse(sessionStorage.getItem('userData'));
		const peopleOptions = user.Friends;
		if (!peopleOptions)
			return;

		setCreateGroup(	<div className='addGroupConvForm'>
							<div className="addGroupConvForm-input-group">
								<label className="addGroupConvForm-custom-label" htmlFor="name">CHAT NAME :</label>
								<input className="addGroupConvForm-input" type="text" id="name" name="name" required/>
							</div>
							<div className="addGroupConvForm-input-group">
								<label className="addGroupConvForm-custom-label" htmlFor="isPrivate">PRIVATE ?</label>
								<input className="addGroupConvForm-input" type="checkbox" id="isPrivate" name="isPrivate"/>
							</div>
							<div className="addGroupConvForm-input-group">
								<label className="addGroupConvForm-custom-label" htmlFor="password">PASSWORD :</label>
								<input className="addGroupConvForm-input" type="password" id="password" name="password"/>
							</div>
							<div className="addGroupConvForm-input-group-list">
								<label className="addGroupConvForm-custom-label">ADD FRIENDS :</label>{peopleOptions.map((person, index) => (
									<div key={index}>
									<input className="addGroupConvForm-checkBox"
										type="checkbox"
										id={`person-${person.ID}`}
										name={`person-${person.ID}`}
										value={person.ID}
									/>
									<label className="addGroupConvForm-custom-label" htmlFor={`person-${person.ID}`}>{person.Pseudo}</label>
									</div>
								))}
							</div>
							<button className="addGroupConvForm-button" type="button" onClick={handleFormSubmit}>Submit</button>
						</div>);
		setCurrentView("addPerson");
	}

	async function connect(groupName, isPrivate, password)
	{
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
		return out.data;
	}

	async function handleFormSubmit() {
		sessionStorage.setItem('statusConv', 0);
		sessionStorage.setItem('idConv', 0);
		let groupName = document.getElementById("name").value,
			isPrivate,
			password = null,
			selectedPeople = [],
			peopleOptions;
		// Utilisez les variables groupName, isPrivate, password et selectedPeople pour traiter le formulaire
		if (document.getElementById("isPrivate"))
		{
			isPrivate = document.getElementById("isPrivate").checked ;
			password = document.getElementById("password").value;
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
		}
		else
		{
			isPrivate = 2;
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
			let me = JSON.parse(sessionStorage.getItem('userData'));
			let tout = await axios.get(`http://127.0.0.1:3001/users/${me.ID}/friends/${user.Pseudo}/add`);

			if (user.ID === me.ID)
			{
				window.alert("Vous ne pouvez pas vous ajouter vous même");
				return;
			}
			console.log(me);
			if (me.Friends.find((friend) => friend.ID === user.ID))
			{
				window.alert("Vous êtes déjà ami avec cette personne");
				return;
			}
			selectedPeople.push(user.ID);
		}
		let out = await connect(groupName, isPrivate, password);
		for (let i = 0; i < selectedPeople.length; i++)
			await axios.get(`http://127.0.0.1:3001/conv/${out.ID}/users/${selectedPeople[i]}`);
		await axios.get(`http://127.0.0.1:3001/conv/${out.ID}/users/${JSON.parse(sessionStorage.getItem('userData')).ID}`);
		await axios.get(`http://127.0.0.1:3001/conv/${out.ID}/admins/${JSON.parse(sessionStorage.getItem('userData')).ID}`);
		setCurrentView("messages");
		sessionStorage.setItem('statusConv', 0);
		sessionStorage.setItem('idConv', out.ID);
	}

	async function pwdMail(){
		let out = await axios.get(`http://127.0.0.1:3001/users/${(sessionStorage.getItem('idUserInfos'))}/password/${document.getElementById('password').value}`);
		if (!out || !out.data || out.status < 200 || out.status >= 300 || out.data.status)
		{
			window.alert("Mauvais mot de passe");
			return;
		}
		out = out.data;
		sessionStorage.setItem('userData', JSON.stringify(out));
		sessionStorage.setItem('status', 0);
	}

	function handleAddFriend() {
		sessionStorage.setItem('statusConv', 0);
		sessionStorage.setItem('idConv', 0);
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
							<button type="button" className="addFriendForm-button" onClick={handleFormSubmit}>Confirm</button>
						</div>);
		setCurrentView("addPerson");
	}

	let content;
	if (sessionStorage.getItem('status') == 1)
	{
		const localUser = JSON.parse(sessionStorage.getItem('userData'));
		content = <Login 
		Pseudo={localUser.Pseudo} 
		Avatar={localUser.Avatar} 
		update={update} />;

	}
	else if (sessionStorage.getItem('status') == 2)
	{
		content = <div>
					<div>
						<h1>Mot de passe fourni par mail</h1>
						<input
							id="password"
							className="Text-input"
							type="password"
							name="password"
							placeholder="Password"
							style={{ width: '95%' }}
							onKeyDown={(e) => {
								if (e.key === 'Enter')
								{
									pwdMail();
								}
							}}
						/>
					</div>
				</div>
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
					{((currentView === "game") ? <Game /> : (currentView === "messages") ? messages:(currentView === "addPerson") ? createGroup :(currentView === "login") ? <Login />:(currentView === "gestion") ? gestion : ( <div className='EmptyCanvas'></div>))}
					{/* User Infos */}
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
}, clock));
*/