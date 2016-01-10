var _ = require('lodash');

module.exports = {
  URLS: {
    autocompleteFilter: 'https://wwws.mint.com/autocompleteFilter.xevent',
    getJsonData: 'https://wwws.mint.com/app/getJsonData.xevent',
    listTransaction: 'https://wwws.mint.com/listTransaction.xevent',
    login: 'https://wwws.mint.com/loginUserSubmit.xevent',
    refreshAccounts: 'https://wwws.mint.com/refreshFILogins.xevent',
    refreshJob: 'https://mint.finance.intuit.com/v1/fis/refreshJob',
    transactionDownload: 'https://wwws.mint.com/transactionDownload.event',
    trendData: 'https://wwws.mint.com/trendData.xevent',
    updateTransaction: 'https://wwws.mint.com/updateTransaction.xevent'
  },
  HEADERS: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36'
  },
  dateRanges: [
    {
      'label': 'Last 7 days',
      'value': 'L7D'
    }, {
      'label': 'Last 14 days',
      'value': 'L14D'
    }, {
      'label': 'This month',
      'value': 'TM'
    }, {
      'label': 'Last month',
      'value': 'LM'
    }, {
      'label': 'Last 3 months',
      'value': 'L3M'
    }, {
      'label': 'Last 6 months',
      'value': 'L6M'
    }, {
      'label': 'Last 12 months',
      'value': 'L12M'
    }, {
      'label': 'This year',
      'value': 'TY'
    }, {
      'label': 'Last year',
      'value': 'LY'
    }, {
      'label': 'All time',
      'value': 'AT'
    }
  ],
  reportTypes: [
    'NW'
  ]
}
