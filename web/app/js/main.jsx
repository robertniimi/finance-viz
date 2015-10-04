import Router from 'react-router';
import App from './components/app';
import AreaChart from './components/area_chart';
let { Route } = Router;

var routes = (
  <Route handler={ App }>
    <Route path='area' handler={ AreaChart }/>
  </Route>
);

Router.run(routes, Router.HashLocation, (Root) => {
  React.render(<Root/>, document.body);
});
