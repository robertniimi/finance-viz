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
    console.log('[app] this.props: ', this.props);
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
