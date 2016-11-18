// map/slider/Slider.jsx

import React from 'react';
import '../../../../node_modules/nouislider/distribute/nouislider.css';
import noUiSlider from 'nouislider';
import './Slider.scss';
import { mapStateToProps } from './selectors.js';
import { connect } from 'react-redux';
import moment from 'moment';

const getSliderDisplayFromValue = (rawValue) => {
  return moment(rawValue).format('HH:mm');
}

const getSliderValueFromDisplay = (displayValue) => {
  return moment(displayValue, 'HH:mm').valueOf();
}

export class Slider extends React.Component {
  componentDidMount() {
    const startTime = new Date(this.props.selectedTimestamp);
    this.sliderEl = document.getElementById('slider');
    let pipVals = [];
    let oneHour = 1000*60*60;
    let start = startTime.getTime();
    [2,3,4,5].forEach(function(i){
      pipVals.push(start+oneHour*i);
    });

    noUiSlider.create(this.sliderEl, {
      start: [getSliderDisplayFromValue(startTime)],
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
          return t % oneHour === 0 ? 1:0
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

    this.sliderEl.noUiSlider.on('update', (valuesStr, handle, values) => {
      this.props.onChange(values[0]);
    });
  }

  moveSlider(direction) {
    const sliderObj = this.sliderEl.noUiSlider;
    const currentVal = sliderObj.get();
    let timestamp = getSliderValueFromDisplay(currentVal);
    const fiveMinutes = 1000*60*5;
    switch(direction) {
      case 'forwards':
        sliderObj.set(getSliderDisplayFromValue(timestamp+fiveMinutes));
        break;
      case 'backwards':
        sliderObj.set(getSliderDisplayFromValue(timestamp-fiveMinutes));
        break;
      default:
        console.log("Called moveSlider with no direction");
    }
  }

  render() {
    return (
      <div className="slider-container">
        <a href="#" onClick={(e) => {e.preventDefault(); this.moveSlider.bind(this)('backwards');}}><i className="fa fa-play fa-rotate-180 fa-2x backwards" /></a>
        <div id="slider" className="slider" />
        <a href="#" onClick={(e) => {e.preventDefault(); this.moveSlider.bind(this)('forwards');}}><i className="fa fa-play fa-2x forwards" /></a>
      </div>
    )
  }
}

export default connect(mapStateToProps, null)(Slider);
