import {useEffect, useRef, useState} from "react";
import "./MouseParallax.css";
import HoverDialogue from "./components/HoverDialogue.tsx";
import spaceImage from "./assets/space.webp";
import ramBackImage from "./assets/ram_back.webp";
import nalphaAriesImage from "./assets/nalpha_aries.webp";
import ramFrontImage from "./assets/ram_front.webp";
import handsImage from "./assets/hands.webp";

type MousePosition = {
    x: number;
    y: number;
};

const TEXT_LINES: Array<{text: string; className?: string}> = [
    {text: "Only in extreme isolation would the fantasies of reality reveal themselves."},
    {
        text: "Detached from his gravitational anchor, a lone astronaut drifting through void was greeted by a peculiar voyage: the celestial shepherd Aries, was seen herding her fellow Arietids Rams through the cosmic fields, in search of a safe haven to shed their golden fleece.",
    },
    {
        text: "In about a month, their path shall meet with a planet known as Earth - where Gaia shears their wool by setting them ablaze with divine flame, dragging trails of auric stardust for men and machines to behold.",
    },
    {
        text: "However, their journey resumes swiftly, as they must press on to graze on stars and galaxies, till they return with their brilliance next year.",
    },
    {
        text: "On your left is an image retrieved from the camera of our lost comrade, 84 years after his disappearance. Captured on April 15th, 2026, it is the only image evidence of the sacred cosmic shepherd - now given the Bayer Designation of Nα Arietis.",
        className: "hidden 2xl:block",
    },
    {
        text: "Above is an image retrieved from the camera of our lost comrade, 84 years after his disappearance. Captured on April 15th, 2026, it is the only image evidence of the sacred cosmic shepherd - now given the Bayer Designation of Nα Arietis.",
        className: "block 2xl:hidden",
    },
];

