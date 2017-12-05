import React from 'react';
import './AppSettings.scss';


export class AppSettings extends React.Component {

  handleChange() {
    //add code to remove selected option from other dropdowns
  }

  render() {
    const alertSettings =
    <div id="alert-settings">
      <h3>Alerts</h3>
      <form>
        <label>
          <span>Alert Level</span>
          <select className= "alert-severity" name="select" onChange={this.handleChange}>
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
            <input type="radio" id="select-color-red"
             name="red" value="red"/>
            <label htmlFor="select-color-red"><span className="select red"></span></label>
            <input type="radio" id="select-color-orange"
             name="orange" value="orange"/>
            <label htmlFor="select-color-orange"><span className="select orange"></span></label>
            <input type="radio" id="select-color-yellow"
             name="yellow" value="yellow"/>
            <label htmlFor="select-color-yellow"><span className="select yellow"></span></label>

          </div>
          <div>
            <button type="submit">Submit</button>
          </div>

        </label>
      </form>
    </div>

    return (
      <div className="settings-container">
      <div id="app-settings">
        Application Settings would be configurable here including things like
        <ul>
          <li>Default map area</li>
          <li>Ramp event thresholds</li>
          <li>Forecast preferences</li>
          <li>... and so on</li>
        </ul>

      </div>
      <div>
      {alertSettings}
      {alertSettings}
      {alertSettings}
      </div>
      </div>
  )}
}

export default AppSettings;
