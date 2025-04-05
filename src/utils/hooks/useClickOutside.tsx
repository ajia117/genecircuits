import { useEffect } from "react";

function useClickOutside(ref: React.RefObject<HTMLElement>, onClickOutside: () => void) {
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
                onClickOutside();
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [ref, onClickOutside]);
}

export default useClickOutside;
