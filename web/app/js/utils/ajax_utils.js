import Promise from 'bluebird';

module.exports = {
  get: function(url) {
    return new Promise(function(resolve, reject) {
      $.get(url)
        .done(function(response) {
          resolve(response);
        })
        .fail(function(err) {
          reject(err);
        });
    });
  },
  post: function(url, data) {
    return new Promise(function(resolve, reject) {
      $.post(url, data)
        .done(function(response) {
          resolve(response);
        })
        .fail(function(err) {
          reject(err);
        });
    });
  }
};
