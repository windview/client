import React from 'react';
import './legend.scss';
import windFarmIcon from '../../images/windfarm.png';
import windFarmDisabledIcon from '../../images/windfarm-disabled.png';
import windFarmSelectedIcon from '../../images/windfarm-selected.png';

export default (props) => {
  return (
    <div id="legend" className="legend-wrapper">
      <table>
        <tbody>
          <tr><td className="legend-item"><img alt="wind farm" src={windFarmIcon} height="22" width="22"></img></td><td className="legend-label">Wind Farm Site</td></tr>
          <tr><td className="legend-item"><img alt="wind farm" src={windFarmSelectedIcon} height="22" width="22"></img></td><td className="legend-label">Selected Site</td></tr>
          <tr><td className="legend-item"><img alt="wind farm" src={windFarmDisabledIcon} height="22" width="22"></img></td><td className="legend-label">Site W/out data</td></tr>
          <tr>
            <td className="legend-item">
              <svg width="40px" height="30px">
                <defs>
                  <radialGradient id="blipGradient">
                    <stop offset="0%" stopColor="hsla(0, 100%, 37%, 1)"/>
                    <stop offset="50%" stopColor="hsla(0, 100%, 37%, 1)"/>
                    <stop offset="100%" stopColor="hsla(0, 100%, 37%, 0.4)"/>
                  </radialGradient>
                </defs>
                <circle cx="20" cy="15" r="15" fill="url(#blipGradient)" />
              </svg>
            </td>
            <td className="legend-label">Critical Ramp Alert</td>
          </tr>
          <tr><td className="legend-item"><div className="moderate-alert"></div></td><td className="legend-label">Moderate Ramp Alert</td></tr>
          <tr>
            <td className="legend-item">
              <svg width="40px" height="16px">
                <circle cx="20" cy="8" r="7" fill="rgba(0,0,0,0)" strokeWidth="2" stroke='hsla(219, 100%, 70%, .9)' />
              </svg>
            </td>
            <td className="legend-label">Forecast power 0-3 MW</td>
          </tr>
          <tr>
            <td className="legend-item">
              <svg width="40px" height="24px">
                <circle cx="20" cy="12" r="7" fill="rgba(0,0,0,0)" strokeWidth="2" stroke='hsla(219, 100%, 70%, .9)' />
                <circle cx="20" cy="12" r="11" fill="rgba(0,0,0,0)" strokeWidth="2" stroke='hsla(219, 100%, 79%, .9)' />
              </svg>
            </td>
            <td className="legend-label">Forecast power 3-10 MW</td>
          </tr>
          <tr>
            <td className="legend-item">
              <svg width="40px" height="32px">
                <circle cx="20" cy="16" r="7" fill="rgba(0,0,0,0)" strokeWidth="2" stroke='hsla(219, 100%, 70%, .9)' />
                <circle cx="20" cy="16" r="11" fill="rgba(0,0,0,0)" strokeWidth="2" stroke='hsla(219, 100%, 79%, .9)' />
                <circle cx="20" cy="16" r="15" fill="rgba(0,0,0,0)" strokeWidth="2" stroke='hsla(219, 100%, 88%, .9)' />
              </svg>
            </td>
            <td className="legend-label">Forecast power 10-20 MW</td>
          </tr>
          <tr>
            <td className="legend-item">
              <svg width="40px" height="40px">
                <circle cx="20" cy="20" r="7" fill="rgba(0,0,0,0)" strokeWidth="2" stroke='hsla(219, 100%, 70%, .9)' />
                <circle cx="20" cy="20" r="11" fill="rgba(0,0,0,0)" strokeWidth="2" stroke='hsla(219, 100%, 79%, .9)' />
                <circle cx="20" cy="20" r="15" fill="rgba(0,0,0,0)" strokeWidth="2" stroke='hsla(219, 100%, 88%, .9)' />
                <circle cx="20" cy="20" r="19" fill="rgba(0,0,0,0)" strokeWidth="2" stroke='hsla(152, 64%, 99%, 0.9)' />
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
    </div>
  )
}
