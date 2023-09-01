import PageRenderer from "./components/PageRenderer";

import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';


export default function PageRenderer({ pagesData, navigate, match }) {
	const { path } = match;
	const currentPage = pagesData.find(page => page.path === path);
  
	if (!currentPage) {
	  return <div>Page introuvable</div>;
	}
  
	const goToPreviousPage = () => {
	  navigate(-1);
	};
  
	return (
	  <div>
		<h1>{currentPage.title}</h1>
		<p><button onClick={goToPreviousPage}>Retour</button></p>
		<p>{currentPage.content}</p>
	  </div>
	);
}

	
const pagesData = [
	{ path: '/components/Main', title: 'Main Page', content: 'Main Page'},
	{ path: '/components/Navbar', title: 'Navbar Page', content: 'Navbar Page'},
	{ path: '/components/Main/Login', title: 'Login Page', content: 'Login Page'},
	{ path: '/components/Main/UserInfo', title: 'User Info Page', content: 'User Info Page'},
	{ path: '/components/Main/MessagesCanvas', title: 'Messages Canvas Page', content: 'Messages Canvas Page'},
	{ path: '/components/Main/GamesCanvas', title: 'Games Canvas Page', content: 'Games Canvas Page'},
	{ path: '/components/Main/UserInfo/History', title: 'History Page', content: 'History Page'},
	{ path: '/components/Main/UserInfo/stats', title: 'Stats Page', content: 'Stats Page'},
	{ path: 'index', title: 'Index Page', content: 'Index Page'},
];

function CustomRoute() {
	const navigate = useNavigate();
  
	return (
		<Routes>
			{pagesData.map((page, index) => {
			<Route
				key={index}
				path={page.path}
				element={<PageRenderer pagesData={pagesData} navigate={navigate} />}
				/>
			})}
		</Routes>
	);
}
let dataRoutes = <CustomRoute />;


return;
let pseudo = '';
if (!userNameTrue)
{
	pseudo = 	(<div>
					<label className="addFriendForm-custom-label" htmlFor="pseudo">PSEUDO</label>
					<input className="addFriendForm-input" type="text" id="pseudo" name="pseudo" required/>
				</div>);
}
else
{
	pseudo = 	(<div>
					<label className="addFriendForm-custom-label" htmlFor="pseudo">PSEUDO</label>
					<input className="addFriendForm-input" type="text" id="pseudo" name="pseudo" value={userNameTrue} required/>
				</div>);
}
setCreateGroup(	<div className="addFriendForm">
					<div className="addFriendForm-input-group" >
						<label className="addFriendForm-custom-label" htmlFor="name">CHAT NAME</label>
						<input className="addFriendForm-input" type="text" id="name" name="name" required/>
					</div>
					<div className="addFriendForm-input-group" >
						{pseudo}
					</div>
					<button type="button" className="addFriendForm-button" onClick={handleFormSubmit}>Confirm</button>
				</div>);
setCurrentView("addPerson");
}