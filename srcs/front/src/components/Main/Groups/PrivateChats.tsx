import React from 'react';

interface PrivateChatsProps {
    value: string;
    name: string;
}

const PrivateChats: React.FC<PrivateChatsProps> = (props:any) => {
    async function openConversation(props: PrivateChatsProps) {
        try {
            sessionStorage.setItem('idConv', props.value);
            sessionStorage.setItem('statusConv', "0");
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
        <div className="Player-btn">
            <div className="Player-name" style={{ cursor: 'pointer' }} onClick={() => openConversation(props)}>
                {props.name}
            </div>
        </div>
    );
}

export default PrivateChats;
