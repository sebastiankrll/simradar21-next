export function setHeight(e: React.MouseEvent<HTMLElement>, open: boolean) {
    const eventTarget = e.target as HTMLElement
    const parent = eventTarget.parentElement
    if (!parent) return

    if (open) {
        parent.style.height = ''
    } else {
        parent.style.height = parent.scrollHeight + 'px'
    }
}

// export function handleCollapse(childElement, states, open) {
//     if (open) {
//         childElement.style.height = ''
//         return states
//     }

//     const maxHeight = document.documentElement.clientHeight - 96
//     const childHeight = childElement.scrollHeight

//     childElement.style.height = childHeight + 'px'

//     const children = panelRef.current?.getElementsByClassName('info-panel-container')
//     const keys = Object.keys(states)

//     if (panelRef.current?.clientHeight + childHeight > maxHeight) {
//         for (let i = children.length - 1; i--; i >= 0) {
//             const child = children[i]
//             const newHeight = panelRef.current.clientHeight + childHeight - child.scrollHeight

//             if (child.classList.contains('open') && newHeight <= maxHeight) {
//                 child.style.height = ''
//                 states[keys[i]] = false
//                 break
//             }
//         }

//         return states
//     }

//     return states
// }