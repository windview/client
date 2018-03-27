import {getMapPowerDisplayBins} from '../../../data/config';

const layerIds = [];

const updateFilters = (map) => {
  if(layerIds.length > 0){
    let filter = null,
        bins = getMapPowerDisplayBins();
    layerIds.forEach(lid=>{
      switch(lid) {
        case 'windfarms-mega':
          filter = [">=", "capacity_mw", bins[3]];
          break;
        case 'windfarms-big':
          filter = ["all",[">=", 'capacity_mw', bins[2]],["<", 'capacity_mw', bins[3]]];
          break;
        case 'windfarms-medium':
          filter = ["all",[">=", 'capacity_mw', bins[1]],["<", 'capacity_mw', bins[2]]];
          break;
        case 'windfarms-small':
          filter = ["all",[">=", 'capacity_mw', bins[0]],["<", 'capacity_mw', bins[1]]];
          break;
        default:
          filter = null;
      }
      if(filter) map.setFilter(lid, filter);
    });
  }
}

const addLayers = (map, layerSource) => {

  let bins = getMapPowerDisplayBins();
  const initialRadius = 26;

  // Mega winds
    map.addLayer({
      id: 'windfarms-mega',
      type: 'circle',
      source: layerSource,
      paint: {
        'circle-radius': initialRadius,
        'circle-stroke-width': 11,
        'circle-stroke-color': 'hsla(240, 100%, 80%, .9)',
      },
      filter: [">=", "capacity_mw", bins[3]],
      layout: {
        visibility: 'none'
      }
    });
    layerIds.push('windfarms-mega');

  // Big farms
  map.addLayer({
    id: 'windfarms-big',
    type: 'circle',
    source: layerSource,
    paint: {
      'circle-radius': initialRadius,
      'circle-stroke-width': 6,
      'circle-stroke-color': 'hsla(240, 100%, 60%, .7)',
    },
    filter: ["all", [">=", "capacity_mw", bins[2]], ["<", "capacity_mw", bins[3]]],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('windfarms-big');

  // Medium farms
  map.addLayer({
    id: 'windfarms-medium',
    type: 'circle',
    source: layerSource,
    paint: {
      'circle-radius': initialRadius,
      'circle-stroke-width': 4,
      'circle-stroke-color': 'hsla(240, 100%, 40%, .7)',
    },
    filter: ["all", [">=", "capacity_mw", bins[1]], ["<", "capacity_mw", bins[2]]],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('windfarms-medium');

  // Small farms
  map.addLayer({
    id: 'windfarms-small',
    type: 'circle',
    source: layerSource,
    paint: {
      'circle-radius': initialRadius,
      'circle-stroke-width': 2,
      'circle-stroke-color': 'hsla(240, 100%, 25%, 1)',
    },
    filter: ["all", [">", "capacity_mw", bins[0]], ["<", "capacity_mw", bins[1]]],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('windfarms-small');
};

export const initializeStyle = (map, layerSource) => {
  if(layerIds.length > 0){
    updateFilters(map);
  } else {
    addLayers(map, layerSource);
  }
};

export const toggleVisibility = (map) => {
  if(layerIds.length === 0) { return; }
  const visible = map.getLayoutProperty(layerIds[0], 'visibility') === 'visible' ? 'none' : 'visible';
  layerIds.forEach(function(id){
    map.setLayoutProperty(id, 'visibility', visible);
  });
};
