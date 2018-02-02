import React from 'react';
import NavBar from '../navBar/NavBar';
import Map from '../map/Map';
import ForecastChart from '../forecastChart/ForecastChart';
import FarmDetail from '../farmDetail/FarmDetail';
import ForecastMeta from '../forecastMeta/ForecastMeta';
import BotChartSelector from '../botChartSelector/BotChartSelector';
import Slider from '../slider/Slider';
import AppSettings from '../appSettings/AppSettings';
import Help from '../help/Help';
import WindFarm from '../../data/windFarm';
import { mapStateToProps } from './selectors';
import { connect } from 'react-redux';
import { NAV_BAR_BUTTONS } from './constants';
import classNames from 'classnames';
import './App.scss';

export const App = ({ activePane, selectedFeature }) => {

  let farmName = selectedFeature ? WindFarm.getWindFarmById(selectedFeature).name : null;
  console.log("Selected Feature name:", farmName);

  return (
    <div id="app" className="">
      <NavBar appTitle="Wind View" buttons={NAV_BAR_BUTTONS} />
      <div className='main-content-container'>
        <div className={classNames({'hidden': activePane!=='map-view'})}>
          <section id="map" className="main-pane-left">
            <Map />
          </section>
          <section id="map-sidebar" className="main-pane-right">
            <div className='detail-title'>{farmName}</div>
            <ForecastChart />
            <FarmDetail />
            <ForecastMeta />
          </section>
          <section id="map-footer" className="main-pane-bottom">
            <Slider />
            <BotChartSelector />
          </section>
        </div>
        <div className={classNames({'hidden': activePane!=='settings'})}>
          <AppSettings />
        </div>
        <div className={classNames({'hidden': activePane!=='help'})}>
          <Help />
        </div>
      </div>
    </div>
  );
}

export default connect( mapStateToProps, null)(App);
