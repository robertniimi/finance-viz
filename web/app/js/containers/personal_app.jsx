import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FinancesActions from 'finances_actions';

import Finances from '../components/Finances';

class SomeApp extends React.Component {
  render() {
    return (
      <div>
        <Finances />
      </div>
    );
  }
}

module.exports = SomeApp;
