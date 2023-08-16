import React from 'react';
import axios from 'axios';

function PrivateChats(props) {
	async function openConversation(props) {
		console.log(props);
		try {
		  const response = await axios.get(`http://127.0.0.1:3001/conv/${props.value}`);
		  const conversationDetails = response.data;
		  props.onOpenConversation(conversationDetails);
		} catch (error) {
		  console.error('Error opening conversation:', error);
		}
	  }

  return (
		<div className="Player-btn">
			<div className="Player-name" style={{ cursor: 'pointer' }} onClick={() => openConversation(props)}>
				{props.name}
			</div>
			<div className="Play-btn">
				&gt;
			</div>
		</div>
	);
}

export default PrivateChats