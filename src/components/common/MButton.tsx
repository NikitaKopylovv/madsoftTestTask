import React, { ButtonHTMLAttributes, MouseEventHandler } from 'react';

/** Здесь определяем базовые пропсы для кнопки и по необходимости добавляем новые */
interface MButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const MButton: React.FC<MButtonProps> = ({ children, ...props }) => {
    return <button {...props}>{children}</button>;
};

export default MButton;
