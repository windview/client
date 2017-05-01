//import { csv } from 'd3';

export const exploreData = (features) => {
  let capacity = [];
  let ws = [];
  features.forEach((feature) => {
    capacity.push(Number(feature.properties.total_capacity));
    if(feature.properties.wtk_site_data) {
      ws.push(Number(feature.properties.wtk_site_data.windSpeed))
    }
  });
  console.log(capacity.sort((a, b)=>{return a-b}));
  console.log(ws.sort((a, b)=>{return a-b}));
}

export const forecastValFarmStyle = (feature) => {
  let style = {color: "grey"};
  if(feature.properties.currentForecastVal) {
    const forecastVal = feature.properties.currentForecastVal.windSpeed;
    if(forecastVal < 1) {
      style = {
        "color": "yellow",
        "fillOpacity": .75,
        //"color": "#000000",
        "weight": 6,
        "opacity": 1,
      }
    } else if(forecastVal < 3.5) {
      style = {
        "color": "rgb(128, 177, 211",
        "fillOpacity": .75,
        //"color": "#000000",
        "weight": 3,
        "opacity": 1,
      }
    } else if(forecastVal < 6) {
      style = {
        "color": "blue",
        "fillOpacity": .75,
        //"color": "#000000",
        "weight": 3,
        "opacity": 1,
      }
    } else {
      style = {
        "color": "red",
        "fillOpacity": .75,
        //"color": "#000000",
        "weight": 8,
        "opacity": 1,
      }
    }
  }
  return style;
}

export const getFeatureFill = (feature) => {
  if(feature.properties.currentForecastVal) {
    const forecastVal = feature.properties.currentForecastVal.windSpeed;
    if(forecastVal < 1) {
      return 'yellow';
    } else if(forecastVal < 3.5) {
      return "rgb(128, 177, 211";
    } else if(forecastVal < 6) {
      return 'blue';
    } else {
      return 'red';
    }
  } else {
    return 'black';
  }
}
