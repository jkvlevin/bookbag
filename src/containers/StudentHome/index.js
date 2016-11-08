import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Well, Button, Glyphicon, Carousel } from 'react-bootstrap';
import Header from '../../components/Header';
import styles from './styles.css';
import Sidebar from '../../components/Sidebar';

class StudentHome extends React.Component {
  constructor(props) {
   super(props);
   this.state = {
    index : 0,
    direction : null
   }
   this.handleSearch = this.handleSearch.bind(this);
   this.handleSelect = this.handleSelect.bind(this);
 }

  handleSearch() {
    browserHistory.push('/search');
  }

  handleSelect(selectedIndex, e) {
    this.setState({
      index: selectedIndex,
      direction: e.direction
    });
  }

  render() {

    return (
      <div className="student-container">
          <Header showSearch hasUser/>
          <h2 style={{marginTop:"80px", marginLeft:"40px"}}> Welcome, Jake </h2>
          <Carousel activeIndex={this.state.index} direction={this.state.direction} onSelect={(i,e)=>this.handleSelect(i,e)}>
            <Carousel.Item>
              <img width={200} height={200} alt="200x200" src="https://pixabay.com/static/uploads/photo/2014/03/29/09/17/cat-300572_960_720.jpg"/>
              <img width={200} height={200} alt="200x200" src="https://pixabay.com/static/uploads/photo/2014/03/29/09/17/cat-300572_960_720.jpg"/>
              <img width={200} height={200} alt="200x200" src="https://pixabay.com/static/uploads/photo/2014/03/29/09/17/cat-300572_960_720.jpg"/>
            </Carousel.Item>
            <Carousel.Item>
              <img width={200} height={200} alt="200x200" src="http://www.rd.com/wp-content/uploads/sites/2/2016/04/01-cat-wants-to-tell-you-laptop.jpg"/>
              <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img width={200} height={200} alt="200x200" src="https://pixabay.com/static/uploads/photo/2014/03/29/09/17/cat-300572_960_720.jpg"/>
              <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
              </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
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
