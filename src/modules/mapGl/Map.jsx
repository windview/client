import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { connect } from 'react-redux';
import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '../../../node_modules/mapbox-gl/dist/mapbox-gl.js'
import windFarmIcon from '../../images/windfarm.png';
import windFarmDisabledIcon from '../../images/windfarm-disabled.png';
import windFarmSelectedIcon from '../../images/windfarm-selected.png';
import './Map.scss';
import mapboxStyle from '../../styles/dark-matter-style';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import Slider from './slider/Slider';
import Store from '../../data/store';
import WindFarm from '../../data/wind-farm';
import moment from 'moment';
import * as tlinesStyle from './mapStyles/transmissionLines';
import * as wfActualStyle from './mapStyles/windFarmActual';
import * as wfForecastStyle from './mapStyles/windFarmForecast';
import * as wfRampStyle from './mapStyles/windFarmRamp';
import * as wfSizeStyle from './mapStyles/windFarmSize';
import commafy from 'commafy';


const getFeaturePopupMarkup = (feature) => {
  let prependRows = [],
      appendRows = [];
  
  if(feature.properties.hasRamp) {
    prependRows = feature.properties.rampBins.map((rampBin) => {
      const startTime = moment.utc(rampBin.startTime).format('HH:mm UTC'),
            endTime = moment.utc(rampBin.endTime).format('HH:mm UTC'),
            severity = rampBin.severity > 1 ? "severe ramp" : "moderate ramp",
            className = rampBin.severity > 1 ? "severe" : "moderate";
      return <tr key={rampBin.startTime.getTime()} className={className}><td>RAMP ALERT</td><td className="right">A {severity} event is forecast starting at {startTime} and ending at {endTime}</td></tr>;
    });
  } 

  if(feature.properties.timestamp) {
    const displayTime = moment.utc(feature.properties.timestamp).format('HH:mm M/D UTC'),
          forecastMW = commafy(feature.properties.forecastMW) + " MW",
          forecast25MW = commafy(feature.properties.forecast25MW) + " MW",
          forecast75MW = commafy(feature.properties.forecast75MW) + " MW",
          actual = feature.properties.actual + " MW";
    appendRows.push(<tr key={feature.properties.fid + "-ts"}><td>Forecast Time</td><td className="right">{displayTime}</td></tr>)
    appendRows.push(<tr key={feature.properties.fid + "-fcst"}><td>Forecast Power</td><td className="right">{forecastMW}</td></tr>);
    appendRows.push(<tr key={feature.properties.fid + "-25"}><td>Forecast Power 25th Percentile</td><td className="right">{forecast25MW}</td></tr>);    
    appendRows.push(<tr key={feature.properties.fid + "-75"}><td>Forecast Power 75th Percentile</td><td className="right">{forecast75MW}</td></tr>); 
    if(actual) {
      appendRows.push(<tr key={feature.properties.fid + "-actl"}><td>Actual Power</td><td className="right">{actual}</td></tr>); 
    }
  }
  const html = renderToStaticMarkup(
    <div>
      <strong>{feature.properties.label}</strong><br />
      <table className="map-popup">
        <tbody>
        {prependRows}
        <tr>
          <td>Total Farm Capacity</td><td className="right">{commafy(feature.properties.total_capacity)} MW</td>
        </tr><tr>
          <td>Turbine Manufacturer(s)</td><td className="right">{feature.properties.manufacturers.join(', ')}</td>
        </tr><tr>
          <td>Turbine Models</td><td className="right">{feature.properties.models.join(', ')}</td>
        </tr>
        {appendRows}
        </tbody>
      </table>
    </div>
  );
  return html;
}

export class Map extends React.Component {

  bumpMapFarms() {
    if(this.map && this.props.windFarmData) {
      this.map.getSource('windfarms').setData(this.props.windFarmData);
    }
  }

  componentDidMount() {
    let self = this;
    // initialize windfarm data
    Store.getWindFarms()
      .done((data) => {
        Store.getBatchForecast(data.features, () => {
          self.props.onLoadWindFarmData(data);
        }, self);
      })
      .fail((xhr, status, error) => {
        self.renderMap();
      });
  }

