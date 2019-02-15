import React from 'react';
import './Help.scss';

const aboutStyle = {
  width: '800px'
}

const Help = () => (
  <div className="help">
    <section className="mapview-help">
      <h3>About</h3>
      <section style={aboutStyle}>
      <strong>WindView</strong> is a collaborative effort between the National Renewable Energy Lab (<a href="https://www.nrel.gov/">NREL</a>) and Argonne National 
      Lab (<a href="https://www.anl.gov/">ANL</a>) with support from the U.S. Department of Energy (<a href="https://www.energy.gov/">DOE</a>). 
        <strong>WindViews</strong> is wind power visualization software which enables power system operators to better understand static and forecast information on their 
        power system, relating to wind.<br />
        <br />
        For more information, please visit <a href="https://github.com/windview/client/blob/master/README.md">https://github.com/windview/client/blob/master/README.md</a>
      </section>
      <h3>Map Views</h3>
      There are three different map views available:
      <ul>
        <li>All Forthcoming Alerts</li>
        <li>Forecast at Selected Time</li>
        <li>Wind Farm Capacity(MW)</li>
      </ul>
        You can select the desired view by clicking on the appropriate radio button.
      <h4>All Forthcoming Alerts</h4>
      This view shows an overview of all of the alerts by displaying the highest alert (if one exists) for each wind farm.
      <h4>Forecast at Selected Time</h4>
      This view displays the forecast for each wind farm based on the given time displayed on the time scale at the bottom of the map.
      <h4>Wind Farm Capacity(MW)</h4>
      This view provides an overview of the power capacity in MW for each wind farm.<br/>
    </section>
    <section className="aggregated-chart-help">
      <h3>Aggregated Chart</h3>
      <p>The chart below the map shows an aggreaged forecast.</p>
      <ul>
        <li>Yellow boxes with upward pointing arrows indicate an increase in wind power is forecasted.</li>
        <li>Blue boxes with downward pointing arrows indicate a decrease in wind power is forecasted.</li>
        <li>A red outline around the box indicates that there is a ramp alert.</li>
      </ul>
      <h4>Selecting Wind Farms for the Aggregated Chart</h4>
      <p>There is a dropdown menu in the top navigation bar for selecting the aggreaged forecast source.</p>
      <ul>
        <li>"Currently Visible Wind Farms" aggregates all of the wind farms visible on the current map view.</li>
        <li>"Selected Wind Farms with Polygon Selection Tool" aggregates all of the wind farms within the polygon selection tool. Use the selection tool found in the upper right hand of the map and click around the desired wind farms to create a selection polygon.</li>
        <li>"Grouped Wind Farms" aggregates all of the wind farms within the selected pre-defined group. Define these groups under 'Settings'. Once you select this option, a second dropdown menu will appear next to it with the groups you can choose from.</li>
      </ul>
    </section>
    <section className="forecast-chart-help">
      <h3>Forecast Chart</h3>
    </section>
    <section className="alerts-help">
      <h3>Alerts</h3>
    </section>
    <section className="farm-details-help">
      <h3>Farm Details</h3>
    </section>
  </div>
);

export default Help;
