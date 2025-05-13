import React from 'react';

type ButtonProps = {
    className?: string;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
    className,
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
}) => {
    const baseStyles = 'rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantStyles = {
        primary: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-blue-500 ',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 ',
        danger: 'bg-red-500 text-white hover:bg-red-700 focus:ring-red-500 ',
    };
    const sizeStyles = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const classes = [
        baseStyles,
        variantStyles[variant],
        sizeStyles[size as 'sm' | 'md' | 'lg'],
        disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={`${classes} ${className} ` } onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;