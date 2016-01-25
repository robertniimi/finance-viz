/**
 * DESCRIPTION
 *
 * @prop {type} PROP - PROP_DESCRIPTION
 */

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='app'>
        {/* Insert App header / nav here */}
        {this.props.children}
      </div>
    );
  }
}

App.displayName = 'App';

App.propTypes = {

};

module.exports = App;
