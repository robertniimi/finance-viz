import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Constants
import ActionTypes from 'action_types';

// Actions
import FinancesActions from 'finances_actions';

// Components
import Finances from '../components/finances';

class FinancesApp extends React.Component {
  constructor() {
    super()
  }

  _fetchTransactions(query) {
    this.props.dispatch(FinancesActions.fetchTransactions({ query }));
  }

  _fetchChartTransactions(dateRange) {
    this.props.dispatch(FinancesActions.fetchChartTransactions(dateRange));
  }

  _fetchNetIncome(dateRange) {
    this.props.dispatch(FinancesActions.fetchNetIncome(dateRange));
  }

  _fetchNetWorth(dateRange) {
    this.props.dispatch(FinancesActions.fetchNetWorth(dateRange));
  }

  _fetchBankAssets(dateRange) {
    this.props.dispatch(FinancesActions.fetchBankAssets(dateRange));
  }

  _fetchCategories() {
    this.props.dispatch(FinancesActions.fetchCategories());
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.finances.dateRange.value !== this.props.finances.dateRange.value) {
      let { dateRange } = nextProps.finances;
      this._fetchChartTransactions(dateRange);
      this._fetchNetIncome(dateRange);
      this._fetchNetWorth(dateRange);
      this._fetchBankAssets(dateRange);
    };

    if (nextProps.finances.transactions.query !== this.props.finances.transactions.query) {
      let { query } = nextProps.finances.transactions;
      this._fetchTransactions(query);
    };
  }

  componentDidMount() {
    let { finances: { transactions, dateRange } } = this.props;
    this._fetchCategories();
    this._fetchNetIncome(dateRange);
    this._fetchNetWorth(dateRange);
    this._fetchBankAssets(dateRange);
    this._fetchChartTransactions(dateRange);
    this._fetchTransactions(transactions.query);
  }

  render() {
    console.log('[finances_container] this.props: ', this.props);

    let {
      dispatch,
      finances
    } = this.props;

    let { changeTableFilter, changeDateRange, changeTransactionCategory } = bindActionCreators(FinancesActions, dispatch);

    return (
      <Finances
        { ...finances }
        onChangeTableFilter={changeTableFilter}
        onChangeTransactionCategory={changeTransactionCategory}
        onChangeDateRange={changeDateRange}
      />
    );
  }
}

FinancesApp.propTypes = {
  transactions: React.PropTypes.array
};

module.exports = connect((state) => {
  return {
    finances: {
      categories: state.categories,
      selectedDateRange: state.selectedDateRange,
      dateRange: state.dateRange,
      stackedAreaChart: state.stackedAreaChart,
      transactions: state.transactions,
      netAssetsChart: state.netAssetsChart
    }
  }
})(FinancesApp);
