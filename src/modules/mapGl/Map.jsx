import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { connect } from 'react-redux';
import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '../../../node_modules/mapbox-gl/dist/mapbox-gl.js'
// import wkt from 'wellknown';
import windFarmData from '../../data/usgs_wind_farms.geo.json';
import windFarmIcon from '../../images/windfarm.png';
import './Map.scss';
import { mapStateToProps, mapDispatchToProps } from './selectors';
import Slider from './slider/Slider';
import * as featureUtils from './featureUtils';
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
      <strong>{feature.properties.label}</strong><br />
      <table className="map-popup">
        <tbody><tr>
          <td>Total Capacity</td><td className="right">{feature.properties.total_capacity}</td>
        </tr><tr>
          <td>Manufacturer(s)</td><td className="right">{feature.properties.manufacturers}</td>
        </tr><tr>
          <td>Models</td><td className="right">{feature.properties.models}</td>
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
    const feature = e.features[0];
    this.layerPopup = new mapboxgl.Popup()
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML(getFeaturePopupMarkup(e.features[0]))
            .addTo(this.map);
    feature.name = feature.properties.label;
    // This simulates a data loading pause to make obivous the chart loading
    this.props.onSelectFeature({name: feature.name, loading: true});
    setTimeout(() => {
      this.props.onSelectFeature(feature);  
    }, 1000);
  }

  whenFeatureMouseOver(e) { 
    if(this.map) {
      this.map.getCanvas().style.cursor = 'pointer';
    }
  }

  whenFeatureMouseOut(e) {
    if(this.map) {
      this.map.getCanvas().style.cursor = '';
      if(this.layerPopup) {
        this.layerPopup.remove();
        this.layerPopup = null;
      }
    }
  }

  whenSliderMoved(newTimestamp) {
    this.props.onSelectTimestamp(newTimestamp);
  }

  // TODO this is a way of observing state changes that is useful
  // for integrating with 3rd party libraries. Since data binding
  // between React and say Leaflet isn't possible, the approach is
  // to intercept React component lifecycle events and manually
  // attach any 3rd party lib binding therein. React libraries
  // that wrap integration do this under the covers. e.g.
  //https://github.com/PaulLeCam/react-leaflet
  componentWillReceiveProps(nextProps) {
    if(this.props.selectedTimestamp !== nextProps.selectedTimestamp) {
      console.log("TODO implement map styles on timestamp change");
      if(this.windFarmLayerL) {
        const windFarmLayer     = this.windFarmLayerL,
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
        const features          = this.windFarmData.features,
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

  componentDidMount() {
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
    
    // initialize animation properties
    let framesPerSecond = 15,
        initialOpacity = 1,
        opacity = initialOpacity,
        initialRadius = 8,
        radius = initialRadius,
        maxRadius = 38;

    // initialize windfarm data
    if(windFarmData) {
      // Add simulated forecast data to features
      featureUtils.augmentFeatures(windFarmData.features, this.props.selectedTimestamp);
      this.windFarmData = windFarmData;
    }

    // after map initializes itself, go to work adding all the things
    map.on('load', function(){
      // Add translines layer
      map.addSource('translines', {
          type: "vector",
          url: "http://localhost:8084/translines/metadata.json"
      });
      map.addLayer({
        'id': 'translines',
        'type': 'line',
        'source': 'translines',
        'source-layer': 'translines',
        "layout": {
            "line-join": "bevel"
        },
        "paint": {
          "line-color": {
            property: "voltage",
            type: "exponential",
            stops: [
              [0, "hsla(26%, 100%, 90%, 0.1)"],
              [800, "hsla(15%, 100%, 43%, 1)"]
            ]
          },
          "line-width": {
            "base": 1,
            "stops": [
              [0, .3],
              [5, 1], 
              [8, 3], 
              [20, 20]
            ]
          }
        }
      });

      // Add windfarms as a collection of layers. Each layer
      // represents a different display aspect... in some 
      // cases layering to create a total effect, and in 
      // other cases adding highlights indicative of certian 
      // properties.
      map.addSource('windfarms', {
        type: "geojson",
        data: windFarmData
      });
      // Green halo when all is well
      map.addLayer({
        id: 'windfarms-g-halo',
        type: 'circle',
        source: 'windfarms',
        paint: {
          'circle-radius': initialRadius+6,
          'circle-color': '#0F0',
          'circle-opacity': 0.5
        },
        filter: ["<", "total_capacity", 10000]
      });
      // Yellow halo when things are getting dicey
      map.addLayer({
        id: 'windfarms-y-halo',
        type: 'circle',
        source: 'windfarms',
        paint: {
          'circle-radius': initialRadius+6,
          'circle-color': '#FB1',
          'circle-opacity': 0.7
        },
        filter: [ 
          "all",
          [">=", "total_capacity", 10000],
          ["<", "total_capacity", 30000]
        ]
      });
      // Red halo when it's going down right now
      map.addLayer({
        id: 'windfarms-r-halo',
        type: 'circle',
        source: 'windfarms',
        paint: {
          'circle-radius': initialRadius,
          'circle-color': '#B00',
          "circle-radius-transition": {duration: 0},
          "circle-opacity-transition": {duration: 0},
        },
        filter: [">=", "total_capacity", 30000]
      });
      // Custom image icon for wind farms
      map.loadImage(windFarmIcon, (err, image) => {
        if(err) return;
        map.addImage('windfarm', image);
      });
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

      // This function causes the red halo to blip
      function animateMarker(timestamp) {
        setTimeout(function(){
          requestAnimationFrame(animateMarker);

          radius += (maxRadius - radius) / framesPerSecond;
          opacity -= ( .9 / framesPerSecond );
          opacity = opacity < 0 ? 0 : opacity;

          map.setPaintProperty('windfarms-r-halo', 'circle-radius', radius);
          map.setPaintProperty('windfarms-r-halo', 'circle-opacity', opacity);

          if (opacity <= 0) {
            radius = initialRadius;
            opacity = initialOpacity;
          } 
        }, 1000 / framesPerSecond); 
      }

      // Start the animation.
      animateMarker(0);

      // Handle the relevant events on the windfarms layer
      map.on('click', 'windfarms-symbol', this.whenFeatureClicked);

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on('mouseenter', 'windfarms-symbol', this.whenFeatureMouseOver);

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'windfarms-symbol', this.whenFeatureMouseOut);

    }.bind(this));  
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
