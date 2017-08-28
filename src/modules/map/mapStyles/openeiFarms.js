const layerIds = [];

export const initializeStyle = (map, layerSource) => {
  map.addLayer({
    'id': 'openei-farms',
    'type': 'circle',
    'source': 'openei-farms',
    'source-layer': 'openeifarms',
    'paint': {
      'circle-color': 'hsl(174, 85%, 41%)',
      'circle-radius': 3
    },
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('openei-farms');
}

export const toggleVisibility = (map) => {
  if(layerIds.length === 0) { return; }
  const visible = map.getLayoutProperty(layerIds[0], 'visibility') === 'visible' ? 'none' : 'visible';
  layerIds.forEach(function(id){
    map.setLayoutProperty(id, 'visibility', visible);
  });
}
