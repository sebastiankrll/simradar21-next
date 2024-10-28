import { useEffect, useRef, useState } from "react"
import './Marquee.css'

export default function Marquee({ children, speed = 20, delay = 5 }: { children: React.ReactNode, speed?: number, delay?: number }) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const contentRef = useRef<HTMLDivElement | null>(null)
    const [maxTranslate, setMaxTranslate] = useState<number>(0)

    useEffect(() => {
        const containerWidth = containerRef.current?.offsetWidth ?? 0
        const contentWidth = contentRef.current?.offsetWidth ?? 0

        setMaxTranslate(contentWidth - containerWidth)
    })

    const animationDuration = maxTranslate > 0 ? maxTranslate / speed + delay * 2 : 0
    const animationTimingFunction = animationDuration > 0 ? `linear(0 0%, 0 ${Math.round(delay * 2 / animationDuration * 100)}%, 1 100%)` : 'linear'

    return (
        <div className="marquee-wrapper" ref={containerRef}>
            <div className="marquee-offset">
                <div className="marquee-overflow">
                    <div className="marquee-content" ref={contentRef} style={{
                        "--max-translate": `-${maxTranslate}px`,
                        animationDuration: `${animationDuration}s`,
                        animationTimingFunction: animationTimingFunction
                    } as React.CSSProperties}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}