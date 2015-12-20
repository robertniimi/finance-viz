/**
 * DESCRIPTION
 *
 * @prop {type} PROP - PROP_DESCRIPTION
 */

// Libraries
import d3 from 'd3';

// Components
import StackedAreaChart from 'stacked_area_chart';

class FinancesStackedAreaChart extends React.Component {
  constructor(props) {
    super(props);
  }

  _getChartOptions() {
    return {
      chart: {
        height: 500,
        showLegend: false,
        useInteractiveGuideline: true
      },
      xAxis: {
        tickFormat: function(d) {
          return d3.time.format('%b %Y')(new Date(d));
        }
      },
      yAxis: {
        tickFormat: function(d) {
          return ('$' + d3.format(',.0f')(d));
        }
      }
    }
  }

  render() {
    console.log('[finances_stacked_area_chart] this.props: ', this.props);
    if (this.props.loading) {
      return (
        <div className='finances-stacked-area-chart'>{'Loading'}</div>
      );
    };

    return (
      <div className='finances-stacked-area-chart'>
        <StackedAreaChart
          selector={'finances-stacked'}
          data={this.props.data}
          {...this._getChartOptions()}
        />
      </div>
    );
  }
}

FinancesStackedAreaChart.displayName = 'FinancesStackedAreaChart';

FinancesStackedAreaChart.propTypes = {
  data: React.PropTypes.array,
  error: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
  loading: React.PropTypes.bool
};

module.exports = FinancesStackedAreaChart;
