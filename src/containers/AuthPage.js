import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import * as actions from '../actions/auth';
import { Button } from 'office-ui-fabric-react/lib/Button';

class AuthPage extends React.Component {
  static propTypes = {
    actions: React.PropTypes.object,
    goToHome: React.PropTypes.func
  }

  constructor(props) {
    super(props);

    this.signIn = this.signIn.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedIn) {
      this.props.goToHome();
    }
  }

  signIn() {
    this.props.actions.login();
  }

  render() {
    return (
      <div>
        <Button onClick={this.signIn}>Sign In</Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.auth.isLoggedIn
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goToHome: () => {
      dispatch(push('/'));
    },
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthPage);
