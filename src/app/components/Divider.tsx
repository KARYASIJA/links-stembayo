'use client'

import type { DividerProps } from '@/typings'

const Divider = ({ title }: DividerProps) => {
    return (
        <div className="flex items-center w-full">
            {title ? (
                <>
                    <hr className="w-full border-t border-black/50 my-6" />
                    <span className="min-w-fit px-4 line-clamp-1 font-semibold">{title}</span>
                    <hr className="w-full border-t border-black/50 my-6" />
                </>
            ) : (
                <hr className="w-full border-t border-black/50 my-6" />
            )}
        </div>
    );
};

export default Divider;
