import React from 'react';
import './NavBar.scss';
import { mapStateToProps, mapDispatchToProps} from './selectors';
import { connect } from 'react-redux';

export const NavBar = ({activePane, onClick, appTitle, buttons, onSelectAggregation}) => {

  const modelOptions = [
    { value: 'one', label: 'Forecast One'},
    { value: 'local', label: 'Local Forecast'}
  ];

  const modelOptionElements = modelOptions.map((option) =>
    <option key={option.value} value={option.value}>{option.label}</option>
  );

  const aggregatedOptions = [
    { value: 'visibleFarms', label: 'Currently Visible Wind Farms'},
    { value: 'polygonFarms', label: 'Selected Wind Farms with Polygon Selection Tool'},
    { value: 'groupedFarms', label: 'Grouped Wind Farms'}
  ];

  const aggregatedOptionElements = aggregatedOptions.map((option) =>
    <option key={option.value} value={option.value}>{option.label}</option>
  );

  const groupedFarmsOptions = [
    { value: 'one', label: 'Group 1'},
    { value: 'two', label: 'Group 2'},
  ];

  const groupedFarmsOptionsElements = groupedFarmsOptions.map((option) =>
    <option key={option.value} value={option.value}>{option.label}</option>
  );

  const buttonElements = buttons.map((btn) =>
    <li key={btn.id}><a href="#" key={btn.id} id={btn.id} onClick={e => {e.preventDefault(); onClick(btn.id);}}><i className={"fa " + btn.class + " fa-2x"} aria-hidden="true"></i><p>{btn.name}</p></a></li>
  );

  const handleChangeEvent = () => {
    let e = document.getElementById("aggregatedSource");
    let source = e.options[e.selectedIndex]
    onSelectAggregation(source);
    if (source.value !== 'groupedFarms') {
      $('.groupedFarmsDropdown').addClass('hidden')
    }
    if (source.value === 'groupedFarms') {
      $('.groupedFarmsDropdown').removeClass('hidden')
    }
  }

  return (
     <nav id="app-navbar" className="navbar navbar-inverse">
      <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#wv-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">{appTitle}</a>
          </div>
          <div className="collapse navbar-collapse" id="#wv-navbar-collapse-1">
              <ul className="nav navbar-nav">
                {buttonElements}
                <li key="forecastModel">
                  <p className="selectbox">Active Forecast Model</p>
                  <select>
                    {modelOptionElements}
                  </select>
                </li>
                <li key="aggregatedForecastModel">
                  <p className="selectbox">Aggregated Forecast Model</p>
                  <select id="aggregatedSource" onChange={handleChangeEvent}>
                    {aggregatedOptionElements}
                  </select>
                </li>
                <li key="groupedFarmsSelect" className="groupedFarmsDropdown hidden">
                  <p className="selectbox">Grouped Farms</p>
                  <select id="groupedFarmsSelect" onChange={handleChangeEvent}>
                    {groupedFarmsOptionsElements}
                  </select>
                </li>
              </ul>
          </div>
      </div>
    </nav>
  )
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
