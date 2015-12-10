import React from 'react'
import { findDOMNode } from 'react-dom'
import { defer, sample } from 'lodash'
import servicesStore from '../stores/servicesStore'
import serviceActions from '../actions/serviceActions'
import settingsStore from '../stores/settingsStore'
import settingsActions from '../actions/settingsActions'
import generator from '../utils/generator'
import activeSettings from '../utils/activeSettings'
import device from '../utils/device'
import shortcutsManager from '../utils/shortcutsManager'
import TypeaheadResults from './TypeaheadResults'


var Generator = React.createClass({
  _onChange() {
    var servicesState = servicesStore.getState()

    var state = {
      settings: activeSettings(),
      activeService: {}
    }

    if (servicesState.activeService) {
      state.activeService = servicesState.activeService
      state.service = servicesState.activeService.service
    }

    this.setState(state, () => {
      if (servicesState.focusResult) {
        this.selectResult()
      }
    })
  },

  getInitialState() {
    return {
      activeService: {},
      service: servicesStore.getActiveServiceName(),
      settings: activeSettings(),
      serviceAutoFocus: !device.isMobile,
      showTypeahead: false,
      result: ''
    }
  },

  componentWillMount() {
    shortcutsManager.listen({
      KEY_SLASH: '/',
      ESCAPE: 'escape'
    }, this.handleHotKey)
  },

  componentDidMount() {
    servicesStore.addChangeListener(this._onChange)
    settingsStore.addChangeListener(this._onChange)

    this.setState({
      interestingDomain: this.generateInterestingDomain() || 'google.com'
    })
  },

  componentWillUnmount() {
    servicesStore.removeChangeListener(this._onChange)
    settingsStore.removeChangeListener(this._onChange)
  },

  handleHotKey(name, e) {
    switch(name) {
    case 'ESCAPE':
      if (this.state.service) {
        this.setState({
          service: ''
        })

        findDOMNode(this.refs.service).focus()
      } else {
        findDOMNode(this.refs.service).blur()
      }
      break

    case 'KEY_SLASH':
      if (!(/input/i).test(e.target.tagName)) {
        e.preventDefault()
        findDOMNode(this.refs.service).focus()
      }
      break

    default:
      break
    }
  },

  handleServiceChange(e) {
    var value = e.target.value

    serviceActions.matchSavedService(value)

    this.setState({
      service: value,
      showTypeahead: true
    })
  },

  handleSubmit(e) {
    e.preventDefault()
  },

  clearService(e) {
    e.preventDefault()
    serviceActions.clearActiveService()
    serviceActions.filterServices()
    this.setState({
      service: ''
    }, () => {
      findDOMNode(this.refs.service).focus()
    })
  },

  selectResult: function() {
    var node = findDOMNode(this.refs.result)
    node.selectionStart = 0
    node.selectionEnd = node.value.length

    this.setState({
      showTypeahead: false
    })
  },

  handleSelectResult(e) {
    defer(() => this.selectResult())
  },

  generateInterestingDomain() {
    var service = sample(servicesStore.getTopServices(10))
    if (service) {
      return service.service
    }
  },

  saveService() {
    var service = {
      service: this.state.service,
      settings: this.state.settings
    }
    serviceActions.saveService(service)
  },

  showTypeahead() {
    return this.state.showTypeahead
  },

  render() {
    var result = generator(this.state)

    return (
      <div id="generator">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              ref="service"
              className="form-control input-lg"
              value={this.state.service}
              onChange={this.handleServiceChange}
              placeholder={`Eg, ${this.state.interestingDomain}`}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              autoFocus={this.state.serviceAutoFocus} />

            {this.showTypeahead() && (
              <TypeaheadResults query={this.state.service} />
            )}

            {this.state.service && (
              <a href="#" className="clear" tabIndex="-1"
                onClick={this.clearService}>
                &times;
              </a>
            )}
          </div>

          {result && (
            <div className="form-group">
              <input type="text"
                id="result"
                ref="result"
                value={result}
                onFocus={this.handleSelectResult}
                onClick={this.handleSelectResult}
                onCopy={this.saveService}
                onChange={(e) => {
                  e.preventDefault()
                }}
                />
            </div>
          )}
        </form>
      </div>
    )
  }

})

module.exports = Generator
