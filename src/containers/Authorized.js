import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

class Authorized extends React.Component {
  componentWillMount() {
    if (!this.props.isLoggedIn) {
      this.props.redirectToLogin();
    }
  }

  render() {
    if (this.props.isLoggedIn) {
      return this.props.children;
    }

    return <div>Loading...</div>;
  }
}

Authorized.propTypes = {
  isLoggedIn: React.PropTypes.bool,
  children: React.PropTypes.element,
  redirectToLogin: React.PropTypes.func
};


function mapStateToProps(state) {
  return {
    isLoggedIn: state.auth.isLoggedIn,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    redirectToLogin: () => {
      dispatch(push('/auth'));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Authorized);
