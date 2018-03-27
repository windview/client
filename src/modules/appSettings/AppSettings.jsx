import React from 'react';
import { connect } from 'react-redux';
import CONFIG from '../../data/config';
import Forecast from '../../data/forecast';
import WindFarm from '../../data/windFarm';
import './AppSettings.scss';
import {mapStateToProps, mapDispatchToProps} from './selectors';


class AppSettings extends React.Component {

  // Generates a total of 3 ramp configuration objects for use in the state
  // of this component for driving the UI. We have a pre-determined max of
  // 3 so we just create 3 blank backfilling properties from CONFIG where
  // present
  getRampStateFromConfig() {
    let preConfigured = CONFIG.get('rampThresholds'),
        empty = {
          level: '',
          powerChange: '',
          timeSpan: '',
          color: ''
        }
    return [0,1,2].map(id=>{
      if(preConfigured[id]) {
        return Object.assign({}, empty, preConfigured[id], {id: id});
      } else {
        return Object.assign({}, empty, {id: id})
      }
    });
  }

  // Validates that all fields are non-blank, converts strings to numbers as
  // needed, and sorts by level
  getRampConfigFromState() {
    let userConf = this.state.rampConfigs;
    return userConf.filter(c=>{
        return c.level !== '' && c.powerChange !== '' && c.timeSpan !== '' && c.color !== '';
      })
      .map(c=>{
        return {
          level: parseInt(c.level, 10),
          powerChange: parseFloat(c.powerChange, 10),
          timeSpan: parseFloat(c.timeSpan, 10),
          color: c.color
        }
      })
      .sort((a, b)=>{return (a.level-b.level);});
  }

  getStateFromConfig() {
    let rampConfigs = this.getRampStateFromConfig();
    this.setState({
      rampConfigs: rampConfigs,
      forecastHorizon: CONFIG.get('forecastHorizon'),
      // FIXME this should come from the forecast model details from the API
      forecastHorizonOptions: [1],
      aggregationGroups: CONFIG.get('groupedFarmOpts'),
      mapPowerDisplayRange: CONFIG.get('mapPowerDisplayRange')
    });
  }

  getConfigFromState() {
    CONFIG.set('rampThresholds', this.getRampConfigFromState());
    CONFIG.set('forecastHorizon', this.state.forecastHorizon);
    CONFIG.set('groupedFarmOpts', this.state.aggregationGroups);
    CONFIG.set('mapPowerDisplayRange', this.state.mapPowerDisplayRange);
  }

