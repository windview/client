import React from 'react';
import { connect } from 'react-redux';
import CONFIG from '../../data/config';
import './AppSettings.scss';
import {mapStateToProps, mapDispatchToProps} from './selectors';


class AppSettings extends React.Component {

  componentDidMount() {
    this.setTimeDropdown()
  }

  handleChange(e) {
    var type = `select.${e.target.className}`
    var typeOption = `select.${e.target.className} option`
    $(typeOption).attr('disabled', false);
    $(type).each(function() {
      var val = $(this).find('option:selected').val();
      if (!val) return;
      $(typeOption).filter(function() {
        return $(this).val() === val;
      }).attr('disabled', 'disabled');
    });
  }

  setTimeDropdown() {
    var $select = $(".1-30");
    for (var i=1;i<=30;i++){
        $select.append($('<option></option>').val(i).html(i))
      }
  }

  getAlertSettings() {
    let rampConfigs = CONFIG.get('rampThresholds'),
        conf,
        settings = [];

    // We hav a hard-coded ramp alert max of 3 thresholds
    for(var i=0; i<3; i++) {
      conf = rampConfigs[i];
      settings.push(<div id="alert-settings" key={`ramp${i}`}>
        <form>
          <label>
            <span>Alert Level</span>
            <select className="alert-severity" name="select" value={conf ? conf.level : ''} onChange={(e)=>this.handleChange(e)}>
              <option value=""></option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="critical">Critical</option>
            </select>
          </label><br/>
          <label>
            <span>Change in forecast power by</span>
            <input type="text" name="power" value={conf ? conf.powerChange : ''} onChange={(e)=>this.handleChange(e)}/>
            <span>MW</span>
          </label>
          <label>
            <span>over</span>
            <input type="text" name="time" value={conf ? conf.timeSpan : ''} onChange={(e)=>this.handleChange(e)}/>
            <span>minutes</span>
          </label><br/>
          <label>
            <span>Alert Color</span>
            <div>
              <select className="alert-color" name="select" value={conf ? conf.displayColor : ''} onChange={(e)=>this.handleChange(e)}>
                <option value=""></option>
                <option value="yellow">Yellow</option>
                <option value="orange">Orange</option>
                <option value="red">Red</option>
              </select>
            </div>
          </label>
        </form>
      </div>);
    }
    return settings;
  }

  render() {
    const alertSettings = this.getAlertSettings()

    const forecastTimeSettings =
      <div id="forecast-time-settings">
        <h3>Forecast Time Horizon</h3>
        <div className="settings-description">Set the desired number of days to forecast ahead.</div>
        <select className="1-30"></select>
        <span> Days </span>
      </div>

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
