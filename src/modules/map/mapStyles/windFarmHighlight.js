// initialize properties
let layerIds = [],
    // style props
    initialRadius = 20,
    initialStroke = 0,
    radius = initialRadius,
    stroke = initialStroke,
    finalRadius = 33,
    finalStroke = 7,
    // animation props
    framesPerSecond = 10,
    radiusStep = (finalRadius - initialRadius) / framesPerSecond,
    strokeStep = (finalStroke - initialStroke) / framesPerSecond,
    timeStep = 400/framesPerSecond;

export const initializeStyle = (map, layerSource) => {

  // Green halo when all is well
  map.addLayer({
    id: 'highlighted-g-halo',
    type: 'circle',
    source: layerSource,
    paint: {
      'circle-radius': radius,
      'circle-radius-transition': { duration: 0 },
      'circle-opacity': .7,
      'circle-color': '#000',
      'circle-stroke-width': stroke,
      'circle-stroke-width-transition': { duration: 0 },
      'circle-stroke-opacity': .7,
      'circle-stroke-color': '#45c845',
    },
    filter: ["==", "highlighted", true],
    layout: {
      visibility: 'none'
    }
  });

  layerIds.push('highlighted-g-halo');
}

export const getLayerIds = () => {
  return layerIds;
}

const setInitialStyle = (layerId, map) => {
  radius = initialRadius;
  stroke = initialStroke;
  map.setPaintProperty(layerId, 'circle-radius', radius);
  map.setPaintProperty(layerId, 'circle-stroke-width', stroke);
}

const setSecondaryStyle = (layerId, map) => {
  // Self invoking inner function conducts the animated transition
  function animateMarker() {
    setTimeout(function(){
      radius += radiusStep;
      stroke += strokeStep;
      map.setPaintProperty(layerId, 'circle-radius', radius);
      map.setPaintProperty(layerId, 'circle-stroke-width', stroke);
      if(radius < finalRadius) {
        animateMarker();
      }
    }, timeStep);
  }

  // Start the animation.
  animateMarker();
}

export const toggleVisibility = (map) => {
  if(layerIds.length === 0) { return; }
  const visible = map.getLayoutProperty(layerIds[0], 'visibility') === 'visible' ? 'none' : 'visible';
  layerIds.forEach(function(id){
    setInitialStyle(id, map);
    map.setLayoutProperty(id, 'visibility', visible);
    if(visible === 'visible') {
      setSecondaryStyle(id, map);
    }
  });
}
