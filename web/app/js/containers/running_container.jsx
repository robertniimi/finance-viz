import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

// Constants
import ActionTypes from 'action_types';

// Actions
import RunningActions from 'running_actions';

// Components
import Running from '../components/running/running';

/**
 * DESCRIPTION
 *
 * @prop {type} PROP - PROP_DESCRIPTION
 */

class RunningContainer extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {  };
  }

  render() {
    const {dispatch, running} = this.props;

    return (
      <Running
        {...running}
      />
    );
  }
}

RunningContainer.displayName = 'RunningContainer';

RunningContainer.propTypes = {
  dispatch: React.PropTypes.func,
  running: React.PropTypes.object,
};

module.exports = connect((state) => {
  console.log('[running_container] @connect -> state: ', state);
  return {
    running: {

    },
  };
})(RunningContainer);
