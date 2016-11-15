import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { connect } from 'react-redux';
import '../../../node_modules/leaflet/dist/leaflet.css';
import L from '../../../node_modules/leaflet/dist/leaflet-src';
import * as topojson from '../../../node_modules/topojson/build/topojson';
import windFarmData from '../../data/swpp-wind-farms-4326.topo.json';
import leafletConfig from './leaflet-config';
import './Map.scss';
import { mapStateToProps, mapDispatchToProps } from './selectors';


const getFeaturePopupMarkup = (feature) => {
  const html = renderToStaticMarkup(
    <div>
      <strong>{feature.properties.site_name}</strong><br />
      <table className="map-popup">
        <tbody><tr>
          <td>Total Capacity</td><td className="right">{feature.properties.total_cpcy}</td>
        </tr><tr>
          <td>Capacity per Turbine</td><td className="right">{feature.properties.MW_turbine}</td>
        </tr></tbody>
      </table>
    </div>
  );
  return html;
}

export class Map extends React.Component {

  constructor(props) {
    super(props);
    this.whenFeatureClicked = this.whenFeatureClicked.bind(this);
    this.whenFeatureMouseOver = this.whenFeatureMouseOver.bind(this)
    this.whenFeatureMouseOut = this.whenFeatureMouseOut.bind(this);
  }

  whenFeatureClicked(e) {
    const feature = e.target.feature
    feature.name = e.target.feature.properties.site_name
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
              click: this.whenFeatureClicked,
              mouseover: this.whenFeatureMouseOver,
              mouseout: this.whenFeatureMouseOut,
            });
          }
        }));
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
      <div id="wind-map" className="stretch-v"></div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
