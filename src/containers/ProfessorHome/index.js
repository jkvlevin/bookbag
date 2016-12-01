import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Well, Button, Glyphicon, Modal, Form, FormControl, FormGroup, InputGroup } from 'react-bootstrap';
import Header from '../../components/Header';
import Sidebar from '../../components/MenuBar/Sidebar.js';
import HeaderMenu from '../../components/MenuBar/HeaderMenu.js';
import Library from '../../components/Library/Library';
import * as actions from './actions.js';
import styles from './styles.css';


class ProfessorHome extends React.Component {
 render() {
    return (
      <div className="prof-container">

      </div>
    );
  }
}

ProfessorHome.propTypes = {
  currentUser: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    currentUser: state.appReducer.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfessorHome);
