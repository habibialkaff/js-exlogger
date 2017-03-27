import React from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { checkAuth } from '../actions/auth';

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    checkAuth: React.PropTypes.func,
    isAuthChecked: React.PropTypes.bool
  }

  componentWillMount() {
    this.props.checkAuth();
  }

  render() {
    return this.props.isAuthChecked ? (
      <div>
        <IndexLink to="/">Home</IndexLink>
        {this.props.children}
      </div>
    ) : <div>Loading...</div>;
  }
}

function mapStateToProps(state) {
  const { auth } = state;
  return {
    isAuthChecked: auth.isAuthChecked
  };
}

function mapDispatchToProps(dispatch) {
  return {
    checkAuth: () => {
      dispatch(checkAuth());
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
