import React from 'react';
import NavBar from '../navBar/index';
import MapGl from '../mapGl/Map';
import ForecastChart from '../forecastChart/ForecastChart';
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
      <NavBar.component appTitle="Wind View" buttons={NAV_BAR_BUTTONS} />
      <div className='container-fluid main-content'>
        <div className={classNames('row', 'stretch-v', {'hidden': activePane!=='map-view'})}>
          <section id="map-section" className="col-md-8 stretch-v main-pane-left">
            <MapGl />
          </section>
          <section id="chart-section" className="sidebar col-md-4 stretch-v main-pane-right">
            <ForecastChart />
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
