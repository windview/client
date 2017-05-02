import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { connect } from 'react-redux';
import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '../../../node_modules/mapbox-gl/dist/mapbox-gl.js'
import windFarmIcon from '../../images/windfarm.png';
import './Map.scss';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import Slider from './slider/Slider';
import Store from '../../data/store';
import moment from 'moment';
import * as tlinesStyle from './mapStyles/transmissionLines';
import * as wfActualStyle from './mapStyles/windFarmActual';
import * as wfForecastStyle from './mapStyles/windFarmForecast';
import * as wfRampStyle from './mapStyles/windFarmRamp';
import * as wfSizeStyle from './mapStyles/windFarmSize';


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

  if(feature.properties.currentForecastVal) {
    const displayTime = moment.utc(feature.properties.currentForecastVal.timestamp).format('HH:mm M/D'),
          windSpeed = feature.properties.currentForecastVal.windSpeed + " m/s",
          power = feature.properties.currentForecastVal.power + " MW";
    appendRows.push(<tr><td>Forecast Time</td><td className="right">{displayTime}</td></tr>)
    appendRows.push(<tr><td>Forecast Windspeed (100m)</td><td className="right">{windSpeed}</td></tr>);
    appendRows.push(<tr><td>Forecast Wind Power</td><td className="right">{power}</td></tr>);    
  }
  const html = renderToStaticMarkup(
    <div>
      <strong>{feature.properties.label}</strong><br />
      <table className="map-popup">
        <tbody>
        {prependRows}
        <tr>
          <td>Total Capacity</td><td className="right">{feature.properties.total_capacity}</td>
        </tr><tr>
          <td>Manufacturer(s)</td><td className="right">{feature.properties.manufacturers.join(', ')}</td>
        </tr><tr>
          <td>Models</td><td className="right">{feature.properties.models.join(', ')}</td>
        </tr>
        {appendRows}
        </tbody>
      </table>
    </div>
  );
  return html;
}

export class Map extends React.Component {

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
  componentWillReceiveProps(nextProps) {
    if(this.props.selectedStyle !== nextProps.selectedStyle) {
      // Turn one off and the other on
      this.toggleStyle(this.props.selectedStyle);
      this.toggleStyle(nextProps.selectedStyle);
    } 
    if(this.props.selectedTimestamp !== nextProps.selectedTimestamp) {
      console.log("TODO implement map styles on timestamp change", nextProps.selectedTimestamp);        
    } 
    if(this.props.windFarmData === null && nextProps.windFarmData !== null) {
      this.renderMap(nextProps.windFarmData);
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

  /*  <input id='actual' type='radio' name='rtoggle' value='actual' checked={this.props.selectedStyle === 'actual'} onChange={this.whenStyleChecked}></input>
      <label>Actual at Selected Time</label><br/>
  */

  render() {
    return (
      <span>
        <div id="style-menu">
          <input id='ramp' type='radio' name='rtoggle' value='ramp' checked={this.props.selectedStyle === 'ramp'} onChange={this.whenStyleChecked}></input>
          <label>Alerts</label><br/>
          <input id='forecast' type='radio' name='rtoggle' value='forecast' checked={this.props.selectedStyle === 'forecast'} onChange={this.whenStyleChecked}></input>
          <label>Forecast at Selected Time</label><br/>
          <input id='size' type='radio' name='rtoggle' value='size' checked={this.props.selectedStyle === 'size'} onChange={this.whenStyleChecked}></input>
          <label>Wind Farm Capacity (MW)</label><br/>
        </div>
        <div id="wind-map" className="stretch-v"></div>
        <Slider onChange={this.whenSliderMoved}/>
      </span>
    );
  }

  renderMap(windFarmData) {
    
    //Create map
    let map = new mapboxgl.Map({
      container: 'wind-map', // container id
      style: 'mapstyles/dark-matter-style.json',
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
      
      // Add translines 
      map.addSource('translines', {
          type: "vector",
          url: "http://maps-dev-db.nrel.gov:8084/osm-translines/metadata.json"
      });
      
      // Add windfarms 
      map.addSource('windfarms', {
        type: "geojson",
        data: windFarmData
      });

      // Initialize all of the layers
      tlinesStyle.initializeStyle(map, 'translines');
      wfSizeStyle.initializeStyle(map, 'windfarms');
      wfActualStyle.initializeStyle(map, 'windfarms');
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
        paint: {
          'icon-opacity': 1
        }
      });

      // Handle the relevant events on the windfarms layer
      map.on('click', 'windfarms-symbol', this.whenFeatureClicked);

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on('mouseenter', 'windfarms-symbol', this.whenFeatureMouseOver);

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'windfarms-symbol', this.whenFeatureMouseOut);

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
