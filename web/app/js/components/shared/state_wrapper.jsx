/**
 * DESCRIPTION
 *
 * @prop {type} PROP - PROP_DESCRIPTION
 */

class StateWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let content = null;
    if (this.props.loading) {
      content = (
        <div className='progress'>
          <div className='intermediate'></div>
        </div>
      );
    } else if (this.props.error) {
      content = (
        <div className='error'>
          {`${this.props.error}`}
        </div>
      );
    } else {
      content = this.props.children;
    }

    return (
      <div className='state-wrapper'>
        {content}
      </div>
    );
  }
}

StateWrapper.displayName = 'StateWrapper';

StateWrapper.propTypes = {
  loading: React.PropTypes.bool,
  children: React.PropTypes.node,
  error: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
  onRetry: React.PropTypes.func,
  onReset: React.PropTypes.func,
};

module.exports = StateWrapper;
