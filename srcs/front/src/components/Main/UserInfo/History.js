export default function History(props) {
	const matchs = [['W', 'Hugo', [3,5]], ['L', 'Lisa' , [0,5]] , ['L', 'AutreHugo',[3,9]]];
	// const matchs = props.history;
	return (
		<div className="History">
			<h3>Match history</h3>
			<ul className="History-list">
        		{matchs.map((match, index) => (
        		<li key={index} className="History-item">
				{match[0]}	vs.	<i>{match[1]}</i>	{match[2][0]} - {match[2][1]}</li>))}
      		</ul>
		</div>
	)
}
