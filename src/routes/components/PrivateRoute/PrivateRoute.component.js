import {Component} from 'react';
import {Navigate} from 'react-router-dom';
import {PATHS} from 'configs/routes.config';
import {History} from '..';
import {DEFAULT_PROPS, PROP_TYPES} from './PrivateRoute.config';

const TargetPage = ({Component}) => {

  const isLoggedIn = localStorage.getItem('IS_LOGGED_IN') === 'true';

  if (!isLoggedIn) {
    return <Navigate replace to={PATHS.PANEL_LOGIN} />
  }

  return (
    <History onRender={
      props => {
        return  (
              <Component {...props} />
          )
      }
    } />
  )
}

class PrivateRoute extends Component {
  render() {
    const {component} = this.props;

    return (
      <TargetPage Component={component} />
    );
  }
}

PrivateRoute.defaultProps = DEFAULT_PROPS;
PrivateRoute.propTypes = PROP_TYPES;

export {PrivateRoute};
