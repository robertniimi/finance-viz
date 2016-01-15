// Libraries
import d3 from 'd3';
import moment from 'moment';

// Components
import StackedAreaChart from 'stacked_area_chart';

/**
 * DESCRIPTION
 *
 * @prop {type} PROP - PROP_DESCRIPTION
 */

class FinancesNetAssetsChart extends React.Component {
  constructor(props) {
    super(props);
  }

  _formatData(data, tickValues) {
    let { bankAssets, investmentAssets } = data;
    let seriesIndex = 0;
    return _.map(data, (accountObj, key) => {
      let series = {
        key,
        seriesIndex: seriesIndex,
        values: _.map(tickValues, (tickValue, idx) => {
          let dataPoint = _.find(accountObj.data, (dataObj) => {
            return dataObj.startDate === tickValue;
          });

          return {
            x: tickValue,
            y: (dataPoint && dataPoint.value) ? dataPoint.value : 0
          };
        })
      }
      seriesIndex++;
      return series
    });
  }

  _getTickValues(data) {
    let startDates = _.map(data, (dataObj, idx) => {
      return (new Date(dataObj.startDate)).valueOf();
    });

    return _.uniq(startDates).sort();
  }

  _getChartOptions(data, tickValues) {
    return {
      chart: {
        height: 400,
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
    let { bankAssets, investmentAssets } = this.props;
    let tickValues = this._getTickValues(bankAssets.data.concat(investmentAssets.data));
    let formattedData = this._formatData({ bankAssets, investmentAssets }, tickValues);
    let wrapperClass = 'finances-net-assets-chart';

    if (this.props.loading) {
      return (
        <div className={wrapperClass}>{'Loading'}</div>
      );
    };

    return (
      <div className={wrapperClass}>
        <StackedAreaChart
          selector={'finances-net-assets'}
          data={formattedData}
          {...this._getChartOptions(formattedData, tickValues)}
        />
      </div>
    );
  }
}

FinancesNetAssetsChart.displayName = 'FinancesNetAssetsChart';

FinancesNetAssetsChart.propTypes = {
  loading: React.PropTypes.bool,
  data: React.PropTypes.shape({
    bankAssets: React.PropTypes.array
  })
};

module.exports = FinancesNetAssetsChart;
