import querystring from 'querystring';

/**
 * DESCRIPTION
 *
 * @prop {type} PROP - PROP_DESCRIPTION
 */

class Running extends React.Component {
  constructor(props) {
    super(props);
  }

  onConnectWithStrava() {

  }

  render() {
    const stravaQuery = {
      client_id: 9828,
      response_type: 'code',
      redirect_uri: 'http://localhost:8080/strava/auth',
      scope: 'write',
    };

    return (
      <div className='running'>
        <a href={`https://www.strava.com/oauth/authorize?${querystring.stringify(stravaQuery)}`}>
          <img
            src='/static/images/ConnectWithStrava.png'
            alt='Connect with Strava'
            onClick={this.onConnectWithStrava.bind(this)}
          />
        </a>
      </div>
    );
  }
}

Running.displayName = 'Running';

Running.propTypes = {
  onConnectWithStrava: React.PropTypes.func,
};

module.exports = Running;
