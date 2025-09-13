import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    startAdornment?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, name, className = '', startAdornment, ...props }) => {
    const hasAdornment = !!startAdornment;
    return (
        <div>
            <label htmlFor={name} className="block text-xs font-medium text-gray-400 uppercase mb-1">{label}</label>
            <div className="relative">
                {hasAdornment && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-400 sm:text-sm">{startAdornment}</span>
                    </div>
                )}
                <input
                    id={name}
                    name={name}
                    {...props}
                    className={`w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-1.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition disabled:opacity-50 ${hasAdornment ? 'pl-7' : ''} ${className}`}
                />
            </div>
        </div>
    );
};
