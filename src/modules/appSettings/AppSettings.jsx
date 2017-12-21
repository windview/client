import React from 'react';
import './AppSettings.scss';


export class AppSettings extends React.Component {

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

  render() {
    const alertSettings =
      <div id="alert-settings">
        <form>
          <label>
            <span>Alert Level</span>
            <select className="alert-severity" name="select" onChange={(e)=>this.handleChange(e)}>
              <option value=""></option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="critical">Critical</option>
            </select>
          </label><br/>
          <label>
            <span>Change in forecast power by</span>
            <input type="text" name="power"/>
            <span>MW</span>
          </label>
          <label>
            <span>over</span>
            <input type="text" name="time"/>
            <span>minutes</span>
          </label><br/>
          <label>
            <span>Alert Color</span>
            <div>
              <select className="alert-color" name="select" onChange={(e)=>this.handleChange(e)}>
                <option value=""></option>
                <option value="yellow">Yellow</option>
                <option value="orange">Orange</option>
                <option value="red">Red</option>
              </select>
            </div>
          </label>
        </form>
      </div>

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
      <section id="app-settings">
        Application Settings would be configurable here including things like
        <ul>
          <li>Default map area</li>
          <li>Ramp event thresholds</li>
          <li>Forecast preferences</li>
          <li>... and so on</li>
        </ul>
      </section>
      <section>
      <h3>Alerts</h3>
        {alertSettings}
        {alertSettings}
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

export default AppSettings;
