import React from 'react';
import axios from 'axios';

export default function GroupChats(props) {

    async function openConversation(props) {
        try {

        sessionStorage.setItem('idConv', props.value);
        sessionStorage.setItem('statusConv', props.status);
        sessionStorage.setItem('idUserInfos', JSON.parse(sessionStorage.getItem('userData')).ID);
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
