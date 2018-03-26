const layerIds = [];

export const initializeStyle = (map, layerSource) => {
  map.addLayer({
    'id': 'noaa-stations',
    'type': 'circle',
    'source': 'noaa-stations',
    'source-layer': 'stationsgeo',
    'paint': {
      'circle-color': 'hsl(297, 79%, 54%)',
      'circle-radius': 3
    },
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('noaa-stations');
}

export const toggleVisibility = (map) => {
  if(layerIds.length === 0) { return; }
  const visible = map.getLayoutProperty(layerIds[0], 'visibility') === 'visible' ? 'none' : 'visible';
  layerIds.forEach(function(id){
    map.setLayoutProperty(id, 'visibility', visible);
  });
}
