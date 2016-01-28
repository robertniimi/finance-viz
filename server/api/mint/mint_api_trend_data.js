module.exports = (app, mint) => {
  app.get('/mint/chart/debts', (req, res) => {
    mint.getTrendData(req.query, 'DT', ['AA'])
      .then((data) => {
        res.send(data);
      });
  });

  app.get('/mint/chart/netIncome', (req, res) => {
    mint.getTrendData(req.query, 'NI', ['AA'])
      .then((data) => {
        res.send(data);
      });
  });

  app.get('/mint/chart/netWorth', (req, res) => {
    mint.getTrendData(req.query, 'NW', ['AA'])
      .then((data) => {
        res.send(data);
      });
  });

  app.get('/mint/chart/bankAssets', (req, res) => {
    mint.getTrendData(req.query, 'AT', ['CS'], 2)
      .then((data) => {
        res.send(data);
      })
  });

  app.get('/mint/chart/investmentAssets', (req, res) => {
    mint.getTrendData(req.query, 'AT', ['AI'], 1)
      .then((data) => {
        res.send(data);
      })
  });
};
