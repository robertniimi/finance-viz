import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchTransactions } from 'finances_actions';
import financesReducer from '../reducers/finances_reducer';
import ActionTypes from 'action_types';

// Actions
import FinancesActions from 'finances_actions';

// Components
import Finances from '../components/finances';

class SomeApp extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <Finances {...this.props} />
      </div>
    );
  }
}

SomeApp.propTypes = {
  transactions: React.PropTypes.array
};

module.exports = connect((state) => {
  return {
    transactions: financesReducer(state, { type: ActionTypes.GET_TRANSACTIONS })
  }
})(SomeApp);