  componentWillMount() {
    // Initial loading of state from config at app startup
    this.getStateFromConfig();
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.props.activePane !== "settings" && nextProps.activePane === "settings") {
      // settings pane is being displayed, init stuff
      this.getStateFromConfig();
    } else if(this.props.activePane === "settings" && nextProps.activePane !== "settings") {
      // settings pane is being navigated away from... apply changes to config
      this.getConfigFromState();
      Forecast.resetAlerts();
      this.props.onAlertDisplay(WindFarm.getFarms().map(f=>f.id));
      this.props.onUpdateSettingsTS(new Date().getTime());
    }
  }

  handleRampChange(idx, property, val) {
    let rampConfigs = this.state.rampConfigs;
    rampConfigs[idx][property] = val;
    if(property === 'level') {
      if(val === '1') {
        rampConfigs[idx]['color'] = "yellow";
      } else if (val === '2') {
        rampConfigs[idx]['color'] = 'orange';
      } else if ( val === '3') {
        rampConfigs[idx]['color'] = 'red';
      } else {
        rampConfigs[idx]['color'] = '';
      }
    } else if(property === 'color') {
      if(val === 'yellow') {
        rampConfigs[idx]['level'] = '1';
      } else if(val === 'orange') {
        rampConfigs[idx]['level'] = '2';
      } else if(val === 'red') {
        rampConfigs[idx]['level']  = '3';
      } else {
        rampConfigs[idx]['level'] = '';
      }
    }
    this.setState({
      "rampConfigs": rampConfigs
    });
  }

  handleAggregationGroupChange(idx, property, val, options) {
    let aggConfigs = this.state.aggregationGroups,
        conf = aggConfigs.find(c=>c.id=idx);

    if(property === 'label') {
      if(val === '') {
        alert("Please give the group a name");
      }
      conf['label'] = val;
    } else if(property === 'delete') {
      aggConfigs = aggConfigs.filter(c=>c.id !== idx);
    } else if(property === 'add') {
      aggConfigs.unshift({
        id: `id+${Math.random().toString(36).substr(2,16)}`,
        label: "New Group",
        value: []
      });
    } else {
      let vals = []
      for(let i=0; i<options.length; i++) {
        if(options[i].selected) {
          vals.push(parseInt(options[i].value, 10));
        }
      }
      if(vals.length === 0) {
        alert("Please select at least one farm for this group");
      }
      conf.value = vals;
    }

    this.setState({
      "aggregationGroups": aggConfigs
    });
  }

  handleMapPowerDisplayChange(idx, property, val) {
    let minMax = this.state.mapPowerDisplayRange;
    val = parseInt(val, 10);

    if(isNaN(val)) {
      val = '';
    }

    minMax[idx] = val;
    this.setState({
      mapPowerDisplayRange: minMax
    });
  }

  handleChange(e) {
    let id = e.target.id,
        [category, idx, property] = id.split("-"),
        val = e.target.value;

    switch(category) {
      case 'ramp':
        this.handleRampChange(idx, property, val);
        break;
      case 'horizon':
        this.setState({
          forecastHorizon: val
        });
        break;
      case 'agggroup':
        this.handleAggregationGroupChange(idx, property, val, e.target.options);
        break;
      case 'mappow':
        this.handleMapPowerDisplayChange(idx, property, val);
        break;
      default:
        console.log(`${category} was changed but no settings handler exists`);
    }
  }

  getAlertSettings() {

    let rampConfigs = this.state.rampConfigs,
        forecastInterval = CONFIG.get('forecastInterval'),
        intervalOpts,
        settings;

    intervalOpts = [1,2,3,4].map(i=>{
      return <option key={`interval-opt-${i*forecastInterval}`} value={i*forecastInterval}>{i*forecastInterval}</option>
    });

    settings = rampConfigs.map(conf=>{
      return <div id="alert-settings" key={`ramp-${conf.id}`}>
        <form>
          <label>
            <span>Alert Level</span>
            <select id={`ramp-${conf.id}-level`} className="alert-severity" name="select" value={conf.level} onChange={(e)=>this.handleChange(e)}>
              <option value=""></option>
              <option value="1">Low</option>
              <option value="2">Moderate</option>
              <option value="3">Critical</option>
            </select>
          </label><br/>
          <label>
            <span>Change in forecast power by</span>
            <input id={`ramp-${conf.id}-powerChange`} type="text" name="power" value={conf.powerChange} onChange={(e)=>this.handleChange(e)}/>
            <span>MW</span>
          </label>
          <label>
            <span>over</span>
            <select id={`ramp-${conf.id}-timeSpan`} name="time" value={conf.timeSpan} onChange={(e)=>this.handleChange(e)}>
              <option value=""></option>
              {intervalOpts}
            </select>
            <span>minutes</span>
          </label><br/>
          <label>
            <span>Alert Color</span>
            <select
                id={`ramp-${conf.id}-color`}
                className="alert-color"
                name="select"
                value={conf.color}
                onChange={(e)=>this.handleChange(e)}>
              <option value=""></option>
              <option value="yellow">Yellow</option>
              <option value="orange">Orange</option>
              <option value="red">Red</option>
            </select>
          </label>
        </form>
      </div>
    });

    return settings;
  }

  getForecastTimeSettings() {
    let availableHorizons = this.state.forecastHorizonOptions,
        horizon = this.state.forecastHorizon,
        options;

      options = availableHorizons.map(h=>{
        return <option key={`horizon-opt-${h}`} value={h}>{h}</option>
      });

      return <div id="forecast-time-settings">
        <h3>Forecast Time Horizon</h3>
        <div className="settings-description">Set the desired number of days to forecast ahead.</div>
        <select id="horizon-0-time" className="1-30" value={horizon} onChange={(e)=>this.handleChange(e)}>
          {options}
        </select>
        <span> Days </span>
      </div>
  }

  getAggregationGroupSettings() {
    let groups = this.state.aggregationGroups,
        farms = WindFarm.getFarms(),
        groupSettings,
        settings;

    groupSettings = groups.map(conf=>{
      let farmOpts = farms.map(f=>{
        return <option key={`grp-agg-opt-${f.id}`} value={f.id}>{f.name}</option>
      })

      return <div id="aggregation-group-settings" key={`ramp-${conf.id}`}>
        <form>
          <label>
            <span>Group Name</span>
            <input type="text" id={`agggroup-${conf.id}-label`} name="group-name" value={conf.label} onChange={e=>this.handleChange(e)}/> <a href="#" id={`agggroup-${conf.id}-delete`} onClick={e=>this.handleChange(e)}><i id={`agggroup-${conf.id}-delete`} className="fa fa-trash-o fa-lg" aria-hidden="true"></i></a>
          </label><br/>
          <label>
            <span>Wind Farms</span>
            <select multiple id={`agggroup-${conf.id}-farms`} className="select-windfarms" name="select" value={conf.value} onChange={(e)=>this.handleChange(e)}>
              {farmOpts}
            </select>
          </label>
        </form>
      </div>
    })

    settings = <span>
      <h3>Aggregation Groups</h3>
      <div className="settings-description">
        Create groups of wind farms for the aggregated forecast. Once created, these groups can be selected in the top navigation bar.
        <p>
          <a href="#" id={`agggroup-new-add`} onClick={e=>this.handleChange(e)}>
            <i id={`agggroup-new-add`} className="fa fa-plus fa-lg" aria-hidden="true">Add New Group</i>
          </a>
        </p>
      </div>
      {groupSettings}
    </span>

    return settings;
  }

  getMapPowerDisplaySettings() {
    let minMax = this.state.mapPowerDisplayRange;

    return <span id="power-display-settings">
      <h3>Power Display Range</h3>
      <div className="settings-description">
        Set the minimum and maximum power used for styling how power is displayed on the map. If <code>(max-min)%3 = 0</code> the display bins will be whole numbers.
        <div className="power-display-inputs">
          <label>Minimum (MW)</label> <input type='text' id="mappow-min-change" value={minMax.min} onChange={e=>this.handleChange(e)} /><br/>
          <label>Maximum (MW)</label> <input type='text' id="mappow-max-change" value={minMax.max} onChange={e=>this.handleChange(e)} />
        </div>
      </div>
    </span>
  }

  render() {
    const alertSettings = this.getAlertSettings()
    const forecastTimeSettings = this.getForecastTimeSettings()
    const aggregationGroupSettings = this.getAggregationGroupSettings()
    const mapPowerSettings = this.getMapPowerDisplaySettings()

    return (
      <div className="settings-container">
      <section>
      <h3>Ramp Alerts</h3>
        {alertSettings}
      </section>
      <section>
        {mapPowerSettings}
      </section>
      <section>
        {forecastTimeSettings}
      </section>
      <section>
        {aggregationGroupSettings}
      </section>
      </div>
  )}
}

export default connect(mapStateToProps, mapDispatchToProps)(AppSettings);
