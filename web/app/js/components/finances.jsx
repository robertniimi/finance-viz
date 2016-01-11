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

// Constants
import DateRanges from 'date_ranges';

const DATE_OPTIONS = _.map(DateRanges, (range) => {
  return {
    label: range.label,
    value: range.value
  };
});

class Finances extends React.Component {
  constructor(props) {
    super(props);
  }

  _onChangeDate(dateValue) {
    this.props.onChangeDateRange(dateValue);
  }

  _handleRefreshData() {
    console.log('[finances] TODO: REFRESH DATA');
  }

  render() {
    console.log('[finances] this.props: ', this.props);

    return (
      <div className='finances-component'>
        <header className='header'>
          <div className='header-content'>
            <h2>{'Finances'}</h2>
            <div className='header-actions'>
            </div>
          </div>
        </header>
        <div className='content-wrapper'>
          <Select
            className='finances-date-range-select'
            name='finances-date-range-select'
            options={DATE_OPTIONS}
            onChange={this._onChangeDate.bind(this)}
            value={this.props.dateRange.value}
          />
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
