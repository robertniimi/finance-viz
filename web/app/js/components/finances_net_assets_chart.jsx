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

  _formatData(data) {
    return _.map(data, (accountObj, key) => {
      console.log('[finances_net_assets_chart] accountObj: ', accountObj);
      return {
        key,
        values: _.map(accountObj.data, (dataObj, idx) => {
          return _.assign({}, dataObj, {
            x: moment(new Date(dataObj.date)).startOf('month').toISOString(),
            y: dataObj.value
          });
        })
      }
    });
  }

  _getChartOptions(data) {
    let tickValues = [];
    if (data && !_.isEmpty(data)) {
      tickValues = _.map(data[0].values, (valueObj, idx) => {
        return new Date(valueObj.x);
      });
    };

    console.log('[finances_net_assets_chart] tickValues: ', tickValues);

    return {
      chart: {
        height: 500,
        showLegend: false,
        useInteractiveGuideline: true
      },
      xAxis: {
        tickValues: tickValues,
        tickFormat: function(d) {
          return d3.time.format('%b %y')(new Date(d));
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
    console.log('[finances_net_assets_chart] this.props: ', this.props);
    let formattedData = this._formatData({ bankAssets: this.props.bankAssets });
    console.log('[finances_net_assets_chart] formattedData: ', formattedData);

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
          {...this._getChartOptions(formattedData)}
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
