import React from 'react';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';
import styles from './styles.css';

class HomePage extends React.Component {
  render() {
    return (
      <div className="home-page">
        <Button id="sign-in" href="/login"> Sign In </Button>
        <h1 style={{marginTop:"150px", marginLeft:"30px", fontSize:"56px"}}> BookBag </h1> <hr id="divider" />
        <p style={{marginLeft:"30px", fontSize:"26px"}}> A library of information at your fingertips </p>

        <Button id="profBtn"> For the professor </Button>
        <Button id="stdBtn"> For the student </Button>
      </div>
    );
  }
}

export default HomePage;
