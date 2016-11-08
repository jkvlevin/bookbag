import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import styles from './styles.css';
import * as actions from './actions.js';

class App extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    currentUser: state.appReducer.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUser: (email) => dispatch(actions.setUser(email))
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
