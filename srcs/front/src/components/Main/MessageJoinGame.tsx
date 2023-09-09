import React from "react";

export default function MessageJoinGame(props: any) {
    function userInfoLoaded(id: string) {
        sessionStorage.setItem('idUserInfos', id);
    }

    if (!props.sent) {
        return (
            <div>
                <div className="Message-username" style={{ cursor: 'pointer' }} onClick={() => userInfoLoaded(props.user.ID)}>
                    {props.user.Pseudo}
                </div>
                <button className={"Message Message-received"} onClick={() => props.joinFriend(props.user.ID)}>
                    {props.content}
                </button>
            </div>
        )
    }

    return (<div></div>);
}
