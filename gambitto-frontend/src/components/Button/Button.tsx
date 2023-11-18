import React, { MouseEvent } from 'react'

interface IButtonProps {
  children: React.ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

function Button({children,onClick}: IButtonProps) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  )
}

export default Button