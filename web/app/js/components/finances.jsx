/**
 * DESCRIPTION
 *
 * @prop {object}  - PROP_DESCRIPTION
 */

// Libraries
import moment from 'moment';
import classnames from 'classnames';

// Components
import Select from 'react-select';
import TransactionsTable from './finances_transactions_table';
import StackedAreaChart from './finances_stacked_area_chart';
import NetIncomChart from './finances_net_income_chart';

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
  }

  _onChangeDate(dateValue) {
    this.props.onChangeDateRange(dateValue);
  }

  _getDateOptions() {
    return _.map(DATE_RANGES, (date, key) => {
      return {
        label: key,
        value: key
      };
    });
  }

  _handleRefreshData() {
    console.log('[finances] TODO: REFRESH DATA');
  }

  render() {
    console.log('[finances] this.props: ', this.props);
    let dateOptions = this._getDateOptions();

    return (
      <div className='finances-component'>
        <header className='header'>
          <div className='header-content'>
            <h2>{'Finances'}</h2>
            <div className='header-actions'>
              <Select
                name='finances-date-range-select'
                options={dateOptions}
                onChange={this._onChangeDate.bind(this)}
                value={this.props.selectedDateRange}
              />
            </div>
          </div>
        </header>
        <div className='content-wrapper'>
          <button
            className={classnames('btn', 'waves-effect', 'waves-light')}
            onClick={this._handleRefreshData.bind(this)}
          >
            {'Update Transactions'}
          </button>
          <StackedAreaChart {...this.props.stackedAreaChart} />
          <TransactionsTable
            categories={this.props.categories}
            onChangeTableFilter={this.props.onChangeTableFilter}
            onChangeTransactionCategory={this.props.onChangeTransactionCategory}
            {...this.props.transactions}
          />
        </div>
      </div>
    );
  }
}

Finances.displayName = 'Finances';

Finances.propTypes = {
  categories: React.PropTypes.array,
  onChangeDateRange: React.PropTypes.func,
  onChangeTableFilter: React.PropTypes.func,
  onChangeTransactionCategory: React.PropTypes.func,
  stackedAreaChart: React.PropTypes.object,
  transactions: React.PropTypes.object
};

module.exports = Finances;
