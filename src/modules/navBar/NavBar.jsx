import React from 'react';
import './NavBar.scss';
import { mapStateToProps, mapDispatchToProps} from './selectors';
import { connect } from 'react-redux';
import { NAV_BAR_BUTTONS } from './constants';
import { APP_TITLE } from './constants';
import CONFIG from '../../data/config';


export class NavBar extends React.Component {

  componentDidUpdate(prevProps) {
    if(prevProps.settingsTimestamp !== this.props.settingsTimestamp) {
      this.render();
    }
  }

  modelOptionElements() {
    const modelOptions = [
      { value: 'best', label: 'M3 Demo'}
    ];

    return modelOptions.map((option) => {
      return <option key={option.value} value={option.value}>{option.label}</option>
    });

  }

  aggregatedOptionElements() {
    const aggregatedOptions = [
      { value: 'visibleFarms', label: 'Currently Visible'},
      { value: 'polygonFarms', label: 'Manual Selection'},
      { value: 'groupedFarms', label: 'Group Presets'}
    ];

    return aggregatedOptions.map((option) => {
      return <option key={option.value} value={option.value}>{option.label}</option>
    });
  }

  groupedFarmsOptionsElements() {
    const groupedFarmsOptions = CONFIG.get('groupedFarmOpts')
    return groupedFarmsOptions.map((option) => {
      return <option key={option.id} value={option.id}>{option.label}</option>
    });
  }

  buttonElements() {
    const buttons = Object.values({ NAV_BAR_BUTTONS })[0],
          activePane = this.props.activePane;

    return buttons.map((btn) => {
      let className = btn.id === activePane ? "yababy" : "";
      return <li key={btn.id}><a href="#" key={btn.id} id={btn.id} className={className} onClick={e => {e.preventDefault(); this.props.onClick(btn.id);}}><i className={"fa " + btn.class + " fa-2x"} aria-hidden="true"></i><p>{btn.name}</p></a></li>
    });
  }

  analysisElements() {
    let elements = [],
        activePane = this.props.activePane;

    if(activePane === 'map-view') {
      elements = [
        (<li key="forecastModel">
          <p className="selectbox">Forecast Model</p>
          <select>
            {this.modelOptionElements()}
          </select>
        </li>),
        (<li key="aggregatedForecastModel">
          <p className="selectbox">Aggregation Set</p>
          <select id="aggregatedSource" onChange={()=>this.handleChangeEvent()}>
            {this.aggregatedOptionElements()}
          </select>
        </li>),
        (<li key="groupedFarmsSelect" className="groupedFarmsDropdown hidden">
          <p className="selectbox">Presets</p>
          <select id="groupedFarmsSelect" onChange={()=>this.setGroupedFarms()}>
            {this.groupedFarmsOptionsElements()}
          </select>
        </li>)
      ];
    }

    return elements;
  }


  handleChangeEvent() {
    let e = document.getElementById("aggregatedSource");
    let source = e.options[e.selectedIndex]
    this.props.onSelectAggregation(source);
    if (source.value !== 'groupedFarms') {
      $('.groupedFarmsDropdown').addClass('hidden')
    }
    if (source.value === 'groupedFarms') {
      this.setGroupedFarms()
      $('.groupedFarmsDropdown').removeClass('hidden')
    }
  }

  setGroupedFarms() {
    const groupedFarmOptions = CONFIG.get('groupedFarmOpts');
    let e = document.getElementById("groupedFarmsSelect"),
        source = e.options[e.selectedIndex],
        selectedGroupId = source.value,
        selectedGroup;

    selectedGroup =  groupedFarmOptions.find(g=>g.id === selectedGroupId);
    this.props.onSelectFeaturesByGroup(selectedGroup);
  }

  render() {
    const appTitle = Object.values({ APP_TITLE })[0]
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
            <a className="navbar-brand" href="https://github.com/windview/client/blob/master/README.md">{appTitle}</a>
            </div>
            <div className="collapse navbar-collapse" id="#wv-navbar-collapse-1">
                <ul className="nav navbar-nav">
                  {this.buttonElements()}
                  {this.analysisElements()}
                </ul>
            </div>
        </div>
        </nav>
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
