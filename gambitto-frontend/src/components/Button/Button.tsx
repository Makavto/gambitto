import React, { MouseEvent, memo } from 'react'
import { ButtonTypesEnum } from '../../utils/ButtonTypesEnum';
import styles from './Button.module.scss';

interface IButtonProps {
  children: React.ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: ButtonTypesEnum;
}

const Button = memo(function Button({children,onClick,type}: IButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${
        type === ButtonTypesEnum.Link && styles.linkBtn
      } ${
        type === ButtonTypesEnum.Primary && styles.primaryBtn
      } ${
        type === ButtonTypesEnum.Danger && styles.dangerBtn
      }`}
    >
      {children}
    </button>
  )
})

export default Button