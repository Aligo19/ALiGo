import Chart from 'react-google-charts';

export default function Stats(props) {
	const wins  = props.winnb;
	const loses = props.losenb;
	const isEmpty = wins === 0 && loses === 0;
	if (isEmpty) {
		return (
			<div className="Stat">
			<h3>Lvl. {props.level} </h3>
			<h4 className="Stat--noMatch">NO MATCHS YET</h4>
			</div>
		)
	}
	else {
		return (
			<div className="Stat">
			<h3>Lvl. {props.level} </h3>
			<Chart 
				className="Stat--pie"
				chartType="PieChart"
				loader={<div>Loading Chart</div>}
				data={[	
					['W/L', 'number'],
					['WINS', wins],
					['LOSES', loses],]}
				options={{	
					pieHole: 0.4,
					colors: ['#7289da', '#23272a', '#1e2124'],
					backgroundColor: 'transparent',
					legend: { position: 'top-rigth', textStyle: { color: '#99AAB5', font: 'Geneva' }, fontsize: 58, },
					pieSliceText: 'none',
					pieSliceBorderColor: {color: '#7289da', },}}
				rootProps={{ 'data-testid': '1' }}/>
			</div>
		)
	}
}
