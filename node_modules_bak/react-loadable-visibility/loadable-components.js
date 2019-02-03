'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _loadableComponents = require('loadable-components');

var _loadableComponents2 = _interopRequireDefault(_loadableComponents);

var _createLoadableVisibilityComponent = require('./createLoadableVisibilityComponent');

var _createLoadableVisibilityComponent2 = _interopRequireDefault(_createLoadableVisibilityComponent);

var _capacities = require('./capacities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadableVisiblity(load) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (_capacities.IntersectionObserver) {
    return (0, _createLoadableVisibilityComponent2.default)([load, opts], {
      Loadable: _loadableComponents2.default,
      preloadFunc: 'load',
      loadingComponent: function loadingComponent() {
        return opts.LoadingComponent;
      }
    });
  } else {
    return (0, _loadableComponents2.default)(load, opts);
  }
}

module.exports = loadableVisiblity;