  // This is a way of observing state changes that is useful
  // for integrating with 3rd party libraries. Since data binding
  // between React and say Leaflet isn't possible, the approach is
  // to intercept React component lifecycle events and manually
  // attach any 3rd party lib binding therein. React libraries
  // that wrap integration do this under the covers. e.g.
  //https://github.com/PaulLeCam/react-leaflet
  componentDidUpdate(prevProps) {
    if(prevProps.selectedStyle !== this.props.selectedStyle) {
      // Turn one off and the other on
      this.toggleStyle(prevProps.selectedStyle);
      this.toggleStyle(this.props.selectedStyle);
    } 
    if(prevProps.selectedTimestamp !== this.props.selectedTimestamp) {
      if(this.props.windFarmData) {
        WindFarm.setCurrentForecastByTimestamp(this.props.selectedTimestamp, this.props.windFarmData.features);
        this.bumpMapFarms();
      }
    } 
    if(prevProps.windFarmData === null && this.props.windFarmData !== null) {
      this.renderMap();
    }
  }

  constructor(props) {
    super(props);
    this.whenFeatureClicked = this.whenFeatureClicked.bind(this);
    this.whenFeatureMouseOver = this.whenFeatureMouseOver.bind(this);
    this.whenFeatureMouseOut = this.whenFeatureMouseOut.bind(this);
    this.whenSliderMoved = this.whenSliderMoved.bind(this);
    this.whenStyleChecked = this.whenStyleChecked.bind(this);
  }

  render() {

    const styleSelectors = [{
      id: 'ramp',
      label: "All Forthcoming Alerts"
    }, {
      id: 'forecast',
      label: 'Forecast at Selected Time'
    }, {
      id: 'size',
      label: 'Wind Farm Capacity (MW)'
    }];
    const els = styleSelectors.map(s=>{
      return (<span key={s.id}><input id={s.id} type='radio' name='rtoggle' value={s.id} checked={this.props.selectedStyle === s.id} onChange={this.whenStyleChecked}></input>
              <label>{s.label}</label><br/></span>)
    });

    return (
      <span>
        <div id="style-menu">
          {els}
        </div>
        <div id="wind-map" className="stretch-v"></div>
        <Slider onChange={this.whenSliderMoved}/>
      </span>
    );
  }

