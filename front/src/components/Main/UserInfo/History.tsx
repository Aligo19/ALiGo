import React from 'react';

interface HistoryProps {
    histo?: Array<{
        ID_user1: { ID: number, Pseudo: string },
        ID_user2: { ID: number, Pseudo: string },
        Score_user1: number,
        Score_user2: number
    }>
}

const History: React.FC<HistoryProps> = (props:any) => {
    if (!props.histo || props.histo.length === 0) {
        return (
            <div className="History">
                <h3>Match history</h3>
                <h4 className="Stat--noMatch">NO MATCHS YET</h4>
            </div>
        );
    }
    let matchs: string[] = [];
    let res: string, userVs: string, frst: number, scd: number, str: string;
    const x = parseInt(sessionStorage.getItem('idUserInfos') || '');
    props.histo.forEach((item:any) => {
        if (x === item.ID_user1.ID) {
            userVs = item.ID_user2.Pseudo;
            frst = item.Score_user1;
            scd = item.Score_user2;
        } else {
            userVs = item.ID_user1.Pseudo;
            frst = item.Score_user2;
            scd = item.Score_user1;
        }
        res = (scd > frst) ? 'L' : 'W';
        str = res + "	vs.	" + userVs + "	" + frst + " - " + scd;
        matchs.push(str);
    });

    let matchHistoComponents = matchs.map((match, index) => 
        <li key={index} className="History-item">{match}</li>
    );

    return (
        <div className="History">
            <h3>Match history</h3>
            <ul className="History-list">
                {matchHistoComponents}
            </ul>
        </div>
    );
}

export default History;
