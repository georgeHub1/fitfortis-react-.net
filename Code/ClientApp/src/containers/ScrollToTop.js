import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class ScrollToTop extends Component {
  scrollToTop () {
    const elem = document.getElementById('main_container');

    if (elem) {
      elem.scrollTop = 0;
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.location !== prevProps.location) {
      this.scrollToTop();
    }
  }

  render () {
    return <div id="ref">{this.props.children}</div>;
  }
}

export default withRouter(ScrollToTop);
