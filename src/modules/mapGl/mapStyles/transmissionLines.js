const layerIds = [];

export const initializeStyle = (map, layerSource) => {
  map.addLayer({
    'id': 'translines',
    'type': 'line',
    'source': 'translines',
    'source-layer': 'transmission-lines',
    "paint": {
      "line-color": {
        property: "voltage_kv",
        type: "exponential",
        stops: [
          [69000,  "hsla(26, 100%, 90%, 0.4)"],
          [400000, "hsla(15, 100%, 43%, 1)"]
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
    },
    filter: ["has", "voltage_kv"],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('translines');

  map.addLayer({
    'id': 'translines-grey',
    'type': 'line',
    'source': 'translines',
    'source-layer': 'transmission-lines', 
    "paint": {
      "line-color": "hsla(0, 0%, 32%, .5)",
      "line-width": {
        "base": 1,
        "stops": [
          [0, .3],
          [5, 1], 
          [8, 3], 
          [20, 20]
        ]
      }
    },
    filter: ["!has", "voltage_kv"],
    layout: {
      visibility: 'none'
    }
  });
  layerIds.push('translines-grey');
}

export const toggleVisibility = (map) => {
  if(layerIds.length === 0) { return; }
  const visible = map.getLayoutProperty(layerIds[0], 'visibility') === 'visible' ? 'none' : 'visible';
  layerIds.forEach(function(id){
    map.setLayoutProperty(id, 'visibility', visible);
  });
}
