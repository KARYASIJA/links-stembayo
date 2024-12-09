import type { DividerProps } from '@/typings'

const Divider = ({ text }: DividerProps) => {
    return (
        <div className="flex items-center w-full">
            {text ? (
                <>
                    <hr className="w-full border-t border-black my-6" />
                    <span className="min-w-fit px-4 line-clamp-1 font-semibold">{text}</span>
                    <hr className="w-full border-t border-black my-6" />
                </>
            ) : (
                <hr className="w-full border-t border-black my-6" />
            )}
        </div>
    );
};

export default Divider;
