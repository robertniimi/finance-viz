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

  _formatData(data) {
    if (!data || _.isEmpty(data)) {
      return;
    }

    return _.map(data, (dataObj, idx) => {
      return _.assign({}, dataObj, {
        values: _.map(dataObj.values, (valueObj, idx) => {
          return _.assign({}, valueObj, {
            x: valueObj.date,
            y: valueObj.amount
          });
        })
      });
    });
  }

  _getChartOptions(data) {
    let tickValues = [];
    if (data && !_.isEmpty(data)) {
      tickValues = _.map(data[0].values, (valueObj, idx) => {
        return new Date(valueObj.x);
      });
    };

    return {
      chart: {
        height: 300,
        showLegend: false,
        useInteractiveGuideline: true
      },
      xAxis: {
        tickValues: tickValues,
        tickFormat: function(d) {
          return d3.time.format('%b \'%y')(new Date(d));
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
    // console.log('[finances_stacked_area_chart] this.props: ', this.props);
    if (this.props.loading) {
      return (
        <div className='finances-stacked-area-chart'>{'Loading'}</div>
      );
    };

    let formattedData = this._formatData(this.props.data);
    console.log('[finances_stacked_area_chart] formattedData: ', formattedData);

    return (
      <div className='finances-stacked-area-chart'>
        <StackedAreaChart
          selector={'finances-stacked'}
          data={formattedData}
          {...this._getChartOptions(formattedData)}
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
