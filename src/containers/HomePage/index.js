import React from 'react';
import { Link } from 'react-router';
import { Grid, Col, Row, Button } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';

class HomePage extends React.Component {
  render() {
    return (
      <div className="home-page">
        <Header showSearch={false} hasUser={false} />
        <Grid>
          <div className="shadow">
            <Row style={{marginTop:"25vh", textAlign:"center"}}>
                <h1> BookBag </h1>
            </Row>
            <Row style={{marginTop:"2vh", textAlign:"center"}}>
              <p style={{fontSize:"20px"}}> A library of information at your fingertips </p>
            </Row>
          </div>
          <Row>
            <Col xs={10} xsOffset={1} sm={8} smOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4}>
              <Button id="profBtn"> For the professor </Button>
              <Button id="stdBtn"> For the student </Button>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default HomePage;
