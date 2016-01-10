/**
 * DESCRIPTION
 *
 * @prop {type} PROP - PROP_DESCRIPTION
 */

// Libraries
import d3 from 'd3';

// Components
import LineChart from 'line_chart';

class FinancesNetIncomeChart extends React.Component {
  constructor(props) {
    super(props);
  }

  _getChartOptions(data) {
    console.log('[finances_net_income_chart] data: ', data);
    let tickValues = [];
    if (data && !_.isEmpty(data)) {
      tickValues = _.map(data[0].values, (valueObj, idx) => {
        return new Date(valueObj.date);
      });
    };

    return {
      chart: {
        height: 500,
        showLegend: false,
        useInteractiveGuideline: true
      },
      xAxis: {
        tickValues: tickValues,
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
    console.log('[finances_net_income_chart] this.props: ', this.props);
    if (this.props.loading) {
      return (
        <div className='finances-net-income-chart'>{'Loading'}</div>
      );
    };

    return (
      <div className='finances-net-income-chart'>
        <LineChart
          selector={'finances-net-income'}
          data={this.props.data}
          {...this._getChartOptions(this.props.data)}
        />
      </div>
    );
  }
}

FinancesNetIncomeChart.displayName = 'FinancesNetIncomeChart';

FinancesNetIncomeChart.propTypes = {
  data: React.PropTypes.array,
  error: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
  loading: React.PropTypes.bool
};

module.exports = FinancesNetIncomeChart;
