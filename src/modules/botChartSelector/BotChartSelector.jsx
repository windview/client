import React from 'react';
import { connect } from 'react-redux';
import './BotChartSelector.scss';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import AggregatedForecastChart from '../aggregatedForecastChart/AggregatedForecastChart';
import MultiChart from '../multiChart/MultiChart';

export class BotChartSelector extends React.Component {
	componentDidMount() {

  }
  constructor(props) {
    super(props);
    this.whenAggregationChecked = this.whenAggregationChecked.bind(this);
    this.whenMultipleChecked = this.whenMultipleChecked.bind(this);
  }

  render() {

    const el = (this.props.state.analysis.botChartType === "aggregation") ? <AggregatedForecastChart /> : <MultiChart />;

    return <div className="bot-chart-area">
			<div className="bot-chart-title">
				Aggregated Forecast for Selected Wind Farms
			</div>
    	<div className="bot-chart-option">
    		<label>
	    		<input type="radio" name="botchart" value="aggregation" checked={this.props.state.analysis.botChartType === "aggregation"} onChange={this.whenAggregationChecked} />
	    		Aggregated Chart
    		</label>
    		<label>
    			<input type="radio" name="botchart" value="multiple" checked={this.props.state.analysis.botChartType === "multiple"} onChange={this.whenMultipleChecked} />
    			Multi Chart
    		</label>
    	</div>
    	<div className={this.props.state.analysis.botChartType === "multiple" ? "bot-multichart-container" : "bot-chart-container"}>
    		{el}
    	</div>
    </div>
  }

  whenAggregationChecked(e) {
    this.props.onSelectBotChart(e.target.value);
  }

  whenMultipleChecked(e) {
    this.props.onSelectBotChart(e.target.value);
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(BotChartSelector);