export default function MouseParallax() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const frameRef = useRef<number | null>(null);
    const mouseRef = useRef<MousePosition>({x: 0, y: 0});
    const [visibleLineCount, setVisibleLineCount] = useState(0);
    const [isLineFiveFadeComplete, setIsLineFiveFadeComplete] = useState(false);
    const layerFadeClass = "transition-all duration-1000";
    const [handFocus, setHandFocus] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateVars = (x: number, y: number) => {
            container.style.setProperty("--mx", x.toString());
            container.style.setProperty("--my", y.toString());
        };

        const handleMouseMove = (e: MouseEvent): void => {
            const rect = container.getBoundingClientRect();

            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            mouseRef.current = {x, y};

            if (frameRef.current !== null) return;

            frameRef.current = window.requestAnimationFrame(() => {
                const {x, y} = mouseRef.current;
                updateVars(x, y);
                frameRef.current = null;
            });
        };

        const handleMouseLeave = (): void => {
            mouseRef.current = {x: 0, y: 0};

            if (frameRef.current !== null) return;

            frameRef.current = window.requestAnimationFrame(() => {
                updateVars(0, 0);
                frameRef.current = null;
            });
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);

            if (frameRef.current !== null) {
                window.cancelAnimationFrame(frameRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (visibleLineCount >= TEXT_LINES.length) return;

        if (visibleLineCount === 0) {
            const firstLineTimeoutId = window.setTimeout(() => {
                setVisibleLineCount(1);
            }, 100);

            return () => {
                window.clearTimeout(firstLineTimeoutId);
            };
        }

        const currentLineText = TEXT_LINES[visibleLineCount - 1]?.text ?? "";
        const wordCount = currentLineText.trim().split(/\s+/).filter(Boolean).length;
        const averageReadingWpm = 100;
        const estimatedReadTimeMs = Math.round((wordCount / averageReadingWpm) * 60_000);
        const baseDelayMs = Math.min(12_000, Math.max(2_000, estimatedReadTimeMs + 600));
        const delayMs = visibleLineCount === 1 ? 5_000 : baseDelayMs;

        const timeoutId = window.setTimeout(() => {
            setVisibleLineCount((prev) => {
                const step = prev === TEXT_LINES.length - 2 ? 2 : 1;
                return Math.min(prev + step, TEXT_LINES.length);
            });
        }, delayMs);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [visibleLineCount]);

    useEffect(() => {
        if (visibleLineCount < 5 || isLineFiveFadeComplete) return;

        const lineFiveFadeTimeoutId = window.setTimeout(() => {
            setIsLineFiveFadeComplete(true);
        }, 1000);

        return () => {
            window.clearTimeout(lineFiveFadeTimeoutId);
        };
    }, [visibleLineCount, isLineFiveFadeComplete]);

    const isRamVisible =
        visibleLineCount >= 2 &&
        visibleLineCount !== 4 &&
        (visibleLineCount < 5 || isLineFiveFadeComplete);
    const areHoverDialoguesEnabled =
        visibleLineCount >= 5 && isLineFiveFadeComplete;
    const canSkipSequence = !areHoverDialoguesEnabled;

    const handleSkipSequence = () => {
        setVisibleLineCount(TEXT_LINES.length);
        setIsLineFiveFadeComplete(true);
    };

    useEffect(() => {
        const {body, documentElement} = document;
        const previousBodyOverflow = body.style.overflow;
        const previousHtmlOverflow = documentElement.style.overflow;

        body.style.overflow = "hidden";
        documentElement.style.overflow = "hidden";

        return () => {
            body.style.overflow = previousBodyOverflow;
            documentElement.style.overflow = previousHtmlOverflow;
        };
    }, []);

    return (
        <div className={"flex flex-col 2xl:flex-row parallax w-screen h-screen justify-start items-center bg-gray-950"}>
            <div className={'relative w-[calc(min(150vh,100vw))] h-[calc(min(66.666vw,100vh))]'}>
                <img
                    src={spaceImage}
                    className={`absolute w-full h-full ${layerFadeClass} ${visibleLineCount >= 3 ? "opacity-100" : "opacity-0"} 
                        mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]
                        `}
                    alt={'img'}
                />
                <div ref={containerRef} className="relative w-full h-full overflow-hidden">
                    <div className="layer bg">
                        <img
                            src={ramBackImage}
                            className={`${layerFadeClass} ${isRamVisible ? "opacity-100" : "opacity-0"} 2xl:size-full absolute -bottom-3
                                mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]`}
                            alt={'img'}
                        />
                        <div className={'absolute right-0 top-[28.3%] w-[40.3%] h-[37.2%]'}>
                            <HoverDialogue move={'top-0 left-full'} enabled={areHoverDialoguesEnabled}>
                                <>
                                    <p>Arietids</p>
                                    <p>One of the strongest daytime meteor showers,</p>
                                    <p>lasting from May 22nd to July 2nd. Due to the</p>
                                    <p>interference of the Sun, observatories on Earth</p>
                                    <p>mostly study them through radio spectrum.</p>
                                    <p>However, this image has given us more insight</p>
                                    <p>on the true nature of the meteor shower.</p>
                                </>
                            </HoverDialogue>
                        </div>
                    </div>
                    <div className="layer mid">
                        <img
                            src={nalphaAriesImage}
                            className={`${layerFadeClass} ${visibleLineCount >= 5 ? "opacity-100" : "opacity-0"} 2xl:size-full absolute -bottom-6
                                mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]`}
                            alt={'img'}
                        />
                        <div className={'absolute left-[39.8%] top-[7.6%] w-[27.2%] h-[64.1%]'}>
                            <HoverDialogue move={'top-0 left-full'} enabled={areHoverDialoguesEnabled}>
                                <>
                                    <p>The celestial shepherd Nα Arietis.</p>
                                    <p>Her true identity remain one of - if not the biggest</p>
                                    <p>mystery to our universe.</p>
                                    <br/>
                                    <p>Hopefully, we shall meet again someday.</p>
                                </>
                            </HoverDialogue>
                        </div>
                    </div>
                    <div className="layer mid2">
                        <img
                            src={ramFrontImage}
                            className={`${layerFadeClass} ${isRamVisible ? "opacity-100" : "opacity-0"} 2xl:size-full absolute -bottom-9
                                mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]`}
                            alt={'img'}
                        />
                        <div className={'absolute left-[35%] top-[59.9%] w-[40.3%] h-[37.2%]'}>
                            <HoverDialogue move={'top-0 left-4/5'} enabled={areHoverDialoguesEnabled}>
                                <>
                                    <p>Arietids</p>
                                    <p>One of the strongest daytime meteor showers,</p>
                                    <p>lasting from May 22nd to July 2nd. Due to the</p>
                                    <p>interference of the Sun, observatories on Earth</p>
                                    <p>mostly study them through radio spectrum.</p>
                                    <p>However, this image has given us more insight</p>
                                    <p>on the true nature of the meteor shower.</p>
                                </>
                            </HoverDialogue>
                        </div>
                    </div>
                    <div className={`absolute size-full transition-all duration-1000 ${handFocus ? 'backdrop-blur-xs' : 'backdrop-blur-none'} pointer-events-none`} />
                    <div className="layer fg">
                        <img
                            src={handsImage}
                            className={`2xl:size-full absolute -bottom-12 ${layerFadeClass} ${visibleLineCount >= 1 ? "opacity-100" : "opacity-0"} ${handFocus ? 'blur-none' : 'blur-xs'}`}
                            alt={'img'}
                        />
                        <div className={'absolute left-0 top-[49.7%] w-[30%] h-[55.5%]'} onMouseEnter={() => setHandFocus(true)} onMouseLeave={() => setHandFocus(false)}>
                            <HoverDialogue move={'top-20 left-full'} enabled={areHoverDialoguesEnabled}>
                                <>
                                    <p>A lost astronaut whose identity was bleached and sandblasted by the passage of time.</p>
                                    <br/>
                                    <p>Theorized cause of disappearance:</p>
                                    <p>Stray space debris puncturing the propulsion fuel reservoir, causing sudden</p>
                                    <p>acceleration, thus breaking out of the spacecraft's gravitational tether.</p>
                                    <br/>
                                    <p>Estimated time of death:</p>
                                    <p>- 1-2 weeks after the accident</p>
                                    <br/>
                                    <p>Theorized cause of death:</p>
                                    <p>- Prolonged dehydration</p>
                                </>
                            </HoverDialogue>
                        </div>
                        <div className={'absolute right-0 top-[49.7%] w-[30%] h-[55.5%]'} onMouseEnter={() => setHandFocus(true)} onMouseLeave={() => setHandFocus(false)}>
                            <HoverDialogue move={'top-20 right-full'} enabled={areHoverDialoguesEnabled}>
                                <>
                                    <p>A lost astronaut whose identity was bleached and sandblasted by the passage of time.</p>
                                    <br/>
                                    <p>Theorized cause of disappearance:</p>
                                    <p>Stray space debris puncturing the propulsion fuel reservoir, causing sudden</p>
                                    <p>acceleration, thus breaking out of the spacecraft's gravitational tether.</p>
                                    <br/>
                                    <p>Estimated time of death:</p>
                                    <p>- 1-2 weeks after the accident</p>
                                    <br/>
                                    <p>Theorized cause of death:</p>
                                    <p>- Prolonged dehydration</p>
                                </>
                            </HoverDialogue>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'flex flex-col flex-1 min-w-0 h-full justify-center'}>
                <div className={'flex-1'} />
                <div className={'relative flex flex-col text-white w-full text-center gap-3 p-4'}>
                    {TEXT_LINES.map((line, index) => (
                        <p
                            key={`${line.text.slice(0, 32)}-${index}`}
                            className={`${line.className ?? ""} transition-opacity duration-1000 ${index < visibleLineCount ? "opacity-100" : "opacity-0"}`}
                        >
                            {line.text}
                        </p>
                    ))}
                </div>
                <div className={'flex-1'} />
                <div className={'flex flex-row p-2'}>
                    {canSkipSequence && (
                        <div className={'flex flex-row w-full justify-end'}>
                            <button
                                type="button"
                                onClick={handleSkipSequence}
                                className="rounded border border-white/60 bg-black/40 px-3 py-1 text-sm text-white transition-colors hover:bg-white/20 cursor-pointer"
                            >
                                Skip {'>>'}
                            </button>
                        </div>
                    )}
                    {!canSkipSequence && (
                        <div className={'flex flex-row text-white justify-around w-full'}>
                            <p>Illustration by <a href={'https://x.com/HimuraSoichiro'} className={'text-yellow-500'}>HimuraSoichiro</a></p>
                            <p>Everything else by Ticxo</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}