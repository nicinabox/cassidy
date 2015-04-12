jest.dontMock('../Generator');
jest.dontMock('../../stores/settingsStore');
jest.dontMock('../../stores/servicesStore');
jest.dontMock('../../utils/storage');

describe('Generator', function () {
  var React = require('react/addons');
  var Generator = require('../Generator');

  var TestUtils = React.addons.TestUtils;
  var { Simulate } = TestUtils;
  var component;

  beforeEach(function () {
    component = TestUtils.renderIntoDocument(<Generator />);
  });

  it('generates password on change', function () {
    var serviceInput = React.findDOMNode(component.refs.service)
    Simulate.change(serviceInput, { target: { value: 'hi' }});
    var resultInput = React.findDOMNode(component.refs.result);

    expect(serviceInput.value).toEqual('hi');
    expect(resultInput.value).toBe('awesome');
  });

  it('saves service on password copy', function () {
    component.saveService = jest.genMockFunction();

    var serviceInput = React.findDOMNode(component.refs.service)
    Simulate.change(serviceInput, { target: { value: 'hi' } });

    var resultInput = React.findDOMNode(component.refs.result);
    Simulate.copy(resultInput);

    expect(component.saveService.mock.calls.length).toBe(1);
  });

  it('clears service input on click', function () {
    var serviceInput = React.findDOMNode(component.refs.service)
    Simulate.change(serviceInput, { target: { value: 'hi' } });
    expect(serviceInput.value).toBe('hi');

    var clear = TestUtils.findRenderedDOMComponentWithClass(component, 'clear');
    Simulate.click(clear);
    expect(serviceInput.value).toBe('');
  });
});
