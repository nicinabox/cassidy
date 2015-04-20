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
    component.resetSettings = jest.genMockFn();

    Simulate.click(React.findDOMNode(component.refs.resetSettings));
    expect(component.resetSettings).toBeCalled();
  });

  // it('clears local data')
  // it('saves service when changed')
});
