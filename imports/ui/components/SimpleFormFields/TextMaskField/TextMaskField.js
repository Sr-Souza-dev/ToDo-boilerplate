import React from "react";
import {hasValue} from "../../../../libs/hasValue";
import TextField from '@material-ui/core/TextField';

import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import InputMask from "react-input-mask";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import {simpleFormFieldsStyles} from "../simpleFormFieldsStyle";

export default ({name,label,value,onChange,readOnly,error,...otherProps})=>{

  const [values, setValues] = React.useState({ textmask: value || '' });

  const deleteImage = () => {
      onChange({},{name,value: '-'})
  }

  const handleChange = (event) => {
    setValues({
      ...values,
      ['textmask']: event.target.value,
    });
  };

  function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
      <MaskedInput
        {...other}
        ref={(ref) => {
          inputRef(ref ? ref.inputElement : null);
        }}
        mask={['(', /\d/, /\d/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
        placeholderChar={'\u2000'}
        showMask
      />
    );
  }

  TextMaskCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

    if(!!readOnly) {
        return (<div key={name}>
            {hasValue(label)?(<label style={simpleFormFieldsStyles.displayLabelViewMode}>{label}</label>):null}
            <div style={simpleFormFieldsStyles.displayValueViewMode}>{(value+'')}</div>
        </div>)
    }

    return (
      <FormControl>
        <InputLabel htmlFor="formatted-text-mask-input">{label}</InputLabel>
        <Input
          inputComponent={TextMaskCustom}
          key={name} onChange={handleChange} value={values.textmask || ''} error={!!error} disabled={!!readOnly} id={name} name={name} label={label} {...otherProps}
        />
      </FormControl>
    );
}




/*

<InputMask
  mask="(99) 9 9999-9999"
  value={values.textmask}
  disabled={false}
  maskChar=" "
  onChange={handleChange}
  key={name} error={!!error} disabled={!!readOnly} id={name} name={name} label={label} {...otherProps}
>
  {() => <TextField id={values.textmask} />}
</InputMask>
*/
