import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Well, Button, Glyphicon, Carousel } from 'react-bootstrap';
import styles from './styles.css';

class CourseTile extends React.Component {
  constructor(props) {
   super(props);
 }

  handleSearch() {
    browserHistory.push('/search');
  }

  render() {

    return (
      <div className="chapter" style={{float:"left"}}><a href='http://www.stat.pitt.edu/stoffer/tsa4/intro_prob.pdf'>
        <img src="https://img.buzzfeed.com/buzzfeed-static/static/enhanced/webdr02/2013/7/31/12/grid-cell-12788-1375287846-44.jpg"/>
        <h4>Chapter Title</h4></a>
      </div>
    );
  }
}

CourseTile.propTypes = {
  currentUser: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  return {
    currentUser: state.appReducer.currentUser
  };
}
export default connect(mapStateToProps)(CourseTile);
