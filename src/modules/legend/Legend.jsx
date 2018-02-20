import React from 'react';
import './legend.scss';
import windFarmIcon from '../../images/windfarm.png';
import windFarmDisabledIcon from '../../images/windfarm-disabled.png';
import windFarmSelectedIcon from '../../images/windfarm-selected.png';

export class Legend extends React.Component {
  constructor(props) {
  super(props);
  this.state = {isToggleOn: true};

  this.handleClick = this.handleClick.bind(this);
}

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

render() {
  return (
    <div id="legend" className="legend-wrapper">
      <table className={this.state.isToggleOn ? "show-legend" : "hide-legend"}>
        <tbody>
          <tr><td className="legend-item"><img alt="wind farm" src={windFarmIcon} height="22" width="22"></img></td><td className="legend-label">Wind Farm Site</td></tr>
          <tr><td className="legend-item"><img alt="wind farm" src={windFarmSelectedIcon} height="22" width="22"></img></td><td className="legend-label">Selected Site</td></tr>
          <tr><td className="legend-item"><img alt="wind farm" src={windFarmDisabledIcon} height="22" width="22"></img></td><td className="legend-label">Site W/out data</td></tr>
          <tr><td className="legend-item"><div className="critical-alert"></div></td><td className="legend-label">Critical Ramp Alert</td></tr>
          <tr><td className="legend-item"><div className="moderate-alert"></div></td><td className="legend-label">Moderate Ramp Alert</td></tr>
          <tr><td className="legend-item"><div className="low-alert"></div></td><td className="legend-label">Low Ramp Alert</td></tr>
          <tr>
            <td className="legend-item">
              <svg width="40px" height="16px">
                <circle cx="20" cy="8" r="7" fill="rgba(0,0,0,0)" strokeWidth="2" stroke='hsla(240, 100%, 25%, 1)' />
              </svg>
            </td>
            <td className="legend-label">Forecast power 0-3 MW</td>
          </tr>
          <tr>
            <td className="legend-item">
              <svg width="40px" height="28px">
                <circle cx="20" cy="16" r="9" fill="rgba(0,0,0,0)" strokeWidth="4" stroke='hsla(240, 100%, 40%, .7)' />
              </svg>
            </td>
            <td className="legend-label">Forecast power 3-10 MW</td>
          </tr>
          <tr>
            <td className="legend-item">
              <svg width="40px" height="33px">
                <circle cx="20" cy="16" r="11" fill="rgba(0,0,0,0)" strokeWidth="6" stroke='hsla(240, 100%, 60%, .7)' />

              </svg>
            </td>
            <td className="legend-label">Forecast power 10-20 MW</td>
          </tr>
          <tr>
            <td className="legend-item">
              <svg width="40px" height="40px">
                <circle cx="20" cy="20" r="14" fill="rgba(0,0,0,0)" strokeWidth="9" stroke='hsla(240, 100%, 80%, .9)' />
              </svg>
            </td>
            <td className="legend-label">Forecast power > 20 MW</td>
          </tr>
          <tr>
            <td className="legend-item">
              <svg width="40px" height="30px">
                <line x1="5" y1="30" x2="17" y2="16" strokeWidth="2" stroke="hsla(26, 100%, 90%, 0.4)" />
                <line x1="17" y1="16" x2="23" y2="23" strokeWidth="3" stroke="hsla(15, 100%, 43%, .7)" />
                <line x1="23" y1="23" x2="35" y2="4" strokeWidth="4" stroke="hsla(15, 100%, 43%, 1)" />
              </svg>
            </td>
            <td className="legend-label">Transmission Line by kV</td>
          </tr>
        </tbody>
      </table>
      <div className="toggleLegend" onClick={this.handleClick}>
       {this.state.isToggleOn ? <p>Legend &#9660;</p> : <p>Legend &#9650;</p>}
      </div>
    </div>
  )}
}

export default Legend;
