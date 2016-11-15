import React from 'react';
import { connect } from 'react-redux';
import '../../../node_modules/leaflet/dist/leaflet.css';
import L from '../../../node_modules/leaflet/dist/leaflet-src';
import * as topojson from '../../../node_modules/topojson/build/topojson';
import windFarmData from '../../data/swpp-wind-farms-4326.topo.json';
import leafletConfig from './leaflet-config';
import './Map.scss';
import { mapStateToProps, mapDispatchToProps } from './selectors';


export class Map extends React.Component {

  constructor(props) {
    super(props);
    this.whenFeatureClicked = this.whenFeatureClicked.bind(this);
  }

  whenFeatureClicked(e) {
    const feature = e.target.feature
    feature.name = e.target.feature.properties.site_name
    this.props.onSelectFeature(feature);
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
        layers.push(L.geoJSON(geojsonData, {
          onEachFeature: (feature, layer) => {
            layer.on({
              click: this.whenFeatureClicked
            });
          }
        }));
      }
    }

    L.map("wind-map", {
      layers: layers,
      center: leafletConfig.initialCenter,
      zoom: leafletConfig.initialZoom,
      minZoom: leafletConfig.minZoom,
      maxZoom: leafletConfig.maxZoom
    })
  }

  render() {
    return (
      <div id="wind-map" className="stretch-v"></div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
