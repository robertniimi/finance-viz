module.exports = (app, mint) => {
  app.get('/mint/transactions', (req, res) => {
    // console.log('[mintApi] req.query: ', req.query);
    mint.getJsonTransactions(req.query)
      .then((transactions) => {
        res.send(transactions);
      });
  });

  app.get('/mint/categories', (req, res) => {
    mint.getJsonCategories(req.query)
      .then((categories) => {
        res.send(categories);
      })
      .catch((err) => {

      });
  })

  app.get('/mint/getJsonData', (req, res) => {
    mint.getJsonData()
      .then((jsonData) => {
        res.send(jsonData);
      })
      .catch((err) => {
        // console.log('[mintApi] err: ', err);
      });
  });
}
