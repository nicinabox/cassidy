jest.dontMock('../Settings');
jest.dontMock('../../stores/settingsStore');
jest.dontMock('../../actions/settingsActions');
jest.dontMock('../../utils/storage');

describe('Settings', function () {
  var React = require('react/addons');
  var Settings = require('../Settings');
  var settingsActions = require('../../actions/settingsActions');

  var TestUtils = React.addons.TestUtils;
  var { Simulate } = TestUtils;
  var component;

  beforeEach(function () {
    component = TestUtils.renderIntoDocument(<Settings />);
  });

  it('resets settings', function () {
    settingsActions.resetSettings = jest.genMockFn();

    Simulate.click(React.findDOMNode(component.refs.resetSettings));
    expect(settingsActions.resetSettings).toBeCalled();
  });

  it('clears local data', function () {
    settingsActions.clearLocalData = jest.genMockFn();

    Simulate.click(React.findDOMNode(component.refs.clearData));
    expect(settingsActions.clearLocalData).toBeCalled();
  });
});
