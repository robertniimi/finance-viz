import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Constants
import ActionTypes from 'action_types';

// Actions
import FinancesActions from 'finances_actions';

// Components
import Finances from '../components/finances';

class SomeApp extends React.Component {
  constructor() {
    super()
  }

  _fetchTransactions(dateRange, query) {
    let { fetchTransactions, fetchTransactionsSuccess, fetchTransactionsError } = bindActionCreators(FinancesActions, this.props.dispatch);
    fetchTransactions({}, fetchTransactionsSuccess, fetchTransactionsError);
  }

  _fetchChartTransactions(dateRange, query) {
    let { fetchChartTransactions, fetchChartTransactionsSuccess, fetchChartTransactionsError } = bindActionCreators(FinancesActions, this.props.dispatch);
    console.log('[finances_container] FETCHING CHART TRANSACTIONS');
    fetchChartTransactions(dateRange, fetchChartTransactionsSuccess, fetchChartTransactionsError);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('[finances_container] this.props.finances.dateRange: ', this.props.finances.dateRange);
    if (prevProps.finances.selectedDateRange !== this.props.finances.selectedDateRange) {
      this._fetchTransactions();
      this._fetchChartTransactions(this.props.finances.dateRange);
    };
  }

  componentDidMount() {
    this._fetchTransactions();
    this._fetchChartTransactions(this.props.finances.dateRange);
  }

  render() {
    console.log('[finances_container] this.props: ', this.props);
    let {
      dispatch,
      finances
    } = this.props;

    return (
      <Finances
        { ...finances }
        onChangeDateRange={(selectedDateRange) => {
          dispatch(FinancesActions.changeDateRange(selectedDateRange));
        }}
      />
    );
  }
}

SomeApp.propTypes = {
  transactions: React.PropTypes.array
};

module.exports = connect((state) => {
  return {
    finances: {
      selectedDateRange: state.selectedDateRange,
      dateRange: state.dateRange,
      stackedAreaChart: state.stackedAreaChart,
      transactions: state.transactions
    }
  }
})(SomeApp);
