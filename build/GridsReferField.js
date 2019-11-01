'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _asyncValidator = require('async-validator');

var _asyncValidator2 = _interopRequireDefault(_asyncValidator);

var _index = require('@yonyou/mdf-refer/lib/index');

var _index2 = _interopRequireDefault(_index);

var _FieldWrap = require('./FieldWrap');

var _FieldWrap2 = _interopRequireDefault(_FieldWrap);

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

var _beeFormControl = require('bee-form-control');

var _beeFormControl2 = _interopRequireDefault(_beeFormControl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * mdf参照
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

//React导入


//类型校验
var propTypes = {
    value: _propTypes2["default"].any,
    onChange: _propTypes2["default"].func,
    className: _propTypes2["default"].string,
    field: _propTypes2["default"].string,
    index: _propTypes2["default"].number,
    message: _propTypes2["default"].string,
    data: _propTypes2["default"].array,
    required: _propTypes2["default"].bool,
    onValidate: _propTypes2["default"].func,
    isFlag: _propTypes2["default"].bool,
    validate: _propTypes2["default"].bool,
    cRefType: _propTypes2["default"].string.isRequired, //参照唯一标示
    displayname: _propTypes2["default"].string //参照展示字段
    // valueField:PropTypes.string,//参照保存字段
};

//默认参数值
var defaultProps = {
    field: '',
    index: '',
    message: '请输入此字段',
    data: [],
    required: false,
    isFlag: false,
    validate: false,
    className: '',
    displayname: 'name'
};

var GridsReferField = function (_Component) {
    _inherits(GridsReferField, _Component);

    /**
     * Creates an instance of GridsReferField.
     * @param {*} props
     * @memberof GridsReferField
     */
    function GridsReferField(props) {
        _classCallCheck(this, GridsReferField);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.handlerChange = function (value) {
            _this.clickOut();
            _reactDom2["default"].findDOMNode(_this.refs.input) && _reactDom2["default"].findDOMNode(_this.refs.input).focus();
            value = value.value;
            var idKey = _this.model._get_data('valueField');
            var nameKey = _this.model._get_data('textField');
            var id = '';
            var name = '';
            var stateValue = '';

            if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
                id = value[idKey];
                name = value[nameKey];
                stateValue = value[nameKey];
            } else {
                _this.model.setValue(value);
                stateValue = value;
                id = '';
                name = value;
            }

            var _this$props = _this.props,
                onChange = _this$props.onChange,
                field = _this$props.field,
                index = _this$props.index,
                status = _this$props.status,
                valueField = _this$props.valueField;
            //处理是否有修改状态改变、状态同步之后校验输入是否正确

            _this.setState({ value: stateValue, flag: status == 'edit' }, function () {
                _this.validate();
            });

            //回调外部函数
            onChange && onChange(field, { id: id, name: name }, index);
        };

        _this.validate = function () {
            var _this$props2 = _this.props,
                required = _this$props2.required,
                field = _this$props2.field,
                index = _this$props2.index,
                onValidate = _this$props2.onValidate,
                pattern = _this$props2.pattern,
                patternMessage = _this$props2.patternMessage;
            var value = _this.state.value;
            //设置校验规则

            var descriptor = _defineProperty({}, field, [{ required: required }]);
            if (pattern) {
                descriptor[field].push({
                    pattern: pattern, message: patternMessage
                });
            }
            var validator = new _asyncValidator2["default"](descriptor);
            validator.validate(_defineProperty({}, field, value), function (errors, fields) {
                if (errors) {
                    _this.setState({
                        error: true
                    });
                } else {
                    _this.setState({
                        error: false
                    });
                }
                onValidate && onValidate(field, fields, index);
            });
        };

        _this.clickOut = function (e) {
            e && e.stopPropagation && e.stopPropagation();
            _this.onBlurTimer && clearTimeout(_this.onBlurTimer);
        };

        _this.onBlur = function () {
            _this.onBlurTimer && clearTimeout(_this.onBlurTimer);
            _this.onBlurTimer = setTimeout(function () {
                _this.props.onBlur();
            }, 100);
        };

        _this.iconClick = function (e) {
            _this.model.browse();
            _this.clickOut(e);
        };

        _this.state = {
            value: props.value,
            flag: false,
            error: false
        };

        _this.model = new _index.cb.models.MdfReferModel({
            cRefType: props.cRefType,
            displayname: props.displayname
        });
        _this.config = {
            modelconfig: {
                afterValueChange: _this.handlerChange
                // afterOkClick:this.handlerChange
            }
        };
        return _this;
    }
    /**
     *  参数发生变化回调
     *
     * @param {object} nextProps 即将更新Props
     * @param {object} nextState 即将更新State
     * @memberof NumberField
     */


    GridsReferField.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (nextProps.validate == true) {
            this.validate();
        }
        if (nextProps.value) {
            if ((0, _lodash2["default"])(nextProps.value, this.props.value)) this.model.setValue(nextProps.value);
        }
    };

    GridsReferField.prototype.componentDidMount = function componentDidMount() {
        var _this2 = this;

        if (this.props.value) this.model.setValue(this.state.value);
        var field = _reactDom2["default"].findDOMNode(this.refs.field);
        field.addEventListener('click', function (e) {
            if (e.target.className == 'anticon anticon-canzhao' || e.target.className == 'anticon anticon-close-circle') {
                _this2.clickOut();
            }
        });
    };

    /**
     * 有输入值改变的回调
     *
     * @param {string} value
     */

    /**
     * 校验方法
     *
     */


    GridsReferField.prototype.render = function render() {
        var _this3 = this;

        var _state = this.state,
            value = _state.value,
            error = _state.error,
            flag = _state.flag;
        var _props = this.props,
            className = _props.className,
            cRefType = _props.cRefType,
            displayname = _props.displayname,
            valueField = _props.valueField,
            _props$config = _props.config,
            config = _props$config === undefined ? {} : _props$config,
            message = _props.message,
            required = _props.required,
            onBlur = _props.onBlur,
            pattern = _props.pattern,
            patternMessage = _props.patternMessage;

        return _react2["default"].createElement(
            _FieldWrap2["default"],
            {
                required: required,
                error: error,
                message: pattern ? patternMessage : message,
                flag: flag
            },
            _react2["default"].createElement(
                'span',
                { style: { 'display': 'none' } },
                _react2["default"].createElement(_index2["default"], {
                    wrapClassName: 'user-refer-modal',
                    modelName: 'refer', model: this.model, config: this.config })
            ),
            _react2["default"].createElement(
                'span',
                { className: 'refer-out', ref: 'field' },
                _react2["default"].createElement(_beeFormControl2["default"], {
                    value: this.state.value,
                    onBlur: this.onBlur,
                    ref: 'input',
                    onClick: function onClick() {
                        _reactDom2["default"].findDOMNode(_this3.refs.input) && _reactDom2["default"].findDOMNode(_this3.refs.input).focus();
                    },
                    onChange: function onChange(value) {
                        _this3.handlerChange({ value: value });
                    } }),
                _react2["default"].createElement(
                    'span',
                    { className: 'uf uf-symlist', onClick: this.iconClick },
                    ' '
                )
            )
        );
    };

    return GridsReferField;
}(_react.Component);

GridsReferField.propTypes = propTypes;
GridsReferField.defaultProps = defaultProps;
exports["default"] = GridsReferField;
module.exports = exports['default'];