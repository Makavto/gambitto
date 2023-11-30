import React, { ChangeEvent } from 'react'
import styles from './Input.module.scss';
import { UseFormRegister } from 'react-hook-form';

interface IInputProps {
  registerField: UseFormRegister<any>;
  name: string;
  placeholder?: string;
  emptyMessage?: string;
  isPassword?: boolean;
  onChange?: (value: string) => void;
}

function Input({placeholder,name,registerField,emptyMessage: required,isPassword,onChange}: IInputProps) {
  const _onChange = (value: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(value.currentTarget.value);
  }
  return (
    <input
      className={styles.input}
      {...registerField(name, {required})}
      placeholder={placeholder}
      type={`${isPassword ? 'password' : 'text'}`}
      onChange={_onChange}
    />
  )
}

export default Input