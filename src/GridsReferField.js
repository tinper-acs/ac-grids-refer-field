/**
 * mdf参照
 */

//React导入
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import schema from 'async-validator';
import MdfRefer,{cb} from '@yonyou/mdf-refer/lib/index'
import FieldWrap from './FieldWrap';
import isEqual from 'lodash.isequal'
import FormControl from 'bee-form-control';



//类型校验
const propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    className: PropTypes.string,
    field: PropTypes.string,
    index: PropTypes.number,
    message: PropTypes.string,
    data: PropTypes.array,
    required: PropTypes.bool,
    onValidate: PropTypes.func,
    isFlag: PropTypes.bool,
    validate: PropTypes.bool,
    cRefType:PropTypes.string.isRequired,//参照唯一标示
    displayname:PropTypes.string,//参照展示字段
    // valueField:PropTypes.string,//参照保存字段
};

//默认参数值
const defaultProps = {
    field: '',
    index: '',
    message: '请输入此字段',
    data: [],
    required: false,
    isFlag: false,
    validate: false,
    className: '',
    displayname:'name',
}

class GridsReferField extends Component {
    /**
     * Creates an instance of GridsReferField.
     * @param {*} props
     * @memberof GridsReferField
     */
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            flag: false,
            error: false,
        };

        this.model=new cb.models.MdfReferModel({
            cRefType:props.cRefType,
            displayname:props.displayname
        })
        this.config={
            modelconfig :{
                afterValueChange:this.handlerChange,
                // afterOkClick:this.handlerChange
            }
        }
    }
    /**
     *  参数发生变化回调
     *
     * @param {object} nextProps 即将更新Props
     * @param {object} nextState 即将更新State
     * @memberof NumberField
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.validate == true) {
            this.validate();
        }
        if(nextProps.value){
            if(isEqual(nextProps.value,this.props.value))this.model.setValue(nextProps.value);
        }
        
    }
    componentDidMount(){
        if(this.props.value)this.model.setValue(this.state.value);
        let field = ReactDOM.findDOMNode(this.refs.field);
        field.addEventListener('click',(e)=>{
            if(e.target.className=='anticon anticon-canzhao'||e.target.className=='anticon anticon-close-circle'){
                this.clickOut()
            }
        })
    }

    /**
     * 有输入值改变的回调
     *
     * @param {string} value
     */
    handlerChange = (value) => {
        this.clickOut();
        ReactDOM.findDOMNode(this.refs.input)&&ReactDOM.findDOMNode(this.refs.input).focus();
        value = value.value;
        let idKey = this.model._get_data('valueField');
        let nameKey = this.model._get_data('textField');
        let id = '';
        let name = '';
        let stateValue = '';

        if(value&&typeof value=='object'){
            id=value[idKey];
            name=value[nameKey];
            stateValue=value[nameKey];
        }else{
            this.model.setValue(value)
            stateValue=value;
            id='';
            name=value;
        }
        
        let { onChange, field, index, status,valueField } = this.props;
        //处理是否有修改状态改变、状态同步之后校验输入是否正确
        this.setState({ value:stateValue, flag: status == 'edit' }, () => {
            this.validate();
        });
        
        //回调外部函数
        onChange && onChange(field, {id:id,name:name}, index);
    }
    /**
     * 校验方法
     *
     */
    validate = () => {
        let { required, field, index, onValidate,pattern,patternMessage } = this.props;
        let { value } = this.state;
        //设置校验规则
        let descriptor = {
            [field]: 
            [
                { required }
            ]
            
        }
        if(pattern){
            descriptor[field].push({
                pattern:pattern,message:patternMessage
            })
        }
        let validator = new schema(descriptor);
        validator.validate({ [field]: value }, (errors, fields) => {
            if (errors) {
                this.setState({
                    error: true
                });
            } else {
                this.setState({
                    error: false
                });
            }
            onValidate && onValidate(field, fields, index);
        });
    }
    clickOut=(e)=>{
        e&&e.stopPropagation&&e.stopPropagation()
        this.onBlurTimer&&clearTimeout(this.onBlurTimer);
    }

    onBlur=()=>{
        this.onBlurTimer&&clearTimeout(this.onBlurTimer);
        this.onBlurTimer=setTimeout(()=>{
            this.props.onBlur();
        },100)
    }

    iconClick=(e)=>{
        this.model.browse();
        this.clickOut(e)
    }


    render() {
        let { value, error, flag } = this.state;
        let { className,cRefType,displayname,valueField,config={}, message, required, onBlur, pattern,patternMessage } = this.props;
        return (
            <FieldWrap
                required={required}
                error={error}
                message={pattern?patternMessage:message}
                flag={flag}
            >
                <span style={{'display':'none'}}>
                    <MdfRefer 
                        wrapClassName="user-refer-modal"
                        modelName={'refer'} model={this.model} config={this.config} ></MdfRefer>
                </span>
                <span className='refer-out' ref='field'>
                    <FormControl 
                        value={this.state.value}
                        onBlur={this.onBlur} 
                        ref='input' 
                        onClick={()=>{ReactDOM.findDOMNode(this.refs.input)&&ReactDOM.findDOMNode(this.refs.input).focus();}}
                        onChange={(value)=>{this.handlerChange({value:value})
                    }}/>
                    <span className="uf uf-symlist" onClick={this.iconClick}> </span>
                </span>
            </FieldWrap>
        );
    }
}

GridsReferField.propTypes = propTypes;
GridsReferField.defaultProps = defaultProps;
export default GridsReferField;