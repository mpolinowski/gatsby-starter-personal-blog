'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLoadable = require('react-loadable');

var _reactLoadable2 = _interopRequireDefault(_reactLoadable);

var _createLoadableVisibilityComponent = require('./createLoadableVisibilityComponent');

var _createLoadableVisibilityComponent2 = _interopRequireDefault(_createLoadableVisibilityComponent);

var _capacities = require('./capacities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LoadableVisibility(opts) {
  if (_capacities.IntersectionObserver) {
    return (0, _createLoadableVisibilityComponent2.default)([opts], {
      Loadable: _reactLoadable2.default,
      preloadFunc: 'preload',
      LoadingComponent: opts.loading
    });
  } else {
    return (0, _reactLoadable2.default)(opts);
  }
}

function LoadableVisibilityMap(opts) {
  if (_capacities.IntersectionObserver) {
    return (0, _createLoadableVisibilityComponent2.default)([opts], {
      Loadable: _reactLoadable2.default.Map,
      preloadFunc: 'preload',
      LoadingComponent: opts.loading
    });
  } else {
    return _reactLoadable2.default.Map(opts);
  }
}

LoadableVisibility.Map = LoadableVisibilityMap;

module.exports = LoadableVisibility;