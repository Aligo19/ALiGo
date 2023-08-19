export default function MessageCanvas(props) {
	function userInfoLoaded(id) 
	{
		props.fetchUserInfo(id);
	}

	if (!props.sent)
	{
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
	)
}
