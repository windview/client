import React from 'react';
import NavBar from '../navBar/NavBar';
import Map from '../map/Map';
import ForecastChart from '../forecastChart/ForecastChart';
import AggregatedForecastChart from '../aggregatedForecastChart/AggregatedForecastChart';
import AppSettings from '../appSettings/AppSettings';
import Help from '../help/Help';
import { mapStateToProps } from './selectors';
import { connect } from 'react-redux';
import { NAV_BAR_BUTTONS } from './constants';
import classNames from 'classnames';
import './App.scss';

export const App = ({ activePane }) => {
  return (
    <div id="app" className="stretch-v">
      <NavBar appTitle="Wind View" buttons={NAV_BAR_BUTTONS} />
      <div className='container-fluid main-content'>
        <div className={classNames('row', 'stretch-v', {'hidden': activePane!=='map-view'})}>
          <section id="map-section" className="col-md-8 stretch-v main-pane-left">
            <Map />
          </section>
          <section id="chart-section" className="sidebar col-md-4 stretch-v main-pane-right">
            <ForecastChart />
          </section>
          <section id="aggregated-chart-section" className="aggregated-chart-section">
            <AggregatedForecastChart />
          </section>
        </div>
        <div className={classNames('row', 'stretch-v', {'hidden': activePane!=='settings'})}>
          <AppSettings />
        </div>
        <div className={classNames('row', 'stretch-v', {'hidden': activePane!=='help'})}>
          <Help />
        </div>
      </div>
    </div>
  );
}

export default connect( mapStateToProps, null)(App);
