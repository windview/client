import React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps } from './selectors';
import Forecast from '../../data/forecast';
import moment from 'moment';
import './ForecastMeta.scss';


export class ForecastMeta extends React.Component {

  getDetailMarkup(selectedForecast) {
    const runtime = moment.utc(selectedForecast.generated_at).format('HH:mm M/D UTC'),
          model = selectedForecast.provider_id,
          horizon = selectedForecast.horizon_minutes;

    const el = (
      <div id="forecast-meta" className="forecast-meta">
        <table>
          <tbody>
            <tr>
              <th>Forecaster Model Details</th><th></th>
            </tr>
            <tr>
              <td>Model Name:</td><td className="right">{model}</td>
            </tr>
            <tr>
              <td>Forecast Generated:</td><td className="right">{runtime}</td>
            </tr>
            <tr>
              <td>Forecast Horizon:</td><td className="right">{horizon}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
    return el;
  }

  getSelectedForecast() {
    return Forecast.getForecastForFarm(this.props.selectedFarmId);
  }

  render() {
    const forecast = this.getSelectedForecast();
    if(!forecast) {
      return <div id="forecast-meta"></div>
    } else {
      return this.getDetailMarkup(forecast)
    }
  }
}

export default connect(mapStateToProps, null)(ForecastMeta);
