// map/slider/Slider.jsx

import React from 'react';
import '../../../../node_modules/nouislider/distribute/nouislider.css';
import noUiSlider from 'nouislider';
import './Slider.scss';

// The current time rounded down to the closest 5 minute
// interval in the past
const getStartTime = () => {
  let startTime = new Date();
  let minute = startTime.getMinutes();
  let remainder = minute%5;
  minute -= remainder;
  startTime.setMinutes(minute);
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
    let pipVals = [];
    let oneHour = 1000*60*60;
    let start = startTime.getTime();
    [2,3,4,5].forEach(function(i){
      pipVals.push(start+oneHour*i);
    });

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
      pips: {
        mode: 'steps',
        filter: function(val) {
          let t = val - startTime.getTime();
          let oneHour = 1000*60*30;
          return t%oneHour === 0 ? 1:0
        },
        format: {
          to: function(value) {
            return getSliderDisplayFromValue(value);
          },
          from: function(value) {
            return getSliderValueFromDisplay(value, startTime);
          }
        },
      },
    });

    sliderEl.noUiSlider.on('change', (valuesStr, handle, values) => {
      //console.log(valuesStr[0], values[0]);
      //debugger;
    });
  }

  render() {
    return (
      <div className="slider-container">
        <div id="slider" className="slider" />
      </div>
    )
  }
}

export default Slider;
