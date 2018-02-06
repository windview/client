import React from 'react';
import '../../../node_modules/nouislider/distribute/nouislider.css';
import noUiSlider from 'nouislider';
import './Slider.scss';
import { mapStateToProps, mapDispatchToProps } from './selectors.js';
import { connect } from 'react-redux';
import moment from 'moment';
import CONFIG from '../../data/config';
import Forecast from '../../data/forecast';

// FIXME this will break the slider if the year of any timestamp is not
// the current year, e.g. any forecast time period that wraps around New
// Years day, or any data from a year in the past
const DATE_FORMAT = 'H:mm M/D';

const getSliderDisplayFromValue = (rawValue) => {
  return moment.utc(rawValue).format(DATE_FORMAT);
}

const getSliderValueFromDisplay = (displayValue) => {
  return moment.utc(displayValue, DATE_FORMAT).valueOf();
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

  componentDidUpdate(prevProps) {
    if(!prevProps.forecastLoaded && this.props.forecastLoaded) {
      this.renderSlider();
      // Hacky for demo May 5 2017
      this.sliderEl.noUiSlider.set(getSliderDisplayFromValue(CONFIG.fakeNow));
      // End hack
    }
  }

  constructor(props) {
    super(props);
    this.toggleAnimation = this.toggleAnimation.bind(this)
    this.moveSlider = this.moveSlider.bind(this)
    this.whenSliderMoved = this.whenSliderMoved.bind(this)
  }

  moveSlider(direction) {
    const sliderObj = this.sliderEl.noUiSlider,
          currentVal = sliderObj.get(),
          timestamp = getSliderValueFromDisplay(currentVal),
          interval = 1000*60*CONFIG.forecastInterval,
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

  renderSlider(forecast) {
    const sliderEl = document.getElementById('slider'),
          interval = CONFIG.forecastInterval,
          startTime = Forecast.getDataStart(),
          endTime = Forecast.getDataEnd(),
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
        // TODO to make this look good and fit the window is relative to the
        // number of timesteps as well as the width of the screen. Should
        // consider writing a dynamic property generator
        mode: 'count',
        values: '13',
        density: '5',
        stepped: true,
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
      this.whenSliderMoved(values[0]);
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

  whenSliderMoved(newTimestamp) {
    this.props.onSelectTimestamp(newTimestamp);
  }
}

Slider.defaultProps = {
  framesPerSecond: 2
};

export default connect(mapStateToProps, mapDispatchToProps)(Slider);
