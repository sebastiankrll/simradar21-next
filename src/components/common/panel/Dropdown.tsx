import React, { useEffect, useRef } from "react";

export default function Dropdown(
    {
        open,
        minHeight,
        className,
        children
    }: {
        open: boolean,
        minHeight?: number,
        className?: string,
        children: React.ReactNode
    }
) {
    const dropdownRef = useRef<HTMLDivElement | null>(null)

    const setHeight = (ref: HTMLDivElement, open: boolean) => {
        if (open) {
            ref.style.height = ref.scrollHeight + 'px'
        } else {
            ref.style.height = minHeight ? `${minHeight}px` : ''
        }
    }

    useEffect(() => {
        if (!dropdownRef.current) return

        setHeight(dropdownRef.current, open)
    }, [open, children])

    return (
        <div className={`info-panel-container dropdown ${className || ""}${open ? ' open' : ''}`} ref={dropdownRef}>
            {children}
        </div>
    )
}