import React, { Component } from 'react';
import './Edit.css'
import Tabs from './Tabs';
import Content from './Content';
import { withRouter } from "react-router";
import { withAuth } from '../components/AuthProvider';

class Edit extends Component {
  state = {
    selectedTab: this.props.selectedTab,
    contents: [
      {title: "profile"},
      {title: "work"},
      {title: "education"},
    ]
  }

  render() {
    const { selectedTab, contents } = this.state
    // console.log(selectedTab)
    return (
      <div className="edit-component-container">
        <Tabs selectedTab={selectedTab} contents={contents}/>
        <div className="edit-content-container">
          <Content />
        </div>
      </div>
    )
  }
}

export default withAuth()(withRouter(Edit))
