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
          <Carousel activeIndex={this.state.index} direction={this.state.direction} onSelect={(i,e)=>this.handleSelect(i,e)} style={{backgroundColor:"#272B33"}}>
            <Carousel.Item style={{width:"70%", margin:"auto"}}>
              <div style={{float:"left"}}>
                <img width={200} height={200} alt="200x200" src="https://img.buzzfeed.com/buzzfeed-static/static/enhanced/webdr02/2013/7/31/12/grid-cell-12788-1375287846-44.jpg"/>
                <h3>Chapter Title</h3>
              </div>
              <div style={{float:"left"}}>
                <img width={200} height={200} alt="200x200" src="https://img.buzzfeed.com/buzzfeed-static/static/enhanced/webdr02/2013/7/31/12/grid-cell-12788-1375287846-44.jpg"/>
                <h3>Chapter Title</h3>
              </div>
              <div style={{float:"left"}}>
                <img width={200} height={200} alt="200x200" src="https://img.buzzfeed.com/buzzfeed-static/static/enhanced/webdr02/2013/7/31/12/grid-cell-12788-1375287846-44.jpg"/>
                <h3>Chapter Title</h3>
              </div>
              <div style={{float:"left"}}>
                <img width={200} height={200} alt="200x200" src="https://img.buzzfeed.com/buzzfeed-static/static/enhanced/webdr02/2013/7/31/12/grid-cell-12788-1375287846-44.jpg"/>
                <h3>Chapter Title</h3>
              </div>
            </Carousel.Item>
        </Carousel>
        <Header showSearch hasUser currentUser={this.props.currentUser}/>
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
