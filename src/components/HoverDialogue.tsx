import {type JSX, useEffect, useState, useRef} from "react";
import {createPortal} from "react-dom";

interface Props {
    className?: string
    children: JSX.Element
    move?: string
    enabled?: boolean
}

export default function HoverDialogue({className, children, move, enabled = true}: Props) {
    const anchorRef = useRef<HTMLDivElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

    const updateAnchorRect = () => {
        if (!anchorRef.current) return;
        setAnchorRect(anchorRef.current.getBoundingClientRect());
    };

    useEffect(() => {
        if (!enabled || !isHovered) return;

        updateAnchorRect();
        window.addEventListener("scroll", updateAnchorRect, true);
        window.addEventListener("resize", updateAnchorRect);

        return () => {
            window.removeEventListener("scroll", updateAnchorRect, true);
            window.removeEventListener("resize", updateAnchorRect);
        };
    }, [enabled, isHovered]);

    return (
        <div
            ref={anchorRef}
            className={`${className} ${enabled ? "pointer-events-auto" : "pointer-events-none"} w-full h-full`}
            onMouseEnter={() => enabled && setIsHovered(true)}
            onMouseLeave={() => enabled && setIsHovered(false)}
            onMouseMove={() => enabled && updateAnchorRect()}
        >
            <div className={'relative'}>
                <div className={'peer'} />
                {anchorRect && createPortal(
                    <div
                        style={{
                            position: "fixed",
                            top: anchorRect.top,
                            left: anchorRect.left,
                            width: anchorRect.width,
                            height: anchorRect.height,
                            pointerEvents: "none",
                            zIndex: 99999
                        }}
                    >
                        <div className={`transition-opacity duration-300 absolute ${isHovered ? "opacity-100" : "opacity-0"}
                        ${move || 'top-0 left-10'}
                        bg-blue-800/50 w-fit h-fit text-nowrap text-white pointer-events-none py-1 px-2 rounded-lg backdrop-blur-md`}>
                            {children}
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </div>
    );
};