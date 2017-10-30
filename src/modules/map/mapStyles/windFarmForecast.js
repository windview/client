const layerIds = [],
      framesPerSecond = 5,
      initialOpacity = 1,
      initialRadius = 20,
      maxRadius = 38;
let   opacity = initialOpacity,
      radius = initialRadius,
      animate = false;

export const initializeStyle = (map, layerSource) => {
  const initialRadius = 26;

// Mega winds
  map.addLayer({
    id: 'forecast-mega',
    type: 'circle',
    source: layerSource,
    paint: {
      'circle-radius': initialRadius,
      'circle-stroke-width': 8,
      'circle-stroke-color': 'hsla(310, 100%, 40%, 0.7)',
    },
    filter: [">=", "forecastMW", 20],
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
      'circle-stroke-width': 6,
      'circle-stroke-color': 'hsla(280, 100%, 50%, .7)',
    },
    filter: [">=", "forecastMW", 10],
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
      'circle-stroke-width': 4,
      'circle-stroke-color': 'hsla(250, 100%, 70%, .7)',
    },
    filter: [">=", "forecastMW", 3],
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
      'circle-stroke-color': 'hsla(219, 100%, 70%, .7)',
    },
    filter: [">", "forecastMW", 0],
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
      'circle-radius': initialRadius+8,
      'circle-color': 'hsla(53, 100%, 54%, 0.8)',
      'circle-opacity': 0.5
    },
    filter: ["==", "rampSeverity", 1],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('forecast-y-halo');

  // Red halo when it's going down right now
  map.addLayer({
    id: 'forecast-r-halo',
    type: 'circle',
    source: 'windfarms',
    paint: {
      'circle-radius': initialRadius+8,
      'circle-color': '#B00',
    'circle-opacity': 0.8,
    },
    filter: [">=", "rampSeverity", 2],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('forecast-r-halo');
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
