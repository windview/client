import React from 'react';
import { connect } from 'react-redux';
import CONFIG from '../../data/config';
import Forecast from '../../data/forecast';
import './AppSettings.scss';
import {mapStateToProps, mapDispatchToProps} from './selectors';


class AppSettings extends React.Component {

  // Generates a total of 3 ramp configuration objects for use in the state
  // of this component for driving the UI. We have a pre-determined max of
  // 3 so we just create 3 blank backfilling properties from CONFIG where
  // present
  getRampStateFromConfig() {
    let preConfigured = CONFIG.get('rampThresholds'),
        empty = {
          level: '',
          powerChange: '',
          timeSpan: '',
          color: ''
        }
    return [0,1,2].map(id=>{
      if(preConfigured[id]) {
        return Object.assign({}, empty, preConfigured[id], {id: id});
      } else {
        return Object.assign({}, empty, {id: id})
      }
    });
  }

  getRampConfigFromState() {
    let userConf = this.state.rampConfigs;
    return userConf.filter(c=>{
      return c.level !== '' && c.powerChange !== '' && c.timeSpan !== '' && c.color !== '';
    });
  }

  getStateFromConfig() {
    let rampConfigs = this.getRampStateFromConfig();
    this.setState({
      rampConfigs: rampConfigs,
      forecastHorizon: CONFIG.get('forecastHorizon'),
      forecastHorizonOptions: [0.5, 1, 2, 3, 5, 7]
    });
  }

  getConfigFromState() {
    CONFIG.set('rampThresholds', this.getRampConfigFromState());
    CONFIG.set('forecastHorizon', this.state.forecastHorizon)
  }

  componentWillMount() {
    // Initial loading of state from config at app startup
    this.getStateFromConfig();
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.props.activePane !== "settings" && nextProps.activePane === "settings") {
      // settings pane is being displayed, init stuff
      this.getStateFromConfig();
    } else if(this.props.activePane === "settings" && nextProps.activePane !== "settings") {
      // settings pane is being navigated away from... apply changes to config
      this.getConfigFromState();
      Forecast.resetAlerts();
      this.props.onAlertDisplay(Forecast.getAllAlerts());
    }
  }

  handleChange(e) {
    let id = e.target.id,
        [category, idx, property] = id.split("-"),
        val = e.target.value;

    switch(category) {
      case 'ramp':
        let rampConfigs = this.state.rampConfigs;
        rampConfigs[idx][property] = val;
        this.setState({
          "rampConfigs": rampConfigs
        });
        break;
      case 'horizon':
        this.setState({
          forecastHorizon: val
        });
        break;
      default:
        console.log(`${category} was changed but no settings handler exists`);
    }
  }

  getAlertSettings() {

    let rampConfigs = this.state.rampConfigs,
        forecastInterval = CONFIG.get('forecastInterval'),
        intervalOpts,
        settings;

    intervalOpts = [1,2,3,4].map(i=>{
      return <option key={`interval-opt-${i*forecastInterval}`} value={i*forecastInterval}>{i*forecastInterval}</option>
    });

    settings = rampConfigs.map(conf=>{
      return <div id="alert-settings" key={`ramp-${conf.id}`}>
        <form>
          <label>
            <span>Alert Level</span>
            <select id={`ramp-${conf.id}-level`} className="alert-severity" name="select" value={conf.level} onChange={(e)=>this.handleChange(e)}>
              <option value=""></option>
              <option value="1">Low</option>
              <option value="2">Moderate</option>
              <option value="3">Critical</option>
            </select>
          </label><br/>
          <label>
            <span>Change in forecast power by</span>
            <input id={`ramp-${conf.id}-powerChange`} type="text" name="power" value={conf.powerChange} onChange={(e)=>this.handleChange(e)}/>
            <span>MW</span>
          </label>
          <label>
            <span>over</span>
            <select id={`ramp-${conf.id}-timeSpan`} name="time" value={conf.timeSpan} onChange={(e)=>this.handleChange(e)}>
              <option value=""></option>
              {intervalOpts}
            </select>
            <span>minutes</span>
          </label><br/>
          <label>
            <span>Alert Color</span>
            <select id={`ramp-${conf.id}-color`} className="alert-color" name="select" value={conf.color} onChange={(e)=>this.handleChange(e)}>
              <option value=""></option>
              <option value="yellow">Yellow</option>
              <option value="orange">Orange</option>
              <option value="red">Red</option>
            </select>
          </label>
        </form>
      </div>
    });

    return settings;
  }

  getForecastTimeSettings() {
    let availableHorizons = this.state.forecastHorizonOptions,
        horizon = this.state.forecastHorizon,
        options;

      options = availableHorizons.map(h=>{
        return <option key={`horizon-opt-${h}`} value={h}>{h}</option>
      });

      return <div id="forecast-time-settings">
        <h3>Forecast Time Horizon</h3>
        <div className="settings-description">Set the desired number of days to forecast ahead.</div>
        <select id="horizon-0-time" className="1-30" value={horizon} onChange={(e)=>this.handleChange(e)}>
          {options}
        </select>
        <span> Days </span>
      </div>
  }

  render() {
    const alertSettings = this.getAlertSettings()
    const forecastTimeSettings = this.getForecastTimeSettings()

    const aggregationGroups =
      <div id="aggreagation-group-settings">
        <h3>Aggregation Groups</h3>
        <div className="settings-description">Create groups of wind farms for the aggregated forecast. Once created, these groups can be selected in the top navigation bar.</div>
        <form>
          <label>
            <span>Group Name</span>
            <input type="text" name="group-name"/>
          </label><br/>
          <label>
            <span>Wind Farms</span>
            <select className="select-windfarms" name="select">
              <option value="select">Select Wind Farms</option>
            </select>
          </label>
        </form>
      </div>

    return (
      <div className="settings-container">
      <section>
      <h3>Ramp Alerts</h3>
        {alertSettings}
      </section>
      <section>
        {forecastTimeSettings}
      </section>
      <section>
        {aggregationGroups}
      </section>
      </div>
  )}
}

export default connect(mapStateToProps, mapDispatchToProps)(AppSettings);
