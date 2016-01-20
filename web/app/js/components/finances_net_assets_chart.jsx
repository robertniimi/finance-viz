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

  _findDataPoint(data, tickValue) {
    return _.find(data, (dataObj) => dataObj.startDate === tickValue);
  }

  _formatData(data, tickValues) {
    let { bankAssets, investmentAssets, debts } = data;

    return [{
      key: 'Cash',
      seriesIndex: 0,
      values: _.map(tickValues, (tickValue, idx) => {
        let bankAssetsDataPoint = this._findDataPoint(bankAssets.data, tickValue);
        let debtsDataPoint = this._findDataPoint(debts.data, tickValue);
        let x = tickValue;
        let y = 0;

        if (bankAssetsDataPoint && debtsDataPoint) {
          y = bankAssetsDataPoint.value - debtsDataPoint.value;
        } else if (bankAssetsDataPoint) {
          y = bankAssetsDataPoint.value;
        } else if (debtsDataPoint) {
          y = -debtsDataPoint.value;
        }

        return { x, y };
      })
    }, {
      key: 'Investments',
      seriesIndex: 1,
      values: _.map(tickValues, (tickValue, idx) => {
        let dataPoint = this._findDataPoint(investmentAssets.data, tickValue);
        let x = tickValue;
        let y = (dataPoint && dataPoint.value) ? dataPoint.value : 0;

        return { x, y };
      })
    }];
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
    const { bankAssets, investmentAssets, debts } = this.props;
    let tickValues = this._getTickValues(bankAssets.data.concat(investmentAssets.data));
    let formattedData = this._formatData({ bankAssets, investmentAssets, debts }, tickValues);
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
