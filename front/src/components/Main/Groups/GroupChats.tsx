import React from 'react';

interface GroupChatsProps {
    value: string;
    status: string;
    name: string;
}

const GroupChats: React.FC<GroupChatsProps> = (props:any) => {

    async function openConversation(props: GroupChatsProps) {
        try {
            sessionStorage.setItem('idConv', props.value);
            sessionStorage.setItem('statusConv', props.status);
            const userData = sessionStorage.getItem('userData');
            if (userData) {
                const parsedData = JSON.parse(userData);
                sessionStorage.setItem('idUserInfos', parsedData.ID);
            }
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

export default GroupChats;
