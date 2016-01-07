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

  _fetchCategories() {
    this.props.dispatch(FinancesActions.fetchCategories());
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
    let {finances} = this.props;
    this._fetchCategories();
    this._fetchChartTransactions(finances.dateRange);
    this._fetchTransactions(finances.transactions.query);
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
