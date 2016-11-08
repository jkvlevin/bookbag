import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { Well, Button, Glyphicon } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';
import Sidebar from '../../components/Sidebar';
import Carousel from 'react-slick';

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
        <Header showSearch hasUser/>
        <h2 style={{marginTop:"80px", marginLeft:"40px"}}> Welcome, Jake </h2>
        <Carousel {...settings}>
          <div><img src='http://placekitten.com/g/400/200' /></div>
          <div><img src='http://placekitten.com/g/400/200' /></div>
          <div><img src='http://placekitten.com/g/400/200' /></div>
          <div><img src='http://placekitten.com/g/400/200' /></div>
        </Carousel>
      </div>
    );
  }
}

export default StudentHome;
