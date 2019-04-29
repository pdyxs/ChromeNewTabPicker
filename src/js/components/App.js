import React, { Component, Fragment } from "react";
import './App.scss';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import moment from 'moment';
import { startSession, endSession } from 'modules/navigation';
import { addTab, removeTab } from 'modules/tabs';

import classnames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/pro-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faEdit);
library.add(faTrash);
library.add(faPlus);

class App extends Component {
  constructor(props) {
    super(props);
    var tabs = props.tabs;
    this.state = {
      active: tabs.length > 0 ? tabs[0].id : 0,
      newName: '',
      newUrl: ''
    };

  }

  componentDidMount() {
    this.props.startSession();
    this.setupBeforeUnloadListener();
  }

  doBeforeUnload = () => {
    this.props.endSession();
  }

  activateTab = (tab) => {
    this.setState({
      active: tab.id
    });
  }

  goToSettings = () => {
    this.setState({
      active: 0
    });
  }

  updateName = (newName) => {
    this.setState({newName});
  }

  updateURL = (newUrl) => {
    this.setState({newUrl});
  }

  addTab = () => {
    this.props.addTab(this.state.newName, this.state.newUrl);
    this.setState({
      newName: '',
      newUrl: ''
    })
  }

  setupBeforeUnloadListener = () => {
    window.addEventListener("beforeunload", (ev) => {
        ev.preventDefault();
        return this.doBeforeUnload();
    });
  };

  render() {
    var tabs = this.props.tabs;
    return (
      <div>
        <div className="position-fixed bg-info text-light w-100 px-3 py-3" style={{zIndex: '1000'}}>
          <ul className="float-right nav nav-pills">
            <li className="nav-item mx-2">
              <a className={classnames('nav-link', 'text-light', {'active': this.state.active == 0})}
                href="#"
                onClick={this.goToSettings}>
                <FontAwesomeIcon icon={['far', 'edit']} />
              </a>
            </li>
          </ul>
          <ul className="nav nav-pills justify-content-center">
            {tabs.map(tab => (
              <li key={tab.id} className={classnames('nav-item', 'mx-2')}>
                <a className={classnames('nav-link', 'text-light', {'active': this.state.active == tab.id})}
                  href="#"
                  onClick={() => this.activateTab(tab)}>{tab.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-100 h-100 position-absolute" style={{paddingTop: "4.3rem"}}>
          {tabs.map(tab => (
            <iframe key={tab.id} className={
                classnames('w-100', 'h-100', 'border-0',
                  {'d-none': tab.id != this.state.active}
                )} src={tab.url}></iframe>
          ))}
          {(tabs.length == 0 || this.state.active == 0) && (
            <div className="container">
              <h2 className="mt-2">Edit your tabs</h2>
              <ul className="list-group">
                {tabs.map(tab => (
                  <li key={tab.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      {tab.name}
                      <span className="small ml-3">{tab.url}</span>
                    </span>
                    <button className="btn btn-danger"
                      onClick={() => this.props.removeTab(tab.id)}>
                      <FontAwesomeIcon icon={['far', 'trash']} />
                    </button>
                  </li>
                ))}
                <li className="list-group-item">
                  <div className="form-row">
                    <div className="form-group col-md-5 mb-0">
                      <input type="text" className="form-control" id="inputName"
                        value={this.state.newName}
                        onChange={evt => this.updateName(evt.target.value)}
                        placeholder="Name" />
                    </div>
                    <div className="form-group col-md-6 mb-0">
                      <input type="text" className="form-control" id="inputURL"
                        value={this.state.newUrl}
                        onChange={evt => this.updateURL(evt.target.value)}
                        placeholder="URL" />
                    </div>
                    <div className="col-md-1">
                      <button className="btn btn-success"
                        onClick={() => this.addTab()}>
                        <FontAwesomeIcon icon={['far', 'plus']} />
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
        <footer className="footer fixed-bottom pb-1 bg-white-50">
          <div className="container text-right">
            <span className="small text-muted">v{APP_VERSION_NUMBER}, built on {BUILD_DATE} at {BUILD_TIMESTAMP} (UTC)</span>
          </div>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = ({tabs}) => ({...tabs});

const mapDispatchToProps = dispatch => {
  return {
    startSession: () => dispatch(startSession()),
    endSession: () => dispatch(endSession()),
    addTab: (name, url) => dispatch(addTab(name, url)),
    removeTab: (id) => dispatch(removeTab(id))
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(App)
);
