/**
 * DESCRIPTION
 *
 * @prop {type} PROP - PROP_DESCRIPTION
 */

// Libraries
import nv from 'nvd3';
import d3 from 'd3';
import classnames from 'classnames';

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.chart = nv.models.lineChart();
  }

  _addOptions(object, options) {
    if (!object || !options || _.isEmpty(options)) {
      return;
    }
    _.forEach(options, (optionValue, optionKey) => {
      object[optionKey](optionValue);
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextProps, this.props);
  }

  _updateChart() {
    nv.addGraph({
      generate: () => {
        this.chart
          .x(function(d) { return new Date(d.x); })
          .y(function(d) { return d.y; });

        let interpolation = d3.svg.line()
          .interpolate('cardinal')
          .tension(0.875);

        this.chart.interpolate(function(points) {
          return interpolation(points).substring(1);
        });

        // console.log('[stacked_area_chart] this.props.chart: ', this.props.chart);
        this._addOptions(this.chart, this.props.chart);
        this._addOptions(this.chart.xAxis, this.props.xAxis);
        this._addOptions(this.chart.yAxis, this.props.yAxis);

        let chartEl = d3.select(`#${this.props.selector}`);
        chartEl
          .datum(this.props.data)
          .call(this.chart);

        if (this.props.chart.width) {
          let {width} = this.props.chart;
          chartEl.style({width});
        }

        if (this.props.chart.height) {
          let {height} = this.props.chart;
          chartEl.style({height});
        }

        nv.utils.windowResize(this.chart.update);
        return this.chart;
      },
      callback: () => {

      },
    });
  }

  componentWillUpdate() {
    this._updateChart();
  }

  componentDidMount() {
    this._updateChart();
  }

  render() {
    if (this.props.loading) {
      return (
        <div>{'Loading'}</div>
      );
    }

    if (!this.props.data || _.isEmpty(this.props.data)) {
      return (
        <div className={classnames(this.props.selector, 'no-data')}>{'No Data'}</div>
      );
    }

    return (
      <svg id={this.props.selector}></svg>
    );
  }
}

LineChart.displayName = 'LineChart';

LineChart.propTypes = {
  chart: React.PropTypes.object,
  loading: React.PropTypes.bool,
  data: React.PropTypes.array,
  selector: React.PropTypes.string,
  xAxis: React.PropTypes.object,
  yAxis: React.PropTypes.object,
};

module.exports = LineChart;
