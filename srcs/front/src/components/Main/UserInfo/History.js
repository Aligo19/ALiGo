export default function History(props) {
	if (!props.histo || props.histo.length === 0) {
		return (
			<div className="History">
				<h3>Match history</h3>
			 	<h4 className="Stat--noMatch">NO MATCHS YET</h4>
			</div>)
	}
	let matchs = [];	
	let res, userVs, frst, scd, str;
	const x = JSON.parse(sessionStorage.getItem('userData'));
	props.histo.map(item => {
		if (x.ID === item.ID_user1)
		{
			userVs = item.ID_user2;
			frst = item.Score_user1;
			scd =item.Score_user2;
			if (item.Score_user2 > item.Score_user1)
				res = 'L';
			else
				res = 'W';
		}
		else /* x.ID == match.ID_user2 */
		{
			userVs = item.ID_user1;
			frst = item.Score_user2;
			scd =item.Score_user1;
			if (item.Score_user1 > item.Score_user2)
				res = 'L';
			else
				res = 'W';
		}
		str = res + "	vs.	" + userVs + "	" + frst + " - " + scd;
		matchs.push(str);
	});

	let matchHistoComponenets = matchs.map((match, index) => 
	(<li key={index} className="History-item">{match}</li>));

	return (
		<div className="History">
			<h3>Match history</h3>
			<ul className="History-list">
				{matchHistoComponenets};
      		</ul>
		</div>
	)
}
