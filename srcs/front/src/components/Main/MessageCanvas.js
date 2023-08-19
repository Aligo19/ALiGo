export default function MessageCanvas(props) {
	const isSent = props.sent ? "Message-sent" : "Message-received"

	return (
		<div className={"Message " + isSent}>{props.content}</div>
	)
}
