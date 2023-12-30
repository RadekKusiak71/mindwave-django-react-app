import React from 'react'
import classes from './Input.module.css'

const Input = (props) => {
  return (
    <input
        className={classes['form-input']}
        type={props.type}
        onChange={props.onChange}
        disabled={props.disabled}
        placeholder={props.placeholder}
        name={props.name}
        value={props.value}
    />
  )
}

export default Input