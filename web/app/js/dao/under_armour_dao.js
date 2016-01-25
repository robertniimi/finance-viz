import querystring from 'querystring';

module.exports = {
  fetchUnderArmourOAuth: () => {
    let query = {
      client_id: '7mn8yxthpau2js8u4vje3uc69hprucwt',
      response_type: 'code',
      redirect_uri: 'http://localhost:8080/ua-callback'
    };

    return request.get(`https://www.mapmyfitness.com/v7.1/oauth2/uacf/authorize/?${ querystring.stringify(query) }`);
  }

};
