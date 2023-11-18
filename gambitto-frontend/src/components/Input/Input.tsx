import React from 'react'
import styles from './Input.module.scss';
import { UseFormRegister } from 'react-hook-form';

interface IInputProps {
  registerField: UseFormRegister<any>;
  name: string;
  placeholder?: string;
  emptyMessage?: string;
}

function Input({placeholder,name,registerField,emptyMessage: required}: IInputProps) {
  return (
    <input className={styles.input} {...registerField(name, {required})} placeholder={placeholder} type="text" />
  )
}

export default Input