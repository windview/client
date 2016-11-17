import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { connect } from 'react-redux';
import '../../../node_modules/leaflet/dist/leaflet.css';
import L from '../../../node_modules/leaflet/dist/leaflet-src';
// import wkt from 'wellknown';
import * as topojson from '../../../node_modules/topojson/build/topojson';
import windFarmData from '../../data/swpp-wind-farms-4326-augmented.topo.json';
import leafletConfig from './leaflet-config';
import './Map.scss';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import Slider from './slider/Slider';
import { forecastValFarmStyle, augmentFeatures } from './featureUtils';
import moment from 'moment';


const getFeaturePopupMarkup = (feature) => {
  let displayTime = "N/A", 
        windSpeed = "Unavailable",
        power = "Unavailable";
  if(feature.properties.currentForecastVal) {
    displayTime = moment(feature.properties.currentForecastVal.timestamp).format('h:mm a');
    windSpeed = feature.properties.currentForecastVal.windSpeed + " m/s";
    power = feature.properties.currentForecastVal.power + " MW";
  }
  const html = renderToStaticMarkup(
    <div>
      <strong>{feature.properties.site_name}</strong><br />
      <table className="map-popup">
        <tbody><tr>
          <td>Total Capacity</td><td className="right">{feature.properties.total_cpcy}</td>
        </tr><tr>
          <td>Capacity per Turbine</td><td className="right">{feature.properties.MW_turbine}</td>
        </tr><tr>
          <td>Forecast Time</td><td className="right">{displayTime}</td>
        </tr><tr>
          <td>Forecast Windspeed (100m)</td><td className="right">{windSpeed}</td>
        </tr><tr>
          <td>Forecast Wind Power</td><td className="right">{power}</td>
        </tr></tbody>
      </table>
      <br />
      <em>click map to view detailed forecast analysis</em>
    </div>
  );
  return html;
}

export class Map extends React.Component {

  constructor(props) {
    super(props);
    this.whenFeatureClicked = this.whenFeatureClicked.bind(this);
    this.whenFeatureMouseOver = this.whenFeatureMouseOver.bind(this);
    this.whenFeatureMouseOut = this.whenFeatureMouseOut.bind(this);
    this.whenSliderMoved = this.whenSliderMoved.bind(this);  
  }

  whenFeatureClicked(e) {
    const feature = e.target.feature;
    feature.name = e.target.feature.properties.site_name;
    this.props.onSelectFeature(feature);
  }

  whenFeatureMouseOver(e) { 
    if(this.map) {
      this.layerPopup = L.popup()
        .setLatLng(e.latlng)
        .setContent(getFeaturePopupMarkup(e.target.feature))
        .openOn(this.map);
    }
  }

  whenFeatureMouseOut(e) {
    if(this.layerPopup && this.map) {
      this.map.closePopup(this.layerPopup);
      this.layerPopup = null;
    }
  }

  whenSliderMoved(newTimestamp) {
    this.props.onSelectTimestamp(newTimestamp);
  }

  // TODO this is a way of observing state changes. React style of doing things 
  // discourages this kind of thing, but in order to update 3rd party things like
  // the map and the slider we're going to do this for now
  componentWillReceiveProps(nextProps) {
    if(this.props.selectedTimestamp !== nextProps.selectedTimestamp) {
      const windFarmLayer     = this.windFarmLayer,
            selectedTimestamp = nextProps.selectedTimestamp;

      // Update the current forecast val on each GeoJSON object 
      windFarmLayer.eachLayer((layer) => {
        if(layer.feature.properties.forecastData) {
          let newForecastVal = layer.feature.properties.forecastData.filter((row) => {
            return row.timestamp === selectedTimestamp;
          })[0];
          layer.feature.properties.currentForecastVal = newForecastVal;
        }
      });
      
      this.refreshMapStyle();   
    }
  }

  // trigger a style refresh to update map colors
  refreshMapStyle() {
    this.windFarmLayer.setStyle(forecastValFarmStyle);    
  }

  componentDidMount() {
    let layers = [];
    // Add OSM base tiles
    layers.push(L.tileLayer(leafletConfig.basemapTileURL, {
      minZoom: leafletConfig.minZoom,
      maxZoom: leafletConfig.maxZoom,
      attribution: leafletConfig.basemapTileAttrib
    }));

    for (var obj in windFarmData.objects) {
      if(windFarmData.objects[obj]) {
        let geojsonData = topojson.feature(windFarmData, windFarmData.objects[obj]);

        augmentFeatures(geojsonData.features, this.props.selectedTimestamp, this.refreshMapStyle.bind(this));

        this.windFarmLayer = L.geoJSON(geojsonData, {
          style: forecastValFarmStyle,
          onEachFeature: (feature, layer) => {
            layer.on({
              click: this.whenFeatureClicked,
              mouseover: this.whenFeatureMouseOver,
              mouseout: this.whenFeatureMouseOut,
            });
          }
        });

        layers.push(this.windFarmLayer);
      }
    }

    this.map = L.map("wind-map", {
      layers: layers,
      center: leafletConfig.initialCenter,
      zoom: leafletConfig.initialZoom,
      minZoom: leafletConfig.minZoom,
      maxZoom: leafletConfig.maxZoom
    })
  }

  render() {
    return (
      <span>
        <div id="wind-map" className="stretch-v"></div>
        <Slider startTime={this.startTime} onChange={this.whenSliderMoved}/>
      </span>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
