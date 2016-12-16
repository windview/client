import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { connect } from 'react-redux';
import '../../../node_modules/leaflet/dist/leaflet.css';
import L from '../../../node_modules/leaflet/dist/leaflet-src';
// import wkt from 'wellknown';
import windFarmData from '../../data/swpp-wind-farms-4326-augmented.topo.json';
import leafletConfig from './leaflet-config';
import './Map.scss';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import Slider from './slider/Slider';
import * as featureUtils from './featureUtils';
import moment from 'moment';
import * as d3 from 'd3';

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
    this.refreshMapStyle = this.refreshMapStyle.bind(this);
  }

  whenFeatureClicked(e) {
    debugger;
    const feature = e.target.feature;
    feature.name = e.target.feature.properties.site_name;
    // This simulates a data loading pause to make obivous the chart loading
    this.props.onSelectFeature({name: feature.name, loading: true});
    setTimeout(() => {
      this.props.onSelectFeature(feature);  
    }, 2000);
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

  // TODO this is a way of observing state changes that is useful
  // for integrating with 3rd party libraries. Since data binding
  // between React and say Leaflet isn't possible, the approach is
  // to intercept React component lifecycle events and manually
  // attach any 3rd party lib binding therein
  componentWillReceiveProps(nextProps) {
    if(this.props.selectedTimestamp !== nextProps.selectedTimestamp) {
      if(this.windFarmLayerL) {
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
      } else if(this.windFarmLayerD) {
        const features          = this.geojsonData.features,
              windFarmLayer     = this.windFarmLayerD,
              selectedTimestamp = nextProps.selectedTimestamp;

        features.forEach((feature)=>{
          if(feature.properties.forecastData) {
            let newForecastVal = feature.properties.forecastData.filter((row) => {
              return row.timestamp === selectedTimestamp;
            })[0];
            feature.properties.currentForecastVal = newForecastVal;
          }
        });

        windFarmLayer.selectAll("path").data(features).attr('fill', featureUtils.getFeatureFill);
      }        
    }
  }

  // trigger a style refresh to update map colors
  refreshMapStyle() {
    if(this.windFarmLayerL) {
      this.windFarmLayer.setStyle(featureUtils.forecastValFarmStyle);    
    } else if(this.windFarmLayerD) {
      // not needed for d3
    }
  }

  getWindFarmLayerLeaflet(geojsonData) {
    return L.geoJSON(geojsonData, {
      style: featureUtils.forecastValFarmStyle,
      onEachFeature: (feature, layer) => {
        layer.on({
          click: this.whenFeatureClicked,
          mouseover: this.whenFeatureMouseOver,
          mouseout: this.whenFeatureMouseOut,
        });
      }
    });
  }

  getWindFarmLayerD3(geojsonData, map) {
    let svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide"),
        transform = d3.geoTransform({point: projectPoint}),
        path = d3.geoPath().projection(transform);

    let feature = g.selectAll("path")
      .data(geojsonData.features)
      .enter().append("path")
      .on('click', (feature) => {console.log(feature);})      
      .attr('fill', featureUtils.getFeatureFill);

    feature.on('click', (feature) => {console.log(feature);})
      .on('mouseover', this.whenFeatureMouseOver)
      .on('mouseout', this.whenFeatureMouseOver);

    map.on("zoomend", reset);
    reset();

    function reset() {
      var bounds = path.bounds(geojsonData),
          topLeft = bounds[0],
          bottomRight = bounds[1];
      svg.attr("width", bottomRight[0] - topLeft[0])
        .attr("height", bottomRight[1] - topLeft[1])
        .style("left", topLeft[0] + "px")
        .style("top", topLeft[1] + "px");
      g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
      feature.attr("d", path);
    }

    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
      const point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }

    this.windFarmLayerD = g;
  }

  componentDidMount() {

    //Create leaflet map
    let map = L.map("wind-map", {
      center: leafletConfig.initialCenter,
      zoom: leafletConfig.initialZoom,
      minZoom: leafletConfig.minZoom,
      maxZoom: leafletConfig.maxZoom
    });
    this.map = map;

    // Add OSM base layer
    L.tileLayer(leafletConfig.basemapTileURL, {
      minZoom: leafletConfig.minZoom,
      maxZoom: leafletConfig.maxZoom,
      attribution: leafletConfig.basemapTileAttrib
    }).addTo(map);

    // Load windfarm data
    let geojsonData = featureUtils.getGeoJsonFromTopo(windFarmData, "swpp-wind-farms-4326");
    this.geojsonData = geojsonData;
    if(geojsonData) {
      // Add simulated forecast data to features
      // LEAFLET STYLE
      //featureUtils.augmentFeatures(geojsonData.features, this.props.selectedTimestamp, this.refreshMapStyle);
      // Leaflet farm layer
      //let windFarmLayer = this.getWindFarmLayerLeaflet(geojsonData);
      //windFarmLayer.addTo(map);
      //this.windFarmLayerL = windFarmLayer;
      // D3 STYLE
      featureUtils.augmentFeatures(geojsonData.features, this.props.selectedTimestamp, function() {
        this.getWindFarmLayerD3(geojsonData, map);  
      }.bind(this));
    }
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