  renderMap() {
    //Create map
    let map = new mapboxgl.Map({
      container: 'wind-map', // container id
      style: mapboxStyle,
      center: [-104.247, 39.344], // starting position
      zoom: 6.5, // starting zoom
      hash: false
    });
    this.map = map;

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // after map initializes itself, go to work adding all the things
    map.on('load', function(){

      // Add the custom image icon for wind farms to use later
      map.loadImage(windFarmIcon, (err, image) => {
        if(err) return;
        map.addImage('windfarm', image);
      });
      // Add the custom image icon for wind farms to use later
      map.loadImage(windFarmSelectedIcon, (err, image) => {
        if(err) return;
        map.addImage('windfarm-selected', image);
      });
      // Add the custom image icon for wind farms to use later
      map.loadImage(windFarmDisabledIcon, (err, image) => {
        if(err) return;
        map.addImage('windfarm-disabled', image);
      });
      
      // Add translines 
      map.addSource('translines', {
          type: "vector",
          url: process.env.TILE_SERVER_URL + "/osm-translines/metadata.json"
      });
      
      // TODO move app alerting to own module 
      if(!this.props.windFarmData) {
        alert("Wind farm data could not be loaded.");
        return;
      }

      // Add windfarms 
      map.addSource('windfarms', {
        type: "geojson",
        data: this.props.windFarmData
      });
        
      // Initialize all of the layers
      tlinesStyle.initializeStyle(map, 'translines');
      wfSizeStyle.initializeStyle(map, 'windfarms');
      wfForecastStyle.initializeStyle(map, 'windfarms');
      wfRampStyle.initializeStyle(map, 'windfarms');

      // Show these layers
      this.toggleStyle('tlines');
      this.toggleStyle(this.props.selectedStyle);

      // The icon layer is always present, and needs to be for all the
      // event handlers so add it outside of the specific styles above
      map.addLayer({
        id: 'windfarms-symbol',
        type: 'symbol',
        source: 'windfarms',
        layout: {
          'icon-image': 'windfarm',
          'icon-size': .18,
          'icon-allow-overlap': true,
          'icon-keep-upright': true
        },
        filter: [
          'all',
          ['!=', 'selected', true],
          ['!=', 'disabled', true],
        ],
        paint: {
          'icon-opacity': 1
        }
      });

      // Thisicon layer shows a different icon for the selected farm
      map.addLayer({
        id: 'windfarms-selected-symbol',
        type: 'symbol',
        source: 'windfarms',
        layout: {
          'icon-image': 'windfarm-selected',
          'icon-size': .24,
          'icon-allow-overlap': true,
          'icon-keep-upright': true
        },
        filter: [
          'all',
          ['==', 'selected', true],
          ['!=', 'disabled', true],
        ],
        paint: {
          'icon-opacity': 1
        }
      });

      // Thisicon layer shows a different icon for the selected farm
      map.addLayer({
        id: 'windfarms-disabled-symbol',
        type: 'symbol',
        source: 'windfarms',
        layout: {
          'icon-image': 'windfarm-disabled',
          'icon-size': .18,
          'icon-allow-overlap': true,
          'icon-keep-upright': true
        },
        filter: [
          'all',
          ['!=', 'selected', true],
          ['==', 'disabled', true],
        ],
        paint: {
          'icon-opacity': 1
        }
      });

      // Handle the relevant events on the windfarms layer
      map.on('click', 'windfarms-symbol', this.whenFeatureClicked);
      map.on('click', 'windfarms-selected-symbol', this.whenFeatureClicked);

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on('mouseenter', 'windfarms-symbol', this.whenFeatureMouseOver);
      map.on('mouseenter', 'windfarms-selected-symbol', this.whenFeatureMouseOver);

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'windfarms-symbol', this.whenFeatureMouseOut);
      map.on('mouseleave', 'windfarms-selected-symbol', this.whenFeatureMouseOut);

    }.bind(this));  
  }

  toggleStyle(styleName) {
    switch(styleName) {
      case "size":
        wfSizeStyle.toggleVisibility(this.map);
        break;
      case "ramp":
        wfRampStyle.toggleVisibility(this.map);
        break;
      case "forecast":
        wfForecastStyle.toggleVisibility(this.map);
        break;
      case "actual":
        wfActualStyle.toggleVisibility(this.map);
        break;
      case "tlines":
        tlinesStyle.toggleVisibility(this.map);
        break;
      default:
        break;
    }
  }

  whenFeatureClicked(e) {
    // The click event has a feature wherein the properties have been turned into strings.
    // Need to supply the proper object form so we find it in our local copy of the data
    const feature = Store.getWindFarmById(e.features[0].properties.fid, this.props.windFarmData.features);
    WindFarm.setSelectedFeature(feature, this.props.windFarmData.features);
    this.bumpMapFarms();
    this.layerPopup = new mapboxgl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setHTML(getFeaturePopupMarkup(feature))
            .addTo(this.map);
    this.props.onSelectFeature(feature);
  }

  whenFeatureMouseOut(e) {
    if(this.map) {
      this.map.getCanvas().style.cursor = '';
      /*if(this.layerPopup) {
        this.layerPopup.remove();
        this.layerPopup = null;
      }*/
    }
  }

  whenFeatureMouseOver(e) { 
    if(this.map) {
      this.map.getCanvas().style.cursor = 'pointer';
    }
  }

  whenSliderMoved(newTimestamp) {
    this.props.onSelectTimestamp(newTimestamp);
  }

  whenStyleChecked(e) {
    this.props.onSelectStyle(e.target.value);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
