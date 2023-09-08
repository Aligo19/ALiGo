import React from 'react';
import axios from 'axios';
import * as dotenv from 'dotenv';

import Stats from "./UserInfo/Stats";
import History from "./UserInfo/History";

interface UserProps {
    name: string;
    lstCo: string;
    Game_status: boolean;
    avatar: string;
    level: number;
    winnb: number;
    losenb: number;
    histo: any[]; // Remplacez any[] par le type approprié de votre historique
}

export default function UserInfo(props: UserProps) {

	dotenv.config();

    async function erase() {
        try {
            await axios.get(process.env.URL_API + `users/${props.name}/pseudo`);
            await axios.get(process.env.URL_API + `users/${JSON.parse(sessionStorage.getItem('userData')!).ID}/block/${props.name}/add`);
            await axios.get(process.env.URL_API + `conv/${JSON.parse(sessionStorage.getItem('userData')!).ID}/erase/${props.name}`);
            sessionStorage.setItem('idUserInfos', JSON.parse(sessionStorage.getItem('userData')!).ID);
            sessionStorage.setItem('idConv', '0');
            window.location.reload();
        } catch (error) {
            console.error('Error erasing user:', error);
        }
    }

    const currentTime = new Date();
    const lastConnectionTime = new Date(Date.parse(props.lstCo));
    const timeDifference = lastConnectionTime ? (currentTime.getTime() - lastConnectionTime.getTime()) / 1000 : null;
    let statusPointClass = (timeDifference !== null && timeDifference <= 600) ? 'online' : 'offline';

    if (statusPointClass === 'online' && props.Game_status) {
        statusPointClass = 'ingame';
    }

    if (!JSON.parse(sessionStorage.getItem('userData')!)) return <div></div>;

    let button = null;
    let isFriend = null;

    if (props.name === JSON.parse(sessionStorage.getItem('userData') || 'null').Pseudo) {
        button = <button className="erase-btn" onClick={() => sessionStorage.setItem('status', '1')}>Settings</button>;
        isFriend = <span></span>;
    } else {
        const friendList = JSON.parse(sessionStorage.getItem('userData')!).Friends;
        let isCurrentFriend = friendList.some((friend: any) => friend.Pseudo === props.name);

        if (isCurrentFriend) {
            button = <button className="erase-btn" onClick={erase}>Delete friend</button>;
            isFriend = <p className="UserInfo--smiley">&#10084;</p>;
        } else {
            isFriend = <p>&#x2716;</p>;
        }
    }

    const pic = props.avatar?.includes('http') ? props.avatar : process.env.URL_API + `${props.avatar}`;

    return (
        <div className="UserInfo">
            <div className="UserInfoProfile">
                {isFriend}
                <h2 className="UserInfo--title">{props.name}</h2>
                <div className={`status-point ${statusPointClass}`}></div>
            </div>
            <img src={pic} alt="avatar" className="Avatar" />
            <Stats level={props.level} winnb={props.winnb} losenb={props.losenb} />
            <History histo={props.histo} />
            {button}
        </div>
    );
}
