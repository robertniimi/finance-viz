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
import NetIncomeChart from './finances_net_income_chart';
import NetAssetsChart from './finances_net_assets_chart';
import AccountsTable from './finances_accounts_table';

// Constants
import DateRanges from 'date_ranges';

const DATE_OPTIONS = _.map(DateRanges, (range) => {
  return {
    label: range.label,
    value: range.value,
  };
});

class Finances extends React.Component {
  constructor(props) {
    super(props);
  }

  _onChangeDate(dateValue) {
    this.props.onChangeDateRange(dateValue);
  }

  // _handleRefreshData() {

  // }

  render() {
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
          <AccountsTable accounts={this.props.accounts} />
          <Select
            className='finances-date-range-select'
            name='finances-date-range-select'
            options={DATE_OPTIONS}
            onChange={this._onChangeDate.bind(this)}
            value={this.props.dateRange.value}
          />
          <NetIncomeChart {...this.props.netIncomeChart} />
          <StackedAreaChart {...this.props.stackedAreaChart} />
          <NetAssetsChart {...this.props.netAssetsChart} />
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
  accounts: React.PropTypes.array,
  categories: React.PropTypes.array,
  dateRange: React.PropTypes.shape({
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    start: React.PropTypes.object,
    end: React.PropTypes.object,
  }),
  netIncomeChart: React.PropTypes.object,
  netAssetsChart: React.PropTypes.object,
  onChangeDateRange: React.PropTypes.func,
  onChangeTableFilter: React.PropTypes.func,
  onChangeTransactionCategory: React.PropTypes.func,
  stackedAreaChart: React.PropTypes.object,
  transactions: React.PropTypes.object,
  bankAssets: React.PropTypes.array,
};

module.exports = Finances;
