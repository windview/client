import {getMapPowerDisplayBins} from '../../../data/config';

let layerIds = [],
    initialRadius = 26;

// unused animation properties
/*
      framesPerSecond = 5,
      initialOpacity = 1,
      radius = initialRadius,
      maxRadius = 38;
      opacity = initialOpacity,
      animate = false;
*/

const updateFilters = (map) => {
  if(layerIds.length > 0){
    let filter = null,
        bins = getMapPowerDisplayBins();
    layerIds.forEach(lid=>{
      switch(lid) {
        case 'forecast-mega':
          filter = [">=", "bestForecastMW", bins[3]];
          break;
        case 'forecast-big':
          filter = ["all",[">=", 'bestForecastMW', bins[2]],["<", 'bestForecastMW', bins[3]]];
          break;
        case 'forecast-medium':
          filter = ["all",[">=", 'bestForecastMW', bins[1]],["<", 'bestForecastMW', bins[2]]];
          break;
        case 'forecast-small':
          filter = ["all",[">=", 'bestForecastMW', bins[0]],["<", 'bestForecastMW', bins[1]]];
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

  // Mega winds
  map.addLayer({
    id: 'forecast-mega',
    type: 'circle',
    source: layerSource,
    paint: {
      'circle-radius': initialRadius,
      'circle-stroke-width': 11,
      'circle-stroke-color': 'hsla(240, 100%, 80%, .9)',
    },
    filter: [">=", "bestForecastMW", bins[3]],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('forecast-mega');


  // Strong winds
  map.addLayer({
    id: 'forecast-big',
    type: 'circle',
    source: layerSource,
    paint: {
      'circle-radius': initialRadius,
      'circle-stroke-width': 8,
      'circle-stroke-color': 'hsla(240, 100%, 60%, .7)',
    },
    filter: ["all",[">=", 'bestForecastMW', bins[2]],["<", 'bestForecastMW', bins[3]]],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('forecast-big');

  // Medium winds
  map.addLayer({
    id: 'forecast-medium',
    type: 'circle',
    source: layerSource,
    paint: {
      'circle-radius': initialRadius,
      'circle-stroke-width': 5,
      'circle-stroke-color': 'hsla(240, 100%, 40%, .7)',
    },
    filter: ["all",[">=", 'bestForecastMW', bins[1]],["<", 'bestForecastMW', bins[2]]],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('forecast-medium');

  // Light winds
  map.addLayer({
    id: 'forecast-small',
    type: 'circle',
    source: layerSource,
    paint: {
      'circle-radius': initialRadius,
      'circle-stroke-width': 2,
      'circle-stroke-color': 'hsla(240, 100%, 25%, 1)',
    },
    filter: ["all",[">", 'bestForecastMW', bins[0]],["<", 'bestForecastMW', bins[1]]],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('forecast-small');

  // Yellow halo when things are getting dicey
  map.addLayer({
    id: 'forecast-y-halo',
    type: 'circle',
    source: 'windfarms',
    paint: {
      'circle-radius': initialRadius,
      'circle-color': 'hsla(53, 100%, 54%, 0.8)',
      'circle-opacity': 0.8
    },
    filter: ["all",["==", "rampSeverity", 1],["==", 'displayAlerts', true]],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('forecast-y-halo');

  map.addLayer({
    id: 'forecast-o-halo',
    type: 'circle',
    source: 'windfarms',
    paint: {
      'circle-radius': initialRadius,
      'circle-color': 'hsla(31, 100%, 54%, 0.8)',
      'circle-opacity': 0.8
    },
    filter: ["all",["==", "rampSeverity", 2],["==", 'displayAlerts', true]],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('forecast-o-halo');

  // Red halo when it's going down right now
  map.addLayer({
    id: 'forecast-r-halo',
    type: 'circle',
    source: 'windfarms',
    paint: {
      'circle-radius': initialRadius,
      'circle-color': '#B00',
      'circle-opacity': 0.8,
    },
    filter: ["all",[">=", "rampSeverity", 3],["==", 'displayAlerts', true]],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('forecast-r-halo');

  map.addLayer({
    id: 'forecast-up-arrow',
    type: 'symbol',
    source: 'windfarms',
    filter: ["all",
      [">=", "rampSeverity", 1],
      ["==", 'displayAlerts', true],
      ["==", 'rampDirection', 'up']
    ],
    paint: {
      "icon-opacity": 1
    },
    layout: {
      visibility: "none",
      'icon-image': 'chevronUp',
      'icon-size': .9,
      'icon-offset': [0,-2],
      'icon-allow-overlap': true
    }
  });
  layerIds.push('forecast-up-arrow');

  map.addLayer({
    id: 'forecast-down-arrow',
    type: 'symbol',
    source: 'windfarms',
    filter: ["all",
      [">=", "rampSeverity", 1],
      ["==", 'displayAlerts', true],
      ["==", 'rampDirection', 'down']
    ],
    paint: {
      "icon-opacity": 1
    },
    layout: {
      visibility: "none",
      'icon-image': 'chevronDown',
      'icon-size': .9,
      'icon-offset': [0,1],
      'icon-allow-overlap': true
    }
  });
  layerIds.push('forecast-down-arrow');
};

export const getLayerIds = () => {
  return layerIds;
}

export const initializeStyle = (map, layerSource) => {
  if(layerIds.length > 0){
    updateFilters(map);
  } else {
    addLayers(map, layerSource);
  }
};

// const toggleAnimation = (map, visibility) => {
//   if(visibility === 'none') {
//     animate = false;
//   } else {
//     // This function causes the red halo to blip
//     function animateMarker(timestamp) {
//       setTimeout(function(){
//         if(animate) {
//           requestAnimationFrame(animateMarker);
//
//           radius += (maxRadius - radius) / framesPerSecond;
//           opacity -= ( .9 / framesPerSecond );
//           opacity = opacity < 0 ? 0 : opacity;
//
//           map.setPaintProperty('forecast-r-halo', 'circle-radius', radius);
//           map.setPaintProperty('forecast-r-halo', 'circle-opacity', opacity);
//
//           if (opacity === 0) {
//             radius = initialRadius;
//             opacity = initialOpacity;
//           }
//         }
//       }, 1000 / framesPerSecond);
//     }
//
//     // Start the animation.
//     animate = true;
//     animateMarker(0);
//   }
// }

export const toggleVisibility = (map) => {
  if(layerIds.length === 0) { return; }
  const visible = map.getLayoutProperty(layerIds[0], 'visibility') === 'visible' ? 'none' : 'visible';
  layerIds.forEach(function(id){
    map.setLayoutProperty(id, 'visibility', visible);
  });
}
