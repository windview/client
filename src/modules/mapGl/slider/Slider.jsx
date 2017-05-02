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

  componentWillReceiveProps(nextProps) {
    if(this.props.windFarmData == null && nextProps.windFarmData !== null) {
      this.renderSlider(nextProps.windFarmData);
    }
  }

  // The latest timestamp in all the data for all the farms
  getDataEnd(data, interval) {
    let ts = 0;
    data.features.forEach(function(feature){
      feature.properties.forecastData.data.forEach(function(row) {
        ts = row.timestamp.getTime() > ts ? row.timestamp.getTime() : ts;
      });
    });
    
    let dataEnd = new Date(ts),
        minute = dataEnd.getMinutes(),
        remainder = minute >= interval ? minute%interval : interval-minute;
    dataEnd.setMinutes(minute+=remainder);
    dataEnd.setSeconds(0);
    return dataEnd;
  }

  // The earliest timestamp in all the data for all the farms
  getDataStart(data, interval) {
    let ts = new Date().getTime() + (1000*60*60*24*365); //1 year in the future
    data.features.forEach(function(feature){
      feature.properties.forecastData.data.forEach(function(row) {
        ts = row.timestamp.getTime() < ts ? row.timestamp.getTime() : ts;
      });
    });

    let dataStart = new Date(ts),
        minute = dataStart.getMinutes(),
        remainder = minute >= interval ? minute%interval : minute;
    dataStart.setMinutes(minute-=remainder);
    dataStart.setSeconds(0);
    return dataStart;
  }

  moveSlider(direction) {
    const sliderObj = this.sliderEl.noUiSlider;
    const currentVal = sliderObj.get();
    let timestamp = getSliderValueFromDisplay(currentVal);
    const interval = 1000*60*15;
    switch(direction) {
      case 'forwards':
        sliderObj.set(getSliderDisplayFromValue(timestamp+interval));
        break;
      case 'backwards':
        sliderObj.set(getSliderDisplayFromValue(timestamp-interval));
        break;
      default:
        console.log("Called moveSlider with no direction");
    }
  }

  render() {
    return (
      <div className="slider-container">
        <a href="#" onClick={(e) => {e.preventDefault(); this.moveSlider.bind(this)('backwards');}}><i className="fa fa-play fa-rotate-180 fa-1x backwards" /></a>
        <div id="slider" className="slider" />
        <a href="#" onClick={(e) => {e.preventDefault(); this.moveSlider.bind(this)('forwards');}}><i className="fa fa-play fa-1x forwards" /></a>
      </div>
    )
  }

  renderSlider(windFarmData) {
    const sliderEl = document.getElementById('slider'),
          interval = 15,
          startTime = this.getDataStart(windFarmData, interval),
          endTime = this.getDataEnd(windFarmData, interval),
          intervalMs = (1000*60*interval),
          oneHour = 1000*60*60,
          pipVals = [];

    this.sliderEl = sliderEl;
    let start = startTime.getTime();
    [2,3,4,5].forEach(function(i){
      pipVals.push(start+oneHour*i);
    });

    noUiSlider.create(sliderEl, {
      start: [getSliderDisplayFromValue(startTime)],
      connect: [true, false],
      tooltips: [true],
      step: (1000*60*15), // 5 minute intervals
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

    sliderEl.noUiSlider.on('update', (valuesStr, handle, values) => {
      this.props.onChange(values[0]);
    });
  }
}

export default connect(mapStateToProps, null)(Slider);
