// map/slider/Slider.jsx

import React from 'react';
import '../../../../node_modules/nouislider/distribute/nouislider.css';
import noUiSlider from 'nouislider';
import './Slider.scss';
import { mapStateToProps } from './selectors.js';
import { connect } from 'react-redux';
import moment from 'moment';

const getSliderDisplayFromValue = (rawValue) => {
  return moment.utc(rawValue).format('H:mm M/D');
}

const getSliderValueFromDisplay = (displayValue) => {
  return moment.utc(displayValue, 'H:mm M/D').valueOf();
}

export class Slider extends React.Component {

  animateSlider() {
    let animateMarker = (timestamp) => {
      setTimeout(() => {
        if(this.animate) {
          requestAnimationFrame(animateMarker);
          this.moveSlider(this.animationDirection);
        }
      }, (1000/this.props.framesPerSecond));
    };
    // Start the animation.
    animateMarker.bind(this)(0);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.windFarms == null && nextProps.windFarms !== null) {
      this.renderSlider(nextProps.windFarms);
      // Hacky for demo May 5 2017
      this.sliderEl.noUiSlider.set(getSliderDisplayFromValue(window.fakeNow));
      // End hack
    }
  }

  constructor(props) {
    super(props);
    this.toggleAnimation = this.toggleAnimation.bind(this);
    this.moveSlider = this.moveSlider.bind(this);
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
          interval = 1000*60*15,
          startTs = sliderObj.options.range.min,
          endTs = sliderObj.options.range.max;
    let   newVal = '';

    switch(direction) {
      case 'forwards':
        // wrap to beginning if going past end
        newVal = timestamp+interval <= endTs ? timestamp+interval : startTs;
        newVal = getSliderDisplayFromValue(newVal);
        break;
      case 'backwards':
        // wrap to end if going before begin
        newVal = timestamp-interval >= startTs ? timestamp-interval : endTs;
        newVal = getSliderDisplayFromValue(newVal);
        break;
      default:
        console.log("Called moveSlider with no direction");
    }

    sliderObj.set(newVal);
  }

  render() {
    return (
      <div className="slider-container">
        <div id="slider" className="slider" />
        <div className="slider-control">
          <a href="#" onClick={(e) => {e.preventDefault(); this.moveSlider('backwards');}}><i className="fa fa-step-forward fa-rotate-180 fa-1x backwards" /></a>
          <a href="#" onClick={(e) => {e.preventDefault(); this.toggleAnimation('backwards');}}><i className={ (this.animationDirection === "backwards" ? "fa-pause" : "fa-play") + " fa fa-rotate-180 fa-1x backwards"} /></a>
          <a href="#" onClick={(e) => {e.preventDefault(); this.toggleAnimation('forwards');}}><i className={ (this.animationDirection === "forwards" ? "fa-pause" : "fa-play") + " fa fa-1x forwards"} /></a>
          <a href="#" onClick={(e) => {e.preventDefault(); this.moveSlider('forwards');}}><i className="fa fa-step-forward fa-1x forwards" /></a>
        </div>
      </div>
    )
  }

  renderSlider(windFarms) {
    const sliderEl = document.getElementById('slider'),
          interval = this.props.interval,
          startTime = this.getDataStart(windFarms, interval),
          endTime = this.getDataEnd(windFarms, interval),
          stepInterval = (1000*60*interval);

    this.sliderEl = sliderEl;
    if(sliderEl.noUiSlider) {
      sliderEl.noUiSlider.destroy();
    }

    noUiSlider.create(sliderEl, {
      animate: true,
      animationDuration: (1000/this.props.framesPerSecond),
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
        mode: 'positions',
        values: [4, 12, 22, 32, 42, 52, 62, 72, 82, 92],
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

  toggleAnimation(direction) {
    if(this.animate) {
      if(this.animationDirection === direction) {
        this.animate = false; //stop the current animation
        this.animationDirection = 'none';
        // trigger the element styles to update
        this.forceUpdate();
      } else {
        this.animationDirection = direction; // switch direction
      }
    } else {
      this.animate = true;
      this.animationDirection = direction;
      this.animateSlider(direction);
    }
  }
}

Slider.defaultProps = {
  interval: 15,
  framesPerSecond: 2
};

export default connect(mapStateToProps, null)(Slider);
