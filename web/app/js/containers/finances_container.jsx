import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Constants
import ActionTypes from 'action_types';

// Actions
import { fetchTransactions, changeDateRange } from 'finances_actions';

// Components
import Finances from '../components/finances';

class SomeApp extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (<Finances {...this.props} />);
  }
}

SomeApp.propTypes = {
  transactions: React.PropTypes.array
};

module.exports = connect((state) => {
  console.log('[personal_app] @connect -> state: ', state);
  return {
    dateRange: state.dateRange,
    chartData: state.chartData,
    transactions: state.transactions
  }
})(SomeApp);
