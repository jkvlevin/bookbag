import React from 'react';
import { Link } from 'react-router';
import { Grid, Col, Row } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';

class HomePage extends React.Component {
  render() {
    return (
      <div className="home-page">
        <Header />
        <Grid>
          <div className="shadow">
            <Row style={{marginTop:"25vh", textAlign:"center"}}>
                <h1> BookBag </h1>
            </Row>
            <Row style={{marginTop:"2vh", textAlign:"center"}}>
              <p style={{fontSize:"20"}}> Rethinking textbooks for students and professors </p>
            </Row>
            </div>
        </Grid>
      </div>
    );
  }
}

export default HomePage;
