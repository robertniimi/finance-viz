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
import numeral from 'numeral';

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
      dateRange: '1 Year',
      uncategorized: []
    };
  }

  // fetch transactions and set as new date
  _renderFinances() {
    let query = querystring.stringify({
      end: (new Date()).toISOString(),
      start: DATE_RANGES[this.state.dateRange]
    });

    // console.log('[finances] query: ', query);
    request.get(`/mint/chart/transactions?${ query }`)
      .then((transactions) => {
        let options = {
          showLegend: false,
          useInteractiveGuideline: true
        };

        console.log('[finances] @mint/chart/transactions -> transactions: ', transactions);
        renderStackedAreaChart('#finances', transactions, options);
      })
      .catch((e) => {
        throw new Error('[finances] @_renderFinances -> e:', e);
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
    // request.get('/mint/getJsonData')
    //   .then((jsonData) => {
    //     console.log('[finances] jsonData: ', jsonData);
    //   });

    request.get(`/mint/categories`)
      .then((categories) => {
        console.log('[finances] @mint/categories -> categories: ', categories);
      });


    let transactionQuery = {
      query: 'category: Uncategorized'
    };

    console.log('[finances] transactionQuery: ', transactionQuery);
    console.log('[finances] querystring.stringify(transactionQuery): ', querystring.stringify(transactionQuery));
    request.get(`/mint/transactions?${ querystring.stringify(transactionQuery) }`)
      .then((transactions) => {
        console.log('[finances] @mint/transactions -> transactions: ', transactions);
        this.setState({
          uncategorized: transactions.set[0].data
        });
      });


    let listTransactionQuery = {
      query: 'category: Uncategorized'
    };

    request.get(`/mint/listTransaction?${ querystring.stringify(listTransactionQuery) }`)
      .then((transactions) => {
        console.log('[finances] @mint/listTransaction -> transactions: ', transactions);
      });
  }

  componentDidUpdate() {
    // $('#finances').empty();
    $('.nvtooltip').remove();
    this._renderFinances();
  }

  render() {
    // console.log('[finances] this.state: ', this.state);
    console.log('[finances] this.props: ', this.props);
    let { uncategorized } = this.state;
    let dateOptions = this._getDateOptions();


    let uncategorizedRows = _.map(uncategorized, (transaction) => {
      return (
        <tr key={`${transaction.id}`}>
          <td>{ transaction.date }</td>
          <td>{ transaction.omerchant }</td>
          <td>{ numeral(transaction.amount).format('$0,0.00') }</td>
          <td>{ transaction.category }</td>
        </tr>
      );
    });

    let uncatTransTable = (
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Date</th>
            <th>Merchant</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {uncategorizedRows}
        </tbody>
      </table>
    );

    return (
      <div className='finances-component'>
        <header className='header'>
          <div className='header-content'>
            <h1>{'Finances'}</h1>
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
        <div className='content-wrapper'>
          {uncatTransTable}
        </div>
      </div>
    );
  }
}

Finances.displayName = 'Finances';

module.exports = Finances;
