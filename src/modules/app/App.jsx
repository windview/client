import React from 'react';
import NavBar from '../navBar/index';
import Map from '../map/Map';
import ForecastChart from '../forecastChart/ForecastChart';
import AppSettings from '../appSettings/AppSettings';
import Help from '../help/Help';
import { mapStateToProps } from './selectors';
import { connect } from 'react-redux';
import { NAV_BAR_BUTTONS } from './constants';

export const App = ({ activePane }) => {

  // There are a few ways to perform conditional rendering. Read more at
  // https://facebook.github.io/react/docs/conditional-rendering.html
  let mainContent = null;
  switch(activePane){
    case 'map-view':
      mainContent = (
        <div className="row stretch-v">
          <section className="main-pane-left col-md-8 stretch-v">
            <Map />
          </section>
          <section className="sidebar col-md-4 stretch-v">
            <ForecastChart />
          </section>
        </div>
      ) 
      break;
    case 'settings':
      mainContent = (
        <div className="row stretch-v">
          <AppSettings />
        </div>
      )
      break; 
    case 'help': 
      mainContent = <div className="row stretch-v">
          <Help />
        </div>
      break;
    default:
      mainContent = <div>Something went wrong!</div>
  }

  return (
    <div id="app" className="stretch-v">
      <NavBar.component appTitle="Wind View" buttons={NAV_BAR_BUTTONS} />
      <div className="container-fluid main-content">
        {mainContent}
      </div>
    </div>
  );
}

export default connect( mapStateToProps, null)(App);
