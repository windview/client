// map/slider/Slider.jsx

import React from 'react';
import '../../../../node_modules/nouislider/distribute/nouislider.css';
import noUiSlider from 'nouislider';
import './Slider.scss';

// The current time rounded down to the closest 5 minute
// interval in the past
const getStartTime = () => {
  let startTime = new Date();
  return startTime;
}

const padTime = (num) => {
  num = "" + num;
  return "00".substring(num.length) + num;
}

const getSliderDisplayFromValue = (rawValue) => {
  let d = new Date(rawValue);
  return padTime(d.getHours()) + ":" + padTime(d.getMinutes());
}

const getSliderValueFromDisplay = (displayValue, startTime) => {
  let t = displayValue.split(':');
  let d = new Date(startTime.getTime());
  d.setHours(Number(t[0]));
  d.setMinutes(Number(t[1]));
  return d.getTime();
}

export class Slider extends React.Component {
  componentDidMount() {
    const startTime = getStartTime();
    const sliderEl = document.getElementById('slider');
    noUiSlider.create(sliderEl, {
      start: [startTime.getHours() + ":" + startTime.getMinutes()],
      connect: [true, false],
      tooltips: [true],
      step: (1000*60*5), // 5 minute intervals
      range: {
        min: startTime.getTime(),
        max: (startTime.getTime()+(1000*60*60*6)) // 6 hours
      },
      format: {
        to: function(value) {
          return getSliderDisplayFromValue(value);
        },
        from: function(value) {
          return getSliderValueFromDisplay(value, startTime);
        }
      },
    });

    sliderEl.noUiSlider.on('change', (valuesStr, handle, values) => {
      console.log(valuesStr[0], values[0]);
      //debugger;
    });
  }

  render() {
    return <div id="slider" className="slider"></div>
  }
}

export default Slider;
