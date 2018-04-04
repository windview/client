// initialize properties
let layerIds = [],
    initialRadius = 20;

// unused animation props
/*
      framesPerSecond = 5,
      initialOpacity = 1,

      maxRadius = 38;
      opacity = initialOpacity,
      radius = initialRadius,
      animate = false;
*/

export const initializeStyle = (map, layerSource) => {

  // Green halo when all is well
  /*
  map.addLayer({
    id: 'windfarms-g-halo',
    type: 'circle',
    source: 'windfarms',
    paint: {
      'circle-radius': initialRadius+6,
      'circle-color': '#0F0',
      'circle-opacity': 0.5
    },
    filter: ["!has", "hasRamp"],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('windfarms-g-halo');
  */

  // Yellow halo when things are getting dicey
  map.addLayer({
    id: 'windfarms-y-halo',
    type: 'circle',
    source: 'windfarms',
    paint: {
      'circle-radius': initialRadius+8,
      'circle-color': 'hsla(53, 100%, 54%, 0.8)',
      'circle-opacity': 0.5
    },
    filter: ["all",["==", "maxRampSeverity", 1],["==", 'displayAlerts', true]],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('windfarms-y-halo');

  map.addLayer({
    id: 'windfarms-o-halo',
    type: 'circle',
    source: 'windfarms',
    paint: {
      'circle-radius': initialRadius+8,
      'circle-color': 'hsla(31, 100%, 54%, 0.8)',
      'circle-opacity': 0.6
    },
    filter: ["all",["==", "maxRampSeverity", 2],["==", 'displayAlerts', true]],
    layout: {
      visibility: "none"
    }
  });
  layerIds.push('windfarms-o-halo');

  // Red halo when it's going down right now
  map.addLayer({
    id: 'windfarms-r-halo',
    type: 'circle',
    source: 'windfarms',
    paint: {
      'circle-radius': initialRadius+8,
      'circle-color': '#B00',
      'circle-opacity': 0.8,
    },
    filter: ["all",[">=", "maxRampSeverity", 3],["==", 'displayAlerts', true]],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('windfarms-r-halo');

  map.addLayer({
    id: 'windfarms-up-arrow',
    type: 'symbol',
    source: 'windfarms',
    filter: ["all",
      [">=", "maxRampSeverity", 1],
      ["==", 'displayAlerts', true],
      ["==", 'overallRampDirection', 'up']
    ],
    paint: {
      "text-color": "hsla(85, 100%, 50%, .6)"
    },
    layout: {
      visibility: "none",
      "text-field": "<",
      "text-font": ["Raanana", "PT Sans Narrow", "Optima", "Arial"],
      "text-size": 80,
      "text-offset": [-0.1, -0.015],
      "text-anchor": "center",
      "text-rotate": 90,
      "text-allow-overlap": true
    }
  });
  layerIds.push('windfarms-up-arrow');

  map.addLayer({
    id: 'windfarms-down-arrow',
    type: 'symbol',
    source: 'windfarms',
    filter: ["all",
      [">=", "maxRampSeverity", 1],
      ["==", 'displayAlerts', true],
      ["==", 'overallRampDirection', 'down']
    ],
    paint: {
      "text-color": "hsla(85, 100%, 50%, .6)"
    },
    layout: {
      visibility: "none",
      "text-field": ">",
      "text-font": ["Raanana", "PT Sans Narrow", "Optima", "Arial"],
      "text-size": 80,
      "text-offset": [0.08, -0.01],
      "text-anchor": "center",
      "text-rotate": 90,
      "text-allow-overlap": true
    }
  });
  layerIds.push('windfarms-down-arrow');
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
//           map.setPaintProperty('windfarms-r-halo', 'circle-radius', radius);
//           map.setPaintProperty('windfarms-r-halo', 'circle-opacity', opacity);
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

export const getLayerIds = () => {
  return layerIds;
}

export const toggleVisibility = (map) => {
  if(layerIds.length === 0) { return; }
  const visible = map.getLayoutProperty(layerIds[0], 'visibility') === 'visible' ? 'none' : 'visible';
  layerIds.forEach(function(id){
    map.setLayoutProperty(id, 'visibility', visible);
  });
}
