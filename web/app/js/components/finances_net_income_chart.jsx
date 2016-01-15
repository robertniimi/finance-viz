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

  _formatData(data, tickValues) {
    console.log('[finances_net_income_chart] data: ', data);
    let seriesIndex = 0;
    let incomeData = [];
    let expenseData = [];

    let dataObj = _.reduce(data, (result, [incomeObj, expenseObj], idx) => {
      result.incomeData.push({
        x: incomeObj.startDate,
        y: incomeObj.value
      });
      result.expenseData.push({
        x: expenseObj.startDate,
        y: expenseObj.value
      });
      result.netIncomeData.push({
        x: incomeObj.startDate,
        y: incomeObj.value + expenseObj.value
      });
      if (this.props.goal) {
        result.netIncomeGoal.push({
          x: incomeObj.startDate,
          y: this.props.goal
        })
      };
      return result;
    }, {
      incomeData: [],
      expenseData: [],
      netIncomeData: [],
      netIncomeGoal: []
    });

    let returnData = [{
      key: 'Income',
      seriesIndex: 0,
      values: dataObj.incomeData
    }, {
      key: 'Expenses',
      seriesIndex: 1,
      values: dataObj.expenseData
    },{
      key: 'Net Income',
      seriesIndex: 2,
      area: true,
      values: dataObj.netIncomeData
    }];

    if (this.props.goal) {
      returnData.push({
        key: 'Goal',
        seriesIndex: returnData.length,
        values: dataObj.netIncomeGoal
      });
    };

    return returnData;
  }

  _getChartOptions(data) {
    let tickValues = [];
    if (data && !_.isEmpty(data)) {
      tickValues = _.map(data[0].values, (valueObj, idx) => {
        console.log('[finances_net_income_chart] new Date(valueObj.x): ', new Date(valueObj.x));
        return valueObj.x;
      });
    };

    return {
      chart: {
        color: ['#008000', '#FF0000', '#0000FF', '#FFA500'],
        height: 400,
        showLegend: false,
        useInteractiveGuideline: true
      },
      xAxis: {
        tickValues,
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
    // console.log('[finances_net_income_chart] this.props: ', this.props);

    let formattedData = this._formatData(this.props.data);
    console.log('[finances_net_income_chart] formattedData: ', formattedData);
    let wrapperClass = 'finances-net-income-chart';

    return (
      <div className='finances-net-income-chart'>
        <LineChart
          selector={'finances-net-income'}
          data={formattedData}
          {...this._getChartOptions(formattedData)}
        />
      </div>
    );
  }
}

FinancesNetIncomeChart.displayName = 'FinancesNetIncomeChart';

FinancesNetIncomeChart.propTypes = {
  goal: React.PropTypes.number,
  data: React.PropTypes.array,
  error: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
  loading: React.PropTypes.bool
};

module.exports = FinancesNetIncomeChart;
