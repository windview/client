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

	getTitle() {
		let text = "Aggregate";
		if (this.props.aggregatedSource === 'polygonFarms') {
			text = 'Select desired wind farms using the polygon selection tool in the upper right corner of the map.';
		}
		if (this.props.aggregatedSource === 'visibleFarms') {
			text= 'Move the map or zoom out so wind farms are visible.';
		}
		if (this.props.aggregatedSource === 'groupedFarms') {
			text = 'Select the desired group of wind farms from the dropdown menu in the navigation bar.';
		}
		return text;
	}

  render() {

    const el = (this.props.botChartType === "aggregation") ? <AggregatedForecastChart /> : <MultiChart />;

    return <div className="bot-chart-area">
			<div className="bot-chart-title">
				{this.getTitle()}
			</div>
    	<div className="bot-chart-option">
    		<label>
	    		<input type="radio" name="botchart" value="aggregation" checked={this.props.botChartType === "aggregation"} onChange={this.whenAggregationChecked} />
	    		Aggregated Chart
    		</label>
    		<label>
    			<input type="radio" name="botchart" value="multiple" checked={this.props.botChartType === "multiple"} onChange={this.whenMultipleChecked} />
    			Multi Chart
    		</label>
    	</div>
    	<div className={this.props.botChartType === "multiple" ? "bot-multichart-container" : "bot-chart-container"}>
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