import React from 'react';
import { connect } from 'react-redux';
import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
import Legend from '../legend/Legend';
import mapboxgl from '../../../node_modules/mapbox-gl/dist/mapbox-gl.js';
import MapboxDraw from '../../../node_modules/@mapbox/mapbox-gl-draw';
import windFarmIcon from '../../images/windfarm-sm.png';
import windFarmDisabledIcon from '../../images/windfarm-disabled-sm.png';
import windFarmSelectedIcon from '../../images/windfarm-selected-sm.png';
import windFarmSuspectDataIcon from '../../images/windfarm-suspect-data-sm.png';
import windFarmSelectedSuspsectDataIcon from '../../images/windfarm-selected-suspect-data-sm.png';
import './Map.scss';
import chevronDown from '../../images/chevrons-down.svg';
import chevronUp from '../../images/chevrons-up.svg';
//import mapboxStyle from '../../styles/dark-matter-style';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import WindFarm from '../../data/windFarm';
import Forecast from '../../data/forecast';
import * as tlinesStyle from './mapStyles/transmissionLines';
import * as openeiFarmStyle from './mapStyles/openeiFarms';
import * as noaaStationStyle from './mapStyles/noaaStations';
import * as wfActualStyle from './mapStyles/windFarmActual';
import * as wfForecastStyle from './mapStyles/windFarmForecast';
import * as wfRampStyle from './mapStyles/windFarmRamp';
import * as wfSizeStyle from './mapStyles/windFarmSize';
import * as wfHighlightStyle from './mapStyles/windFarmHighlight';


export class Map extends React.Component {

  afterMapRender() {
    this.onChangeVisibleExtent({type:'manual'});
    // select first farm
    this.whenFeatureClicked(null, WindFarm.getFarms()[0]);
  }

  applyHighlightToFeature(featureId) {
    WindFarm.setHighlightedFarm(featureId);
    this.bumpMapFarms();
    this.toggleStyle('wind-farm-highlights');
  }

  applySelectedFeature(feature, forcePopup) {
    WindFarm.setSelectedFarm(feature);
    this.bumpMapFarms();
  }

  // Triggers the MapBox map to redraw the WindFarm features
  bumpMapFarms() {
    if(this.map && this.map.getSource('windfarms') && this.props.windFarmsLoaded) {
      let features = WindFarm.getGeoJsonForFarms(this.props.selectedTimestamp, this.props.alertArray);
      this.map.getSource('windfarms').setData(features);
    }
  }

  closePopup() {
    if(this.layerPopup) {
      this.layerPopup.remove();
      this.layerPopup = null;
    }
  }

  componentDidMount() {
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
      if(this.props.windFarmsLoaded) {
        this.bumpMapFarms();
      }
    }
    if(prevProps.alertArray !== this.props.alertArray) {
      if(this.props.windFarmsLoaded) {
        this.bumpMapFarms();
      }
    }
    if(!prevProps.windFarmsLoaded && this.props.windFarmsLoaded && !this.map) {
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
    if((prevProps.settingsTimestamp !== this.props.settingsTimestamp)
        || (prevProps.forecastTimestamp !== this.props.forecastTimestamp)){
      wfSizeStyle.initializeStyle(this.map, 'windfarms');
      wfForecastStyle.initializeStyle(this.map, 'windfarms');
    }
    if((prevProps.highlightedFeatureId !== this.props.highlightedFeatureId) && this.map) {
      this.applyHighlightToFeature(this.props.highlightedFeatureId);
    }
  }

