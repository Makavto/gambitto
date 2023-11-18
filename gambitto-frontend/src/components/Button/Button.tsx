import React, { MouseEvent } from 'react'
import { ButtonTypesEnum } from '../../utils/ButtonTypesEnum';
import styles from './Button.module.scss';

interface IButtonProps {
  children: React.ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: ButtonTypesEnum;
}

function Button({children,onClick,type}: IButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${
        type === ButtonTypesEnum.Link && styles.linkBtn
      } ${
        type === ButtonTypesEnum.Primary && styles.primaryBtn
      }`}
    >
      {children}
    </button>
  )
}

export default Button