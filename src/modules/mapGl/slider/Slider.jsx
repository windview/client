// map/slider/Slider.jsx

import React from 'react';
import '../../../../node_modules/nouislider/distribute/nouislider.css';
import noUiSlider from 'nouislider';
import './Slider.scss';
import { mapStateToProps } from './selectors.js';
import { connect } from 'react-redux';
import moment from 'moment';

const getSliderDisplayFromValue = (rawValue) => {
  return moment.utc(rawValue).format('HH:mm M/D');
}

const getSliderValueFromDisplay = (displayValue) => {
  return moment.utc(displayValue, 'HH:mm M/D').valueOf();
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
    const sliderObj = this.sliderEl.noUiSlider,
          currentVal = sliderObj.get(),
          timestamp = getSliderValueFromDisplay(currentVal),
          interval = 1000*60*15;
    let   newVal = '';

    switch(direction) {
      case 'forwards':
        newVal = getSliderDisplayFromValue(timestamp+interval);        
        break;
      case 'backwards':
        newVal = getSliderDisplayFromValue(timestamp-interval);
        break;
      default:
        console.log("Called moveSlider with no direction");
    }

    sliderObj.set(newVal);
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
          stepInterval = (1000*60*interval),
          pipInterval = 1000*60*60*3;

    this.sliderEl = sliderEl;
    
    noUiSlider.create(sliderEl, {
      start: [getSliderDisplayFromValue(startTime)],
      connect: [true, false],
      tooltips: [true],
      step: stepInterval,
      range: {
        min: startTime.getTime(),
        max: endTime.getTime()
      },
      format: {
        to: function(value) {
          return getSliderDisplayFromValue(value);
        },
        from: function(value) {
          return getSliderValueFromDisplay(value);
        }
      },
      pips: {
        mode: 'steps',
        filter: function(val) {
          let t = val - startTime.getTime();
          return t % pipInterval === 0 ? 1:0
        },
        format: {
          to: function(value) {
            return getSliderDisplayFromValue(value);
          },
          from: function(value) {
            return getSliderValueFromDisplay(value);
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
