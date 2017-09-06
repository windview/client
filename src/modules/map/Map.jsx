import React from 'react';
import { connect } from 'react-redux';
import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
import Legend from '../legend/Legend';
import mapboxgl from '../../../node_modules/mapbox-gl/dist/mapbox-gl.js'
import windFarmIcon from '../../images/windfarm.png';
import windFarmDisabledIcon from '../../images/windfarm-disabled.png';
import windFarmSelectedIcon from '../../images/windfarm-selected.png';
import './Map.scss';
import mapboxStyle from '../../styles/dark-matter-style';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import WindFarm from '../../data/windFarm';
import Config from '../../data/config';
import Forecast from '../../data/forecast';
import * as tlinesStyle from './mapStyles/transmissionLines';
import * as wfActualStyle from './mapStyles/windFarmActual';
import * as wfForecastStyle from './mapStyles/windFarmForecast';
import * as wfRampStyle from './mapStyles/windFarmRamp';
import * as wfSizeStyle from './mapStyles/windFarmSize';
import * as openeiFarmStyle from './mapStyles/openeiFarms';

export class Map extends React.Component {

  afterMapRender() {
    this.onChangeVisibleExtent({type:'manual'});
    this.whenFeatureClicked(null, this.props.windFarms.features.find(f=>f.properties.fid === 'boulder_nrel_wind'));
  }

  applySelectedFeature(feature, forcePopup) {
    Forecast.setSelectedFeature(feature, this.props.windFarms.features);
    this.bumpMapFarms();
  }

  // Triggers the MapBox map to redraw the WindFarm features
  bumpMapFarms() {
    if(this.map && this.map.getSource('windfarms') && this.props.windFarms) {
      this.map.getSource('windfarms').setData(this.props.windFarms);
    }
  }

  closePopup() {
    if(this.layerPopup) {
      this.layerPopup.remove();
      this.layerPopup = null;
    }
  }

  componentDidMount() {
    Config.setGlobalFakeNow();
    // dispatch any actions configured in selectors
    this.props.onComponentDidMount();
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
      if(this.props.windFarms) {
        Forecast.setCurrentForecastByTimestamp(this.props.selectedTimestamp, this.props.windFarms.features);
        this.bumpMapFarms();
      }
    }
    if(prevProps.windFarms === null && this.props.windFarms !== null && !this.map) {
      if(this.props.windFarmsLoadingError) {
        alert("Wind farm data could not be loaded");
      }
      this.renderMap();
    }
    if(prevProps.timezoom !== this.props.timezoom) {
      let data =  this.props.windFarms,
          timezoom = this.props.timezoom;
      Forecast.getBatchForecast(data.features, timezoom, () => {
        this.bumpMapFarms();
        // this double tap triggers rerendering of slider component
        this.props.onBumpForecast(null);
        this.props.onBumpForecast(data);
        let feature = this.props.feature;
        if(feature) {
          this.props.onSelectFeature(null);
          this.applySelectedFeature(feature);
          this.props.onSelectFeature(feature);
        }
      }, this);
    }
  }

  constructor(props) {
    super(props);
    this.onChangeVisibleExtent = this.onChangeVisibleExtent.bind(this);
    this.whenFeatureClicked = this.whenFeatureClicked.bind(this);
    this.whenFeatureMouseOver = this.whenFeatureMouseOver.bind(this);
    this.whenFeatureMouseOut = this.whenFeatureMouseOut.bind(this);
    this.whenStyleChecked = this.whenStyleChecked.bind(this);
    this.whenTimezoomChanged = this.whenTimezoomChanged.bind(this);
  }

  getUniqueFeatures(array, comparatorProperty) {
    var existingFeatureKeys = {};
    // Because features come from tiled vector data, feature geometries may be split
    // or duplicated across tile boundaries and, as a result, features may appear
    // multiple times in query results.
    var uniqueFeatures = array.filter(function(el) {
        if (existingFeatureKeys[el.properties[comparatorProperty]]) {
          return false;
        } else {
          existingFeatureKeys[el.properties[comparatorProperty]] = true;
          return true;
        }
    });

    return uniqueFeatures;
  }

  onChangeVisibleExtent(e) {
    let features = this.map.queryRenderedFeatures({layers:['windfarms-symbol', 'windfarms-selected-symbol', 'windfarms-disabled-symbol']});
    if (features) {
      let uniqueFeatures = this.getUniqueFeatures(features, "fid");
      this.props.onMapMove(uniqueFeatures)
    }
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
    els.push(<span id='timezoom' key='timezoom'><input type='range' min="8" max="24" step="8" value={this.props.timezoom} onChange={this.whenTimezoomChanged}></input><div>{this.props.timezoom} Hours Ahead</div></span>)

    return (
      <span>
        <div id="style-menu">
          {els}
        </div>
        <div id="wind-map"></div>
        <Legend />
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
      // Add OpenEI wind farm points
      map.addSource('openei-farms', {
        type: "vector",
        url: process.env.TILE_SERVER_URL + "/openei-farms/metadata.json"
      });


      // TODO move app alerting to own module
      if(!this.props.windFarms) {
        alert("Wind farm data could not be loaded.");
        return;
      }

      // Add windfarms
      map.addSource('windfarms', {
        type: "geojson",
        data: this.props.windFarms
      });

      // Initialize all of the layers
      tlinesStyle.initializeStyle(map, 'translines');
      wfSizeStyle.initializeStyle(map, 'windfarms');
      wfForecastStyle.initializeStyle(map, 'windfarms');
      wfRampStyle.initializeStyle(map, 'windfarms');
      openeiFarmStyle.initializeStyle(map, 'openei-farms');

      // Show these layers
      this.toggleStyle('tlines');
      this.toggleStyle(this.props.selectedStyle);
      this.toggleStyle('openei-farms');

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

      // This icon layer shows a different icon for the selected farm
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

      // This icon layer shows a different icon for the selected farm
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
        filter: ['==', 'disabled', true],
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

      // All the events that might change the visible extent are encapsulated in
      // the moveend event
      map.on('moveend', this.onChangeVisibleExtent)

      // now that layers are added, create and invoke a method for determining
      // when the map is loaded (all layers rendered) and then do post init
      // stuff
      const checkMap = (map)=>{
        if(!map.loaded()) {
          setTimeout(()=>{checkMap(map)}, 50)
        } else {
          this.afterMapRender();
        }
      }
      checkMap(map);

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
      case "openei-farms":
        openeiFarmStyle.toggleVisibility(this.map);
        break;
      default:
        break;
    }
  }

  whenFeatureClicked(e, feature) {
    // The click event has a feature wherein the properties have been turned into strings.
    // Need to supply the proper object form so we find it in our local copy of the data
    if(!feature) {
      feature = WindFarm.getWindFarmById(e.features[0].properties.fid, this.props.windFarms.features);
    }
    this.applySelectedFeature(feature, true);
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

  whenStyleChecked(e) {
    this.props.onSelectStyle(e.target.value);
  }

  whenTimezoomChanged(e) {
    this.props.onSelectTimezoom(e.target.value);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
