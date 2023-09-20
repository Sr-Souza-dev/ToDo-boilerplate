import * as React from 'react';
import Switch from '@mui/material/Switch';
import { Stack } from '@mui/material';
import SimpleLabelView from '../../SimpleLabelView/SimpleLabelView';
import { IBaseSimpleFormComponent } from '../../InterfaceBaseSimpleFormComponent';

export default ({name, label, value, onChange, readOnly, error, ...otherProps}:IBaseSimpleFormComponent) => {
    function handleChange(event) {
        onChange({name, target: {name, value: event.target.checked}}, {name, value: event.target.checked});
    }

    return (
        <Stack direction={'row'} spacing={2} sx={{alignContent: 'center', alignItems: 'center', ...(otherProps?.sxContainer || {}) }} >
            {label && <SimpleLabelView label={label} disabled={readOnly}/>}
            <Switch
                key={name}
                checked={value}
                disabled={readOnly}
                onChange={handleChange}
                sx={{...(otherProps?.sx || {})}}
            />
        </Stack>
)}