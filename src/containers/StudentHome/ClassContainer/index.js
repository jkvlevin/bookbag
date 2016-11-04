import React from 'react';
import { Link } from 'react-router';
import Header from '../../../components/Header';
import styles from './styles.css';

class ClassContainer extends React.Component {
  render() {
    return (
      <div className="class-container">
        <h2 style={{margin:"0px"}}>My Classes</h2>
        <hr style={{marginTop:"0px"}}/>
        <h3 className="chapter">ORF 309</h3>
        <hr style={{marginTop:"0px"}}/>
        <h3 className="chapter">ORF 500</h3>
        <hr style={{marginTop:"0px"}}/>
        <h3 className="chapter">COS 340</h3>
      </div>
    );
  }
}

export default ClassContainer;