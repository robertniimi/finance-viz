/**
 * DESCRIPTION
 *
 * @prop {object}  - PROP_DESCRIPTION
 */

import { renderStackedAreaChart } from '../utils/chart_utils';
import querystring from 'querystring';
import moment from 'moment';
import request from 'ajax_utils';
import promise from 'bluebird';

const DATE_RANGES = {
  'All Time': null,
  '3 Months': moment().subtract(3, 'months').toISOString(),
  '6 Months': moment().subtract(6, 'months').toISOString(),
  '1 Year': moment().subtract(1, 'year').toISOString(),
  '2 Year': moment().subtract(2, 'years').toISOString()
};

class AreaChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateRange: '1 Year'
    };
  }

  // fetch transactions and set as new date
  _renderAreaChart() {
    let query = querystring.stringify({
      end: (new Date()).toISOString(),
      start: DATE_RANGES[this.state.dateRange]
    });

    // console.log('[area_chart] query: ', query);

    request.get(`/transactions?${ query }`)
      .then((transactions) => {
        let options = {
          showLegend: false,
          useInteractiveGuideline: true
        };

        console.log('[area_chart] transactions: ', transactions);

        renderStackedAreaChart('#area-chart', transactions, options);
      })
      .catch((e) => {
        throw new Error('[area_chart] @_renderAreaChart response: e', e);
      });
  }

  _onChangeDate(e) {
    e.preventDefault();
    let value = e.target.value;
    this.setState({ dateRange: value });
  }

  _getDateOptions() {
    return _.map(DATE_RANGES, (date, key) => {
      return (
        <option value={ key } key={ key }>{ key }</option>
      );
    });
  }

  componentDidMount() {
    this._renderAreaChart();
  }

  componentDidUpdate() {
    $('#area-chart').empty();
    this._renderAreaChart();
  }

  render() {
    // console.log('[area_chart] this.state: ', this.state);
    let dateOptions = this._getDateOptions();

    return (
      <div className='area-chart-component'>
        <select
          name='area-chart-date-range-select'
          onChange={ this._onChangeDate.bind(this) }
          value={ this.state.dateRange }
        >
          { dateOptions }
        </select>
        <svg id='area-chart'></svg>
      </div>
    );
  }
}

AreaChart.displayName = 'AreaChart';

module.exports = AreaChart;
