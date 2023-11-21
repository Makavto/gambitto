import React from 'react'
import styles from './Input.module.scss';
import { UseFormRegister } from 'react-hook-form';

interface IInputProps {
  registerField: UseFormRegister<any>;
  name: string;
  placeholder?: string;
  emptyMessage?: string;
  isPassword?: boolean;
}

function Input({placeholder,name,registerField,emptyMessage: required,isPassword}: IInputProps) {
  return (
    <input
      className={styles.input}
      {...registerField(name, {required})}
      placeholder={placeholder}
      type={`${isPassword ? 'password' : 'text'}`}
    />
  )
}

export default Input