import React from "react";

interface MessageCanvasProps {
    sent: boolean;
    user: {
        ID: string;
        Pseudo: string;
    };
    content: string;
    
}

export default function MessageCanvas(props: MessageCanvasProps) {
    function userInfoLoaded(id: string) {
        sessionStorage.setItem('idUserInfos', id);
    }

    if (!props.sent) {
        return (
            <div>
                <div className="Message-username" style={{ cursor: 'pointer' }} onClick={() => userInfoLoaded(props.user.ID)}>
                    {props.user.Pseudo}
                </div>
                <div className={"Message Message-received"}>
                    {props.content}
                </div>
            </div>
        )
    }

    return (
        <div className={"Message Message-sent"}>
            {props.content}
        </div>
    );
}
