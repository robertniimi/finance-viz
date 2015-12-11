var _ = require('lodash');

module.exports = {
  URLS: {
    login: 'https://wwws.mint.com/loginUserSubmit.xevent',
    transactionDownload: 'https://wwws.mint.com/transactionDownload.event',
    updateTransaction: 'https://wwws.mint.com/updateTransaction.xevent',
    getJsonData: 'https://wwws.mint.com/app/getJsonData.xevent',
    refreshAccounts: 'https://wwws.mint.com/refreshFILogins.xevent',
    refreshJob: 'https://mint.finance.intuit.com/v1/fis/refreshJob',
    listTransaction: 'https://wwws.mint.com/listTransaction.xevent'
  },
  HEADERS: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36'
  }
}
