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
    let {
      fetchTransactions,
      fetchTransactionsSuccess,
      fetchTransactionsError
    } = bindActionCreators(FinancesActions, this.props.dispatch);

    fetchTransactions({ query }, fetchTransactionsSuccess, fetchTransactionsError);
  }

  _fetchChartTransactions(dateRange, query) {
    let {
      fetchChartTransactions,
      fetchChartTransactionsSuccess,
      fetchChartTransactionsError
    } = bindActionCreators(FinancesActions, this.props.dispatch);

    fetchChartTransactions(dateRange, fetchChartTransactionsSuccess, fetchChartTransactionsError);
  }

  _fetchCategories() {
    let {
      fetchCategories,
      fetchCategoriesSuccess,
      fetchCategoriesError
    } = bindActionCreators(FinancesActions, this.props.dispatch);

    fetchCategories(fetchCategoriesSuccess, fetchCategoriesError);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.finances.selectedDateRange !== this.props.finances.selectedDateRange) {
      this._fetchChartTransactions(nextProps.finances.dateRange);
    };

    if (nextProps.finances.transactions.query !== this.props.finances.transactions.query) {
      this._fetchTransactions(nextProps.finances.transactions.query);
    };
  }

  componentDidMount() {
    this._fetchCategories();
    this._fetchChartTransactions(this.props.finances.dateRange);
    this._fetchTransactions(this.props.finances.transactions.query);
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
      transactions: state.transactions
    }
  }
})(FinancesApp);
