import {Component} from 'react';
import {PATHS} from 'configs/routes.config';
import {Route, Routes, unstable_HistoryRouter as BrowserRouter} from 'react-router-dom';
import * as Page from 'pages';
import history from 'services/history.service';
import {ProtectedRoute, PublicRoute , PrivateRoute} from './components';

class AppRoute extends Component {
  render() {
    return (
      <BrowserRouter history={history}>
        <Routes>
          <Route path={PATHS.HOME} element={<PublicRoute component={(props) => <Page.Home {...props} />} />} />
          <Route path={PATHS.PRODUCTS} element={<PublicRoute component={(props) => <Page.Products {...props} />} />} />
          <Route path={PATHS.PRODUCT} element={<PublicRoute component={(props) => <Page.Product {...props} />} />} />
          <Route path={PATHS.BASKET} element={<PublicRoute component={(props) => <Page.Basket {...props} />} />} />
          <Route path={PATHS.CHECKOUT} element={<PublicRoute component={(props) => <Page.Checkout {...props} />} />} />
          <Route path={PATHS.PAYMENT_RESULT} element={<PublicRoute component={(props) => <Page.PaymentResult {...props} />} />} />
          <Route path={PATHS.SUCCESS_PAYMENT_RESULT} element={<PublicRoute component={(props) => <Page.SuccessPaymentResult {...props} />} />} />
          <Route path={PATHS.FAILED_PAYMENT_RESULT} element={<PublicRoute component={(props) => <Page.FailedPaymentResult {...props} />} />} />
          <Route path={PATHS.NOT_FOUND} element={<PublicRoute component={(props) => <Page.NotFound {...props} />} />} />
          <Route path={PATHS.PANEL_LOGIN} element={<ProtectedRoute component={(props) => <Page.PanelLogin {...props} />} />} />
          <Route path={PATHS.PANEL_PRODUCT} element={<PrivateRoute component={(props) => <Page.PanelProduct {...props} />} />} />
          <Route path={PATHS.PANEL_QUANTITY} element={<PrivateRoute component={(props) => <Page.PanelQuantity {...props} />} />} />
          <Route path={PATHS.PANEL_ORDERS} element={<PrivateRoute component={(props) => <Page.PanelOrders {...props} />} />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export {AppRoute};
