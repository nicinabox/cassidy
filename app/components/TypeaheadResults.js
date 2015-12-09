import React from 'react'
import servicesStore from '../stores/servicesStore'
import serviceActions from '../actions/serviceActions'
import shortcutsManager from '../utils/shortcutsManager'

const keymap = {
  'KEY_DOWN': 'down',
  'KEY_UP': 'up',
  'ENTER': 'enter',
  'TAB': 'tab',
}

var TypeaheadResults = React.createClass({
  getInitialState() {
    return {
      services: this.getFilteredServices(this.props.query),
      selectedIndex: 0,
    }
  },

  componentWillMount() {
    shortcutsManager.listen(keymap, this.handleHotKey)
  },

  componentWillUnmount() {
    shortcutsManager.unlisten(keymap)
  },

  componentWillReceiveProps(nextProps) {
    var services = this.getFilteredServices(nextProps.query)
    this.setState({ services })
  },

  getFilteredServices(query) {
    return _.take(servicesStore.getFilteredServices(query || ''), 5)
  },

  handleHotKey(name, e) {
    e.preventDefault()

    switch(name) {
    case 'KEY_DOWN':
      this.setState({
        selectedIndex: this.getLeadingIndex()
      })
      break

    case 'KEY_UP':
      this.setState({
        selectedIndex: this.getTrailingIndex()
      })
      break

    case 'ENTER':
    case 'TAB':
      let service = this.state.services[this.state.selectedIndex]
      this.populateGenerator(service)

    default:
      break
    }
  },

  getLeadingIndex(i) {
    var next = this.state.selectedIndex + 1
    if (next > this.state.services.length - 1) {
      next = 0
    }
    return next
  },

  getTrailingIndex(i) {
    var next = this.state.selectedIndex - 1
    if (next < 0) {
      next = this.state.services.length - 1
    }
    return next
  },

  populateGenerator(service) {
    serviceActions.setActiveService(service)
    serviceActions.focusResult()
  },

  handleServiceSelect(service, e) {
    e.preventDefault()
    this.populateGenerator(service)
  },

  render() {
    var results = (
      <div className="typeahead-results">
        {this.state.services.map((service, i) => {
          return (
            <a href="#"
              key={`service-${i}`}
              className={this.state.selectedIndex === i ? 'selected' : ''}
              onClick={this.handleServiceSelect.bind(null, service)}>
              {service.service}
            </a>
          )
        })}
      </div>
    )

    return (
      <div className="typeahead-results-container">
        {this.state.services.length ? results : ''}
      </div>
    )
  }

})

module.exports = TypeaheadResults
