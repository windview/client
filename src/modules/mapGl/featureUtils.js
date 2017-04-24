import { csv } from 'd3';

export const augmentFeatures = (features, startTimestamp, onComplete) => {
  let sixHours = (6*60/5); // # of 5 minute intervals in 6 hours
  let fiveMinutes = (1000*60*5); // milliseconds in 5 minutes   
  // rudimentary queue system   
  let featuresRemaining = features.length;
  features.forEach((feature) => {
    if(feature.properties.wtk_site_data) {
      // get the wtk data site id
      const forecastDataId = feature.properties.wtk_site_data.forecastDataId;
      // load the file
      const filePath = '/wtk-data/' + forecastDataId + '-2012.csv';
      csv(filePath, (data) => {
        let forecastData = [];
        for(let x=0; x<=sixHours; x++) {
          let row = data[x];
          let ts = new Date(startTimestamp + x*fiveMinutes).getTime();
          let power = Number(row['power (MW)']).toFixed(3);
          let windSpeed = Number(row['wind speed at 100m (m/s)']).toFixed(2);
          forecastData.push({
            timestamp: ts,
            windSpeed: windSpeed,
            power: power
          });
        }
        // assign the data and the default value (first time slice) to the feature
        feature.properties.forecastData = forecastData;
        feature.properties.currentForecastVal = forecastData[0];
        featuresRemaining--;
        if(featuresRemaining===0) {
          onComplete();
        }
      });
    } else {
      featuresRemaining--;
      if(featuresRemaining===0) {
        onComplete();
      }
    }
  });
}

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