  constructor(props) {
    super(props);
    this.applySelectedFeature = this.applySelectedFeature.bind(this);
    this.applyHighlightToFeature = this.applyHighlightToFeature.bind(this);
    this.onChangeVisibleExtent = this.onChangeVisibleExtent.bind(this);
    this.whenFeatureClicked = this.whenFeatureClicked.bind(this);
    this.whenOEIFarmClicked = this.whenOEIFarmClicked.bind(this);
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

  onChangeAggregationDrawing(e) {
    let userPolygon = e.features[0],
        draw = this.draw,
        selectedFarmIds,
        previousFeatureIds = draw.getAll().features
          .filter(f=>f.id!==userPolygon.id)
          .map(f=>f.id);

    // Remove all other features, so that current one is the only one on map.
    draw.delete(previousFeatureIds);

    // Ascertain the ids for all farms within the drawing
    selectedFarmIds = WindFarm.getFarmsByPolygon(userPolygon).map(f=>f.id);

    // Send the action to notify state
    this.props.onSelectFeaturesByPolygon(selectedFarmIds);
  }

  onChangeVisibleExtent(e) {
    let searchableLayerIds = this.state.searchableLayerIds,
        features = this.map.queryRenderedFeatures({layers:searchableLayerIds});
    if (features) {
      let uniqueFeatures = this.getUniqueFeatures(features, "fid"),
          uniqFeatureIds = uniqueFeatures.map(f=>f.properties.fid);
      this.props.onMapMove(uniqFeatureIds);
    } else {
      //console.err("No features in visible extent");
    }
  }

  render() {

    const styleSelectors = [{
      id: 'ramp',
      label: "Most Severe Forthcoming Alert"
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

    //els.push(<span id='timezoom' key='timezoom'><input type='range' min="8" max="24" step="8" value={this.props.timezoom} onChange={this.whenTimezoomChanged}></input><div>{this.props.timezoom} Hours Ahead</div></span>)

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
      style: 'https://free.tilehosting.com/styles/darkmatter/style.json?key=o6iGgsKYC7Ry7Y0VhZwY', //mapboxStyle,
      center: [-104.902, 33.969], // starting position
      zoom: 4.5, // starting zoom
      hash: false
    });
    this.map = map;

    // Disable default box zooming.
    map.boxZoom.disable();

    // Add tool for drawing polygon on map
    let draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true
        }
    });
    map.addControl(draw);
    this.draw = draw;

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // after map initializes itself, go to work adding all the things
    map.on('load', function(){

      // Can't use SVG directly in MapboxGL, but can create an
      // img DOM element and use that
      let img = new Image(33,45);
      img.onload = ()=>map.addImage('chevronDown', img);
      img.src = chevronDown;

      let img2 = new Image(33,45);
      img2.onload = ()=>map.addImage('chevronUp', img2);
      img2.src = chevronUp;

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
      // Add the custom image icon for wind farms to use later
      map.loadImage(windFarmSuspectDataIcon, (err, image) => {
        if(err) return;
        map.addImage('windfarm-suspect-data', image);
      });
      // Add the custom image icon for wind farms to use later
      map.loadImage(windFarmSelectedSuspsectDataIcon, (err, image) => {
        if(err) return;
        map.addImage('windfarm-selected-suspect-data', image);
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
      // Add OpenEI wind farm points
      map.addSource('noaa-stations', {
        type: "vector",
        url: process.env.TILE_SERVER_URL + "/noaa-stations/metadata.json"
      });


      let farmData = WindFarm.getGeoJsonForFarms(this.props.selectedTimestamp, this.props.alertArray);
      // TODO move app alerting to own module
      if(farmData.features.length === 0) {
        alert("Wind farm data could not be loaded.");
        return;
      }

      // Add windfarms
      map.addSource('windfarms', {
        type: "geojson",
        data: farmData
      });

      // Initialize all of the layers
      tlinesStyle.initializeStyle(map, 'translines');
      openeiFarmStyle.initializeStyle(map, 'openei-farms');
      noaaStationStyle.initializeStyle(map, 'noaa-stations');
      wfSizeStyle.initializeStyle(map, 'windfarms');
      wfForecastStyle.initializeStyle(map, 'windfarms');
      wfRampStyle.initializeStyle(map, 'windfarms', this.props.forecast);
      wfHighlightStyle.initializeStyle(map, 'windfarms');

      let localLayerIds = ['windfarms-symbol', 'windfarms-selected-symbol', 'windfarms-disabled-symbol', 'windfarms-suspect-data-symbol', 'windfarms-selected-suspect-data-symbol', 'windfarms-down-arrow', 'windfarms-up-arrow'],
      searchableLayerIds = []
          .concat(localLayerIds)
          .concat(wfSizeStyle.getLayerIds())
          .concat(wfForecastStyle.getLayerIds())
          .concat(wfRampStyle.getLayerIds());
      this.setState({
        searchableLayerIds: searchableLayerIds
      });

      // Show these layers
      this.toggleStyle('tlines');
      //this.toggleStyle('openei-farms')
      //this.toggleStyle('noaa-stations')
      this.toggleStyle(this.props.selectedStyle);

      // The icon layer is always present, and needs to be for all the
      // event handlers so add it outside of the specific styles above

      map.addLayer({
        id: 'windfarms-symbol',
        type: 'symbol',
        source: 'windfarms',
        layout: {
          'icon-image': 'windfarm',
          'icon-size': 1,
          'icon-allow-overlap': true,
          'icon-keep-upright': true
        },
        filter: [
          'all',
          ['!=', 'selected', true],
          ['!=', 'disabled', true],
          ['!=', 'suspectData', true]
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
          'icon-size': 1,
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

      map.addLayer({
        id: 'windfarms-disabled-symbol',
        type: 'symbol',
        source: 'windfarms',
        layout: {
          'icon-image': 'windfarm-disabled',
          'icon-size': 1,
          'icon-allow-overlap': true,
          'icon-keep-upright': true
        },
        filter: ['==', 'disabled', true],
        paint: {
          'icon-opacity': 1
        }
      });

      map.addLayer({
        id: 'windfarms-suspect-data-symbol',
        type: 'symbol',
        source: 'windfarms',
        layout: {
          'icon-image': 'windfarm-suspect-data',
          'icon-size': 1,
          'icon-allow-overlap': true,
          'icon-keep-upright': true
        },
        filter: [
          'all',
          ['!=', 'selected', true],
          ['!=', 'disabled', true],
          ['==', 'suspectData', true]
        ],
        paint: {
          'icon-opacity': 1
        }
      });

      map.addLayer({
        id: 'windfarms-selected-suspect-data-symbol',
        type: 'symbol',
        source: 'windfarms',
        layout: {
          'icon-image': 'windfarm-selected-suspect-data',
          'icon-size': 1,
          'icon-allow-overlap': true,
          'icon-keep-upright': true
        },
        filter: [
          'all',
          ['==', 'selected', true],
          ['!=', 'disabled', true],
          ['==', 'suspectData', true]
        ],
        paint: {
          'icon-opacity': 1
        }
      });

      map.on('draw.create', this.onChangeAggregationDrawing.bind(this));
      map.on('draw.update', this.onChangeAggregationDrawing.bind(this));
      map.on('draw.delete', function(e) {
        this.props.onSelectFeaturesByPolygon([]);
      }.bind(this))


      // OpenEI Farm events for testing and debuggin
      map.on('click', 'openei-farms', this.whenOEIFarmClicked);
      map.on('click', 'noaa-stations', this.whenOEIFarmClicked);

      // Handle the relevant events on the windfarms layer
      map.on('click', 'windfarms-symbol', this.whenFeatureClicked);
      map.on('click', 'windfarms-selected-symbol', this.whenFeatureClicked);
      map.on('click', 'windfarms-suspect-data-symbol', this.whenFeatureClicked);

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on('mouseenter', 'windfarms-symbol', this.whenFeatureMouseOver);
      map.on('mouseenter', 'windfarms-selected-symbol', this.whenFeatureMouseOver);
      map.on('mouseenter', 'windfarms-suspect-data-symbol', this.whenFeatureMouseOver);

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'windfarms-symbol', this.whenFeatureMouseOut);
      map.on('mouseleave', 'windfarms-selected-symbol', this.whenFeatureMouseOut);
      map.on('mouseleave', 'windfarms-suspect-data-symbol', this.whenFeatureMouseOut);

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
          this.afterMapRender(WindFarm.getFarms()[0]);
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
      case "noaa-stations":
        noaaStationStyle.toggleVisibility(this.map);
        break;
      case "wind-farm-highlights":
        wfHighlightStyle.toggleVisibility(this.map);
        break;
      default:
        break;
    }
  }

  whenOEIFarmClicked(e, feature) {
    let props = e.features[0].properties,
        lnglat = e.lngLat,
        fid = props.fid,
        label = props.label,
        manu = props.manufacturers,
        cap = props.total_capacity_mw,
        unit_count = 28,
        lon = lnglat.lng,
        lat = lnglat.lat;

    console.log(`${fid},${label},${manu},${cap},${unit_count},${lon},${lat}`);
  }

  whenFeatureClicked(e, feature) {
    // The click event has a feature wherein the properties have been turned into strings.
    // Need to supply the proper object form so we find it in our local copy of the data
    if(!feature) {
      feature = WindFarm.getWindFarmById(e.features[0].properties.fid);
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
