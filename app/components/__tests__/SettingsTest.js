jest.dontMock('../Settings');
jest.dontMock('../../stores/settingsStore');
jest.dontMock('../../utils/storage');

describe('Settings', function () {
  var React = require('react/addons');
  var Settings = require('../Settings');

  var TestUtils = React.addons.TestUtils;
  var { Simulate } = TestUtils;
  var component;

  beforeEach(function () {
    component = TestUtils.renderIntoDocument(<Settings />);
  });

  it('resets settings', function () {
    component.handleResetSettings = jest.genMockFunction();
    var resetSettingsEl = React.findDOMNode(component.refs.resetSettings);
    Simulate.click(resetSettingsEl);
    expect(component.handleResetSettings.mock.calls.length).toBe(1);
  });

  // it('clears local data')
  // it('saves service when changed')
});
