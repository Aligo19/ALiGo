import React from 'react';
import axios from 'axios';

export default function GroupChats(props) {

  async function openConversation(props) {
    try {
      const response = await axios.get(`http://127.0.0.1:3001/conv/${props.value}`);
      const conversationDetails = response.data;
      props.onOpenConversation(conversationDetails);
    } catch (error) {
      console.error('Error opening conversation:', error);
    }
  }

  return (
    <div className="Group-btn" style={{ cursor: 'pointer' }} onClick={() => openConversation(props)}>
      {props.name}
    </div>
  );
}
