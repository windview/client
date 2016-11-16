// map/slider/Slider.jsx

import React from 'react';
import '../../../../node_modules/nouislider/distribute/nouislider.css';
import noUiSlider from 'nouislider';
import './Slider.scss';

// The current time rounded down to the closest 5 minute
// interval in the past
const getStartTime = () => {
  let startTime = new Date();
  console.log("The start time is", startTime.toUTCString());
  return startTime;
}

const getSliderDisplayFromValue = (rawValue, startTime) => {
  rawValue = Math.round(rawValue);
  console.log("This rawValue is", rawValue);
  let retVal = '';
  if(rawValue === 0) {
    retVal = startTime.getTime();
  } else {
    retVal = new Date(startTime.getTime() + (rawValue*60*1000)).getTime();
  }
  return retVal;
}

const getSliderValueFromDisplay = (displayValue, startTime) => {
  console.log("The display value is", displayValue);
  let retVal = 0;
  if(displayValue !== startTime.getTime()) {
    retVal = ((displayValue - startTime.getTime())/1000/60);   
  }
  return retVal;
}

export class Slider extends React.Component {
  componentDidMount() {
    const startTime = getStartTime();
    const sliderEl = document.getElementById('slider');
    noUiSlider.create(sliderEl, {
      format: {
        to: function(value) {
          return getSliderDisplayFromValue(value, startTime);
        },
        from: function(value) {
          return getSliderValueFromDisplay(value, startTime);
        }
      },
      start: 0,
      connect: [true, false],
      tooltips: [true],
      step: 5,
      range: {
        min: 0,
        max: 360
      }
    });

    sliderEl.noUiSlider.on('change', (valuesStr, handle, values) => {
      console.log(valuesStr);
      //debugger;
    });
  }

  render() {
    return <div id="slider" className="slider"></div>
  }
}

export default Slider;
