import React from 'react';
import {Chart} from 'react-google-charts';

interface StatsProps {
    winnb: number;
    losenb: number;
    level: number;
}

const Stats: React.FC<StatsProps> = (props:any) => {
    const { winnb: wins, losenb: loses, level } = props;
    const isEmpty = wins === 0 && loses === 0;

    if (isEmpty) {
        return (
            <div className="Stat">
                <h3>Elo {level} </h3>
            </div>
        )
    } else {
        return (
            <div className="Stat">
                <h3>Elo {level} </h3>
                <Chart 
                    className="Stat--pie"
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={[	
                        ['W/L', 'number'],
                        ['WINS', wins],
                        ['LOSES', loses],
                    ]}
                    options={{	
                        pieHole: 0.4,
                        colors: ['#7289da', '#23272a', '#1e2124'],
                        backgroundColor: 'transparent',
                        legend: { position: 'top-right', textStyle: { color: '#99AAB5', font: 'Geneva' }, fontSize: 58 },
                        pieSliceText: 'none',
                        pieSliceBorderColor: { color: '#7289da' },
                    }}
                    rootProps={{ 'data-testid': '1' }}
                />
            </div>
        )
    }
}

export default Stats;
