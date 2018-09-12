import React from 'react';
import { connect } from 'react-redux';
import './BotChartSelector.scss';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import AggregatedForecastChart from '../aggregatedForecastChart/AggregatedForecastChart';
import MultiChart from '../multiChart/MultiChart';

export class BotChartSelector extends React.Component {

  constructor(props) {
    super(props);
    this.whenAggregationChecked = this.whenAggregationChecked.bind(this);
    this.whenMultipleChecked = this.whenMultipleChecked.bind(this);
    this.setAggHighlight = this.setAggHighlight.bind(this);
    this.unsetAggHighlight = this.unsetAggHighlight.bind(this);
  }

	getTitle() {
		let text = "Aggregate",
        title = "";
		if (this.props.aggregatedSource === 'polygonFarms') {
			text = 'Select desired wind farms using the polygon selection tool in the upper right corner of the map.';
      title = "Manual Selection";
		}
		if (this.props.aggregatedSource === 'visibleFarms') {
			text= 'Currently displaying aggregation of all visible wind farms.';
      title = "Visible Farms";
		}
		if (this.props.aggregatedSource === 'groupedFarms') {
			text = 'Select the desired group of wind farms from the dropdown menu in the navigation bar.';
      title = this.props.selectedGroupLabel;
		}
		return {
      text,
      title
    };
	}

  render() {

    const el = (this.props.botChartType === "aggregation") ? <AggregatedForecastChart /> : <MultiChart />,
          title = this.getTitle();

    return <div className="bot-chart-area">
			<div className="bot-chart-header">
				<div className="bot-chart-title">
					<strong onMouseOver={this.setAggHighlight} onMouseOut={this.unsetAggHighlight}>{title.title}</strong> <em>{title.text}</em>
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
			</div>
    	<div className={this.props.botChartType === "multiple" ? "bot-multichart-container" : "bot-chart-container"}>
    		{el}
    	</div>
    </div>
  }

  setAggHighlight() {
    this.props.onSetAggHighlight(true);
  }

  unsetAggHighlight() {
    this.props.onSetAggHighlight(false);
  }

  whenAggregationChecked(e) {
    this.props.onSelectBotChart(e.target.value);
  }

  whenMultipleChecked(e) {
    this.props.onSelectBotChart(e.target.value);
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(BotChartSelector);
