/**
 * DESCRIPTION
 *
 * @prop {object}  - PROP_DESCRIPTION
 */

import { renderStackedArea } from '../utils/chart_utils';
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

class Finances extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateRange: '1 Year'
    };
  }

  // fetch transactions and set as new date
  _renderFinances() {
    let query = querystring.stringify({
      end: (new Date()).toISOString(),
      start: DATE_RANGES[this.state.dateRange]
    });

    // console.log('[finances] query: ', query);

    request.get(`/mint/transactions?${ query }`)
      .then((transactions) => {
        let options = {
          showLegend: false,
          useInteractiveGuideline: true
        };

        console.log('[finances] transactions: ', transactions);

        renderStackedFinances('#finances', transactions, options);
      })
      .catch((e) => {
        throw new Error('[finances] @_renderFinances response: e', e);
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

  _handleRefreshData() {
    request.get('/mint/refreshAccounts');
  }

  componentDidMount() {
    this._renderFinances();
    request.get('/mint/getJsonData')
      .then((jsonData) => {
        console.log('[finances] jsonData: ', jsonData);
      });
  }

  componentDidUpdate() {
    // $('#finances').empty();
    $('.nvtooltip').remove();
    this._renderFinances();
  }

  render() {
    // console.log('[finances] this.state: ', this.state);
    let dateOptions = this._getDateOptions();

    return (
      <div className='finances-component'>
        <header className='header'>
          <div className='header-content'>
            <h1>Spending</h1>
            <div className='header-actions'>
              <select
                name='finances-date-range-select'
                onChange={ this._onChangeDate.bind(this) }
                value={ this.state.dateRange }
              >
                { dateOptions }
              </select>
            </div>
          </div>
        </header>
        <div className='content-wrapper'>
          <button onClick={ this._handleRefreshData.bind(this) }>{'Update Transactions'}</button>
          <svg id='finances'></svg>
        </div>
      </div>
    );
  }
}

Finances.displayName = 'Finances';

module.exports = Finances;
