import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Well, Button, Glyphicon } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';
import Sidebar from '../../components/Sidebar';

class StudentHome extends React.Component {
  constructor(props) {
   super(props);
   this.handleSearch = this.handleSearch.bind(this);
 }

  handleSearch() {
    browserHistory.push('/search');
  }

  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (
      <div className="student-container">
        <Header showSearch hasUser currentUser={this.props.currentUser}/>
        <h2 style={{marginTop:"80px", marginLeft:"40px"}}> Welcome, {this.props.currentUser} </h2>
      </div>
    );
  }
}

StudentHome.propTypes = {
  currentUser: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  return {
    currentUser: state.appReducer.currentUser
  };
}
export default connect(mapStateToProps)(StudentHome);
