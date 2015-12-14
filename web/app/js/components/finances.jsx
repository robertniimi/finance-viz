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
import classnames from 'classnames';
import urlencode from 'urlencode';

// Components
import Select from 'react-select';

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
    if (_.isEmpty(this.props.stackedAreaChart.data)) {
      return;
    }

    let options = {
      showLegend: false,
      useInteractiveGuideline: true
    };
    renderStackedAreaChart('#finances', this.props.stackedAreaChart.data, options);
  }

  _onChangeDate(e) {
    e.preventDefault();
    let value = e.target.value;
    this.props.onChangeDateRange(value);
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

    let transactionQuery = {
      query: 'category: Uncategorized'
    };

    // console.log('[finances] transactionQuery: ', transactionQuery);
    // console.log('[finances] querystring.stringify(transactionQuery): ', querystring.stringify(transactionQuery));
    request.get(`/mint/transactions?${ querystring.stringify(transactionQuery) }`)
      .then((transactions) => {
        // console.log('[finances] @mint/transactions -> transactions: ', transactions);
        this.setState({
          uncategorized: transactions.set[0].data
        });
      });


    let listTransactionQuery = {
      query: 'category: Uncategorized'
    };

    request.get(`/mint/listTransaction?${ querystring.stringify(listTransactionQuery) }`)
      .then((transactions) => {
        // console.log('[finances] @mint/listTransaction -> transactions: ', transactions);
      });
  }

  _handleInputChange(txnId) {
    return (selectValue) => {
      console.log('[finances] @_handleInputChange -> selectValue: ', selectValue);
    }
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

    let categoryOptions = _.reduce(this.props.categories, (result, category, idx) => {
      result.push({
        label: category.value,
        value: category.value,
        id: category.id
      });
      // result.push(category.value);
      if (category.children) {
        _.forEach(category.children, (subcategory, idx) => {
          result.push({
            label: `${ category.value } > ${ subcategory.value }`,
            value: subcategory.value,
            id: subcategory.id
          });
        });
      };
      return result;
    }, []);

    console.log('[finances] categoryOptions: ', categoryOptions);
    console.log('[finances] uncategorized: ', uncategorized);
    let uncategorizedRows = _.map(uncategorized, (transaction) => {
      return (
        <tr key={`${transaction.id}`}>
          <td>{ transaction.date }</td>
          <td>
            <a href={`https://www.google.com/#safe=off&q=${ urlencode(transaction.omerchant) }`} target='_blank'>
              { transaction.omerchant }
            </a>
          </td>
          <td>{ numeral(transaction.amount).format('$0,0.00') }</td>
          <td>{ transaction.category }</td>
          <td>
            <Select
              options={ categoryOptions }
              onInputChange={ this._handleInputChange(transaction.id).bind(this) }
              // displayOptions={ (option) => { return option.value } }
            />
          </td>
        </tr>
      );
    });

    // label ->
    // value -> original value
    // id -> id

    let uncatTransTable = (
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Date</th>
            <th>Merchant</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Change Category</th>
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
            <h2>{'Finances'}</h2>
            <div className='header-actions'>
              <select
                name='finances-date-range-select'
                onChange={ this._onChangeDate.bind(this) }
                value={ this.props.selectedDateRange }
              >
                { dateOptions }
              </select>
            </div>
          </div>
        </header>
        <div className='content-wrapper'>
          <button
            className={ classnames('btn', 'waves-effect', 'waves-light') }
            onClick={ this._handleRefreshData.bind(this) }
          >
            {'Update Transactions'}
          </button>
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
