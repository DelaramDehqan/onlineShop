import {Component} from 'react';
import {Navigate} from 'react-router-dom';
import {PATHS} from 'configs/routes.config';
import {History} from '..';
import {DEFAULT_PROPS, PROP_TYPES} from './ProtectedRoute.config';

const TargetPage = ({Component}) => {

  const isLoggedIn = localStorage.getItem('IS_LOGGED_IN') === 'true';

  if (isLoggedIn) {
    return <Navigate replace to={PATHS.PANEL_PRODUCT} />
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

class ProtectedRoute extends Component {
  render() {
    const {component} = this.props;

    return (
      <TargetPage Component={component} />
    );
  }
}

ProtectedRoute.defaultProps = DEFAULT_PROPS;
ProtectedRoute.propTypes = PROP_TYPES;

export {ProtectedRoute};
