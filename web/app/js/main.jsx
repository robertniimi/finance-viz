import Router from 'react-router';
import App from './components/app';
import Finances from './components/finances';

let { Route } = Router;

var routes = (
  <Route path='/' handler={ App }>
    <Route path='finances' handler={ Finances }/>
  </Route>
);

Router.run(routes, Router.HashLocation, (Root) => {
  React.render(<Root/>, document.body);
});
