import React from 'react'
import authStore from '../stores/authStore'
import authActions from '../actions/authActions'
import serviceActions from '../actions/serviceActions'
import Sidebar from './Sidebar'
import Generator from './Generator'
import HeaderActions from './HeaderActions'
import device from '../utils/device'

var App = React.createClass({
  getInitialState() {
    return {
      dropboxIsAuth: authStore.isAuth()
    }
  },

  componentWillMount() {
    authStore.addChangeListener(this._onChange)
    authActions.tryAuth()
  },

  componentWillUnmount() {
    authStore.removeChangeListener(this._onChange)
  },

  _onChange() {
  },

  render() {
    return (
      <div className="container-fluid application">
        <div className="row">

          <div className="col-sm-8 col-sm-push-4 col-lg-9 col-lg-push-3">
            <div className="row">
              <div className="col-sm-12">
                <HeaderActions />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-11 col-lg-8 col-sm-push-1">
                <Generator />
              </div>
            </div>
          </div>

          <Sidebar />
        </div>
      </div>
    )
  }
})

module.exports = App
