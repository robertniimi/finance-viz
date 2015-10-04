/**
 * DESCRIPTION
 *
 * @prop {object}  - PROP_DESCRIPTION
 */

import { RouteHandler } from 'react-router';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id='app-container'>
        <h1>Spending Over Time</h1>
        <RouteHandler />
      </div>
    );
  }
}

App.displayName = 'App';

module.exports = App;
