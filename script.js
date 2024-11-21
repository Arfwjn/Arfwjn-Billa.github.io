const sheets = document.getElementsByClassName("sheet")
const pages = document.querySelectorAll(".page")
const book = document.getElementsByClassName("book")[0]

let isFromTop = false
let isFromLeft = false

for (let j = 0; j < pages.length; j++) {
    pages[j].style.zIndex = `${j}`

    // pages[j].addEventListener("mouseenter", () => {
    //     book.style.translate = "0 -30px"
    // })

    // pages[j].addEventListener("mouseleave", () => {
    //     book.style.translate = "0 0"
    // })
}

for (let j = 0; j < sheets.length; j++) {
    const sheetRect = sheets[j].getBoundingClientRect()
    sheets[j].addEventListener("dragstart", (e) => {
        const img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
        e.dataTransfer.setDragImage(img, 0, 0);
        if (j == sheets.length - 1 && pages[0].style.translate == "100%") {
            return
        }

        if (pages[j * 2].style.translate, pages[j * 2 + 1].style.translate != "100%") {
            isFromLeft = true
            pages[j * 2].style.clipPath = `polygon(0 0, 0 0, 0 0, 0 0`;
            pages[j * 2].style.boxShadow = "0 10px 20px 5px black"
            if (e.clientY < sheetRect.top + sheetRect.height / 2) {
                pages[j * 2].style.transformOrigin = `100% 0`
                pages[j * 2].style.transform = 'rotate(90deg)'
                pages[j * 2].style.translate = `-100% 0`
                isFromTop = true
            } else {
                pages[j * 2].style.transformOrigin = `100% 100%`
                pages[j * 2].style.transform = 'rotate(-90deg)'
                pages[j * 2].style.translate = `-100% 0`
                isFromTop = false
            }
            pages[j * 2].style.zIndex = `${pages.length * 2 - (j * 2 + 1)}`
        } else {
            isFromLeft = false
            pages[j * 2 + 1].style.clipPath = `polygon(0 0, 0 0, 0 0, 0 0`;
            pages[j * 2 + 1].style.boxShadow = "0 -10px 20px 5px black"
            if (e.clientY < sheetRect.top + sheetRect.height / 2) {
                pages[j * 2 + 1].style.transformOrigin = '0 0'
                pages[j * 2 + 1].style.transform = 'rotate(-90deg)'
                pages[j * 2 + 1].style.translate = `200% 0`
                isFromTop = true
            } else {
                pages[j * 2 + 1].style.transformOrigin = '0 100%'
                pages[j * 2 + 1].style.transform = 'rotate(90deg)'
                pages[j * 2 + 1].style.translate = '200% 0'
                isFromTop = false
            }
            pages[j * 2 + 1].style.zIndex = `${pages.length * 2 - (j * 2)}`
        }
    })

    sheets[j].addEventListener("drag", (e) => {
        if (j == sheets.length - 1 && pages[0].style.translate == "100%") {
            return
        }

        const x = e.clientX
        const y = e.clientY

        if (isFromLeft) {
            if (isFromTop) {
                const diffX = x - sheetRect.left
                const diffY = y - sheetRect.top
                let minDeg = 999
                let minDiff = 9999999999
                let minWidth = 9999999999
                let minWidth2 = 9999999999
                let minHeight = 9999999999
                let minOverlapX = 999999
                let minOverlapY = 999999
                let minOverlapX2 = 999999
                if (y > sheetRect.top) {
                    for (let i = -1 * (Math.PI / 2); i < Math.PI / 2; i += 0.001) {
                        let currDiffWidth = 99999
                        let currDiffHeight = 99999
                        let currDiffWidth2 = 99999
                        const overlapX = (diffY) / Math.tan((Math.PI / 2) - i) + x
                        const overlapY = y - (diffX) * Math.tan(i)
                        if (overlapX > sheetRect.left && overlapX < sheetRect.right) {
                            if (overlapY > sheetRect.top && overlapY < sheetRect.bottom) {
                                const currWidth = Math.abs((diffY) / Math.sin((Math.PI / 2) - i)) + sheetRect.right - overlapX
                                currDiffWidth = Math.abs(sheetRect.width - currWidth)
                                const currHeight = Math.abs((diffX) / Math.cos(i)) + sheetRect.bottom - overlapY
                                currDiffHeight = Math.abs(sheetRect.height - currHeight)
                                if (currDiffHeight > 0 && currDiffWidth > 0 && (currDiffHeight + currDiffWidth) < minDiff && (currDiffHeight + currDiffWidth) < 5) {
                                    minDiff = (currDiffHeight + currDiffWidth)
                                    minWidth = Math.abs((diffY) / Math.sin((Math.PI / 2) - i))
                                    minHeight = Math.abs((diffX) / Math.cos(i))
                                    minOverlapX = overlapX
                                    minOverlapY = overlapY
                                    minDeg = i
                                }
                            } else if (overlapY > sheetRect.bottom) {
                                const x2 = x - sheetRect.height * Math.sin((Math.PI / 2) + i)
                                const y2 = y + sheetRect.height * Math.cos((Math.PI / 2) + i)
                                const currWidth = Math.abs((diffY) / Math.sin((Math.PI / 2) - i)) + sheetRect.right - overlapX
                                currDiffWidth = Math.abs(sheetRect.width - currWidth)
                                const overlapX2 = x2 - (y2 - sheetRect.bottom) / Math.tan((Math.PI / 2) + i)
                                const currWidth2 = sheetRect.right - overlapX2 + Math.abs((y2 - sheetRect.bottom) / Math.sin((Math.PI / 2) + i))
                                currDiffWidth2 = Math.abs(currWidth2 - sheetRect.width)
                                if (currDiffWidth2 > 0 && currDiffWidth > 0 && (currDiffWidth + currDiffWidth2) < minDiff) {
                                    minDiff = currDiffWidth + currDiffWidth2
                                    minWidth = Math.abs((diffY) / Math.sin((Math.PI / 2) - i))
                                    minWidth2 = Math.abs((y2 - sheetRect.bottom) / Math.sin((Math.PI / 2) + i))
                                    minOverlapX = overlapX
                                    minOverlapX2 = overlapX2
                                    minDeg = i
                                }
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < Math.PI / 2; i += 0.001) {
                        let currDiffWidth = 99999
                        let currDiffWidth2 = 99999
                        const overlapX = x - (sheetRect.top - y) / Math.tan((Math.PI / 2) - i)
                        const x2 = x + sheetRect.height * Math.cos(i)
                        const y2 = y + sheetRect.height * Math.sin(i)
                        const overlapX2 = x2 - (sheetRect.bottom - y2) * Math.tan(i)
                        if (overlapX > sheetRect.left && overlapX < sheetRect.right && overlapX2 > sheetRect.left && overlapX2 < sheetRect.right) {
                            const currWidth = Math.abs((sheetRect.top - y) / Math.sin((Math.PI / 2) - i)) + sheetRect.right - overlapX
                            currDiffWidth = Math.abs(sheetRect.width - currWidth)
                            const currWidth2 = sheetRect.right - overlapX2 + Math.abs((sheetRect.bottom - y2) / Math.cos(i))
                            currDiffWidth2 = Math.abs(currWidth2 - sheetRect.width)
                            if (currDiffWidth > 0 && currDiffWidth2 > 0 && (currDiffWidth + currDiffWidth2) < minDiff) {
                                minDiff = currDiffWidth + currDiffWidth2
                                minWidth = Math.abs((sheetRect.top - y) / Math.sin((Math.PI / 2) - i))
                                minWidth2 = Math.abs((sheetRect.bottom - y2) / Math.cos(i))
                                minOverlapX = overlapX
                                minOverlapX2 = overlapX2
                                minDeg = i - Math.PI
                            }
                        }
                    }
                }

                if (minWidth < sheetRect.width) {
                    if (minHeight < sheetRect.height) {
                        pages[j * 2].style.translate = `${diffX - sheetRect.width}px ${diffY}px`
                        if (minDeg != 999) {
                            pages[j * 2].style.clipPath = `polygon(${sheetRect.width - minWidth}px 0, 105% -10px, 100% ${minHeight}px)`
                            pages[j * 2 + 1].style.clipPath = `polygon(${minOverlapX - sheetRect.left}px 0, 100% 0, 100% 100%, 0 100%, 0 ${minOverlapY - sheetRect.top}px)`
                            pages[j * 2].style.transform = `rotate(${(90 + (minDeg * 180 / Math.PI))}deg)`
                        }
                    } else if (minWidth2 < sheetRect.width) {
                        pages[j * 2].style.translate = `${diffX - sheetRect.width}px ${diffY}px`
                        if (minDeg != 999) {
                            pages[j * 2].style.clipPath = `polygon(${sheetRect.width - minWidth}px 0, 105% -10px, 105% 105%, ${sheetRect.width - minWidth2}px 100%`;
                            pages[j * 2 + 1].style.clipPath = `polygon(${minOverlapX - sheetRect.left}px 0, 100% 0, 100% 100%, ${minOverlapX2 - sheetRect.left}px 100%)`
                            pages[j * 2].style.transform = `rotate(${(90 + (minDeg * 180 / Math.PI))}deg)`
                        }
                    }
                }
            } else {
                const diffX = x - sheetRect.left
                const diffY = sheetRect.bottom - y
                let minDeg = 999
                let minDiff = 9999999999
                let minWidth = 9999999999
                let minWidth2 = 9999999999
                let minHeight = 9999999999
                let minOverlapX = 999999
                let minOverlapY = 999999
                let minOverlapX2 = 999999
                if (y < sheetRect.bottom) {
                    for (let i = -1 * (Math.PI / 2); i < Math.PI / 2; i += 0.001) {
                        let currDiffWidth = 99999
                        let currDiffHeight = 99999
                        let currDiffWidth2 = 99999
                        const overlapX = (diffY) / Math.tan((Math.PI / 2) - i) + x
                        const overlapY = y + (diffX) * Math.tan(i)
                        if (overlapX > sheetRect.left && overlapX < sheetRect.right) {
                            if (overlapY > sheetRect.top && overlapY < sheetRect.bottom) {
                                const currWidth = Math.abs((diffY) / Math.sin((Math.PI / 2) - i)) + sheetRect.right - overlapX
                                currDiffWidth = Math.abs(sheetRect.width - currWidth)
                                const currHeight = Math.abs((diffX) / Math.cos(i)) + overlapY - sheetRect.top
                                currDiffHeight = Math.abs(sheetRect.height - currHeight)
                                if (currDiffHeight > 0 && currDiffWidth > 0 && (currDiffHeight + currDiffWidth) < minDiff && (currDiffHeight + currDiffWidth) < 5) {
                                    minDiff = (currDiffHeight + currDiffWidth)
                                    minWidth = Math.abs((diffY) / Math.sin((Math.PI / 2) - i))
                                    minHeight = Math.abs((diffX) / Math.cos(i))
                                    minOverlapX = overlapX
                                    minOverlapY = overlapY
                                    minDeg = i
                                }
                            } else if (overlapY < sheetRect.top) {
                                const x2 = x - sheetRect.height * Math.sin((Math.PI / 2) + i)
                                const y2 = y - sheetRect.height * Math.cos((Math.PI / 2) + i)
                                const currWidth = Math.abs((diffY) / Math.sin((Math.PI / 2) - i)) + sheetRect.right - overlapX
                                currDiffWidth = Math.abs(sheetRect.width - currWidth)
                                const overlapX2 = x2 - (sheetRect.top - y2) / Math.tan((Math.PI / 2) + i)
                                const currWidth2 = sheetRect.right - overlapX2 + Math.abs((sheetRect.top - y2) / Math.sin((Math.PI / 2) + i))
                                currDiffWidth2 = Math.abs(currWidth2 - sheetRect.width)
                                if (currDiffWidth2 > 0 && currDiffWidth > 0 && (currDiffWidth + currDiffWidth2) < minDiff) {
                                    minDiff = currDiffWidth + currDiffWidth2
                                    minWidth = Math.abs((diffY) / Math.sin((Math.PI / 2) - i))
                                    minWidth2 = Math.abs((sheetRect.top - y2) / Math.sin((Math.PI / 2) + i))
                                    minOverlapX = overlapX
                                    minOverlapX2 = overlapX2
                                    minDeg = i
                                }
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < Math.PI / 2; i += 0.001) {
                        let currDiffWidth = 99999
                        let currDiffWidth2 = 99999
                        const overlapX = x - (y - sheetRect.bottom) / Math.tan((Math.PI / 2) - i)
                        const x2 = x + sheetRect.height * Math.cos(i)
                        const y2 = y - sheetRect.height * Math.sin(i)
                        const overlapX2 = x2 - (y2 - sheetRect.top) * Math.tan(i)
                        if (overlapX > sheetRect.left && overlapX < sheetRect.right && overlapX2 > sheetRect.left && overlapX2 < sheetRect.right) {
                            const currWidth = Math.abs((y - sheetRect.bottom) / Math.sin((Math.PI / 2) - i)) + sheetRect.right - overlapX
                            currDiffWidth = Math.abs(sheetRect.width - currWidth)
                            const currWidth2 = sheetRect.right - overlapX2 + Math.abs((y2 - sheetRect.top) / Math.cos(i))
                            currDiffWidth2 = Math.abs(currWidth2 - sheetRect.width)
                            if (currDiffWidth > 0 && currDiffWidth2 > 0 && (currDiffWidth + currDiffWidth2) < minDiff) {
                                minDiff = currDiffWidth + currDiffWidth2
                                minWidth = Math.abs((y - sheetRect.bottom) / Math.sin((Math.PI / 2) - i))
                                minWidth2 = Math.abs((y2 - sheetRect.top) / Math.cos(i))
                                minOverlapX = overlapX
                                minOverlapX2 = overlapX2
                                minDeg = i - Math.PI
                            }
                        }
                    }
                }

                if (minWidth < sheetRect.width) {
                    if (minHeight < sheetRect.height) {
                        pages[j * 2].style.translate = `${diffX - sheetRect.width}px ${-diffY}px`
                        if (minDeg != 999) {
                            pages[j * 2].style.clipPath = `polygon(${sheetRect.width - minWidth}px 100%, 105% 105%, 100% ${sheetRect.height - minHeight}px)`
                            pages[j * 2 + 1].style.clipPath = `polygon(0 0, 100% 0, 100% 100%, ${minOverlapX - sheetRect.left}px 100%, 0 ${minOverlapY - sheetRect.top}px)`
                            pages[j * 2].style.transform = `rotate(${-(90 + (minDeg * 180 / Math.PI))}deg)`
                        }
                    } else if (minWidth2 < sheetRect.width) {
                        pages[j * 2].style.translate = `${diffX - sheetRect.width}px ${-diffY}px`
                        if (minDeg != 999) {
                            pages[j * 2].style.clipPath = `polygon(105% -10px, 105% 105%, ${sheetRect.width - minWidth}px 100%, ${sheetRect.width - minWidth2}px 0`;
                            pages[j * 2 + 1].style.clipPath = `polygon(100% 0%, 100% 100%, ${minOverlapX - sheetRect.left}px 100%, ${minOverlapX2 - sheetRect.left}px 0)`
                            pages[j * 2].style.transform = `rotate(${-((90 + (minDeg * 180 / Math.PI)))}deg)`
                        }
                    }
                }
            }
        } else {
            if (isFromTop) {
                const diffX = sheetRect.right + sheetRect.width - x
                const diffY = y - sheetRect.top
                let minDeg = 999
                let minDiff = 9999999999
                let minWidth = 9999999999
                let minWidth2 = 9999999999
                let minHeight = 9999999999
                let minOverlapX = 999999
                let minOverlapY = 999999
                let minOverlapX2 = 999999
                if (y > sheetRect.top) {
                    for (let i = -1 * (Math.PI / 2); i < Math.PI / 2; i += 0.001) {
                        let currDiffWidth = 99999
                        let currDiffHeight = 99999
                        let currDiffWidth2 = 99999
                        const overlapX = x - (diffY) / Math.tan((Math.PI / 2) - i)
                        const overlapY = y - (diffX) * Math.tan(i)
                        if (overlapX > sheetRect.right && overlapX < (sheetRect.right + sheetRect.width)) {
                            if (overlapY > sheetRect.top && overlapY < sheetRect.bottom) {
                                const currWidth = Math.abs((diffY) / Math.sin((Math.PI / 2) - i)) + overlapX - sheetRect.right
                                currDiffWidth = Math.abs(sheetRect.width - currWidth)
                                const currHeight = Math.abs((diffX) / Math.cos(i)) + sheetRect.bottom - overlapY
                                currDiffHeight = Math.abs(sheetRect.height - currHeight)
                                if (currDiffHeight > 0 && currDiffWidth > 0 && (currDiffHeight + currDiffWidth) < minDiff && (currDiffHeight + currDiffWidth) < 5) {
                                    minDiff = (currDiffHeight + currDiffWidth)
                                    minWidth = Math.abs((diffY) / Math.sin((Math.PI / 2) - i))
                                    minHeight = Math.abs((diffX) / Math.cos(i))
                                    minOverlapX = overlapX
                                    minOverlapY = overlapY
                                    minDeg = i
                                }
                            } else if (overlapY > sheetRect.bottom) {
                                const x2 = x + sheetRect.height * Math.sin((Math.PI / 2) + i)
                                const y2 = y + sheetRect.height * Math.cos((Math.PI / 2) + i)
                                const currWidth = Math.abs((diffY) / Math.sin((Math.PI / 2) - i)) + overlapX - sheetRect.right
                                currDiffWidth = Math.abs(sheetRect.width - currWidth)
                                const overlapX2 = x2 + (y2 - sheetRect.bottom) / Math.tan((Math.PI / 2) + i)
                                const currWidth2 = overlapX2 - sheetRect.right + Math.abs((y2 - sheetRect.bottom) / Math.sin((Math.PI / 2) + i))
                                currDiffWidth2 = Math.abs(currWidth2 - sheetRect.width)
                                if (currDiffWidth2 > 0 && currDiffWidth > 0 && (currDiffWidth + currDiffWidth2) < minDiff) {
                                    minDiff = currDiffWidth + currDiffWidth2
                                    minWidth = Math.abs((diffY) / Math.sin((Math.PI / 2) - i))
                                    minWidth2 = Math.abs((y2 - sheetRect.bottom) / Math.sin((Math.PI / 2) + i))
                                    minOverlapX = overlapX
                                    minOverlapX2 = overlapX2
                                    minDeg = i
                                }
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < Math.PI / 2; i += 0.001) {
                        let currDiffWidth = 99999
                        let currDiffWidth2 = 99999
                        const overlapX = x + (sheetRect.top - y) / Math.tan((Math.PI / 2) - i)
                        const x2 = x - sheetRect.height * Math.cos(i)
                        const y2 = y + sheetRect.height * Math.sin(i)
                        const overlapX2 = x2 + (sheetRect.bottom - y2) * Math.tan(i)
                        if (overlapX > sheetRect.right && overlapX < (sheetRect.right + sheetRect.width) && overlapX2 > sheetRect.right && overlapX2 < (sheetRect.right + sheetRect.width)) {
                            const currWidth = Math.abs((sheetRect.top - y) / Math.sin((Math.PI / 2) - i)) + overlapX - sheetRect.right
                            currDiffWidth = Math.abs(sheetRect.width - currWidth)
                            const currWidth2 = overlapX2 - sheetRect.right + Math.abs((sheetRect.bottom - y2) / Math.cos(i))
                            currDiffWidth2 = Math.abs(currWidth2 - sheetRect.width)
                            if (currDiffWidth > 0 && currDiffWidth2 > 0 && (currDiffWidth + currDiffWidth2) < minDiff) {
                                minDiff = currDiffWidth + currDiffWidth2
                                minWidth = Math.abs((sheetRect.top - y) / Math.sin((Math.PI / 2) - i))
                                minWidth2 = Math.abs((sheetRect.bottom - y2) / Math.cos(i))
                                minOverlapX = overlapX
                                minOverlapX2 = overlapX2
                                minDeg = i - Math.PI
                            }
                        }
                    }
                }

                if (minWidth < sheetRect.width) {
                    if (minHeight < sheetRect.height) {
                        pages[j * 2 + 1].style.translate = `${2 * sheetRect.width - diffX}px ${diffY}px`
                        if (minDeg != 999) {
                            pages[j * 2 + 1].style.clipPath = `polygon(-10px -10px, ${minWidth}px 0, 0 ${minHeight}px)`
                            pages[j * 2].style.clipPath = `polygon(0 0, ${minOverlapX - sheetRect.right}px 0%, 100% ${minOverlapY - sheetRect.top}px, 100% 100%, 0 100%)`
                            pages[j * 2 + 1].style.transform = `rotate(${-(90 + (minDeg * 180 / Math.PI))}deg)`
                        }
                    } else if (minWidth2 < sheetRect.width) {
                        pages[j * 2 + 1].style.translate = `${2 * sheetRect.width - diffX}px ${diffY}px`
                        if (minDeg != 999) {
                            pages[j * 2 + 1].style.clipPath = `polygon(-10px -10px, ${minWidth}px 0, ${minWidth2}px 100%, -10px 105%)`
                            pages[j * 2].style.clipPath = `polygon(0 0, ${minOverlapX - sheetRect.right}px 0%, ${minOverlapX2 - sheetRect.right}px 100%, 0 100%)`
                            pages[j * 2 + 1].style.transform = `rotate(${-(90 + (minDeg * 180 / Math.PI))}deg)`
                        }
                    }
                }
            } else {
                const diffX = sheetRect.right + sheetRect.width - x
                const diffY = sheetRect.bottom - y
                let minDeg = 999
                let minDiff = 9999999999
                let minWidth = 9999999999
                let minWidth2 = 9999999999
                let minHeight = 9999999999
                let minOverlapX = 999999
                let minOverlapY = 999999
                let minOverlapX2 = 999999
                if (y < sheetRect.bottom) {
                    for (let i = -1 * (Math.PI / 2); i < Math.PI / 2; i += 0.001) {
                        let currDiffWidth = 99999
                        let currDiffHeight = 99999
                        let currDiffWidth2 = 99999
                        const overlapX = x - (diffY) / Math.tan((Math.PI / 2) - i)
                        const overlapY = y + (diffX) * Math.tan(i)
                        if (overlapX > sheetRect.right && overlapX < (sheetRect.right + sheetRect.width)) {
                            if (overlapY > sheetRect.top && overlapY < sheetRect.bottom) {
                                const currWidth = Math.abs((diffY) / Math.sin((Math.PI / 2) - i)) + overlapX - sheetRect.right
                                currDiffWidth = Math.abs(sheetRect.width - currWidth)
                                const currHeight = Math.abs((diffX) / Math.cos(i)) + overlapY - sheetRect.top
                                currDiffHeight = Math.abs(sheetRect.height - currHeight)
                                if (currDiffHeight > 0 && currDiffWidth > 0 && (currDiffHeight + currDiffWidth) < minDiff && (currDiffHeight + currDiffWidth) < 5) {
                                    minDiff = (currDiffHeight + currDiffWidth)
                                    minWidth = Math.abs((diffY) / Math.sin((Math.PI / 2) - i))
                                    minHeight = Math.abs((diffX) / Math.cos(i))
                                    minOverlapX = overlapX
                                    minOverlapY = overlapY
                                    minDeg = i
                                }
                            } else if (overlapY < sheetRect.top) {
                                const x2 = x + sheetRect.height * Math.sin((Math.PI / 2) + i)
                                const y2 = y - sheetRect.height * Math.cos((Math.PI / 2) + i)
                                const currWidth = Math.abs((diffY) / Math.sin((Math.PI / 2) - i)) + overlapX - sheetRect.right
                                currDiffWidth = Math.abs(sheetRect.width - currWidth)
                                const overlapX2 = x2 + (sheetRect.top - y2) / Math.tan((Math.PI / 2) + i)
                                const currWidth2 = overlapX2 - sheetRect.right + Math.abs((sheetRect.top - y2) / Math.sin((Math.PI / 2) + i))
                                currDiffWidth2 = Math.abs(currWidth2 - sheetRect.width)
                                if (currDiffWidth2 > 0 && currDiffWidth > 0 && (currDiffWidth + currDiffWidth2) < minDiff) {
                                    minDiff = currDiffWidth + currDiffWidth2
                                    minWidth = Math.abs((diffY) / Math.sin((Math.PI / 2) - i))
                                    minWidth2 = Math.abs((sheetRect.top - y2) / Math.sin((Math.PI / 2) + i))
                                    minOverlapX = overlapX
                                    minOverlapX2 = overlapX2
                                    minDeg = i
                                }
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < Math.PI / 2; i += 0.001) {
                        let currDiffWidth = 99999
                        let currDiffWidth2 = 99999
                        const overlapX = x + (y - sheetRect.bottom) / Math.tan((Math.PI / 2) - i)
                        const x2 = x - sheetRect.height * Math.cos(i)
                        const y2 = y - sheetRect.height * Math.sin(i)
                        const overlapX2 = x2 + (y2 - sheetRect.top) * Math.tan(i)
                        if (overlapX > sheetRect.right && overlapX < (sheetRect.right + sheetRect.width) && overlapX2 > sheetRect.right && overlapX2 < (sheetRect.right + sheetRect.width)) {
                            const currWidth = Math.abs((y - sheetRect.bottom) / Math.sin((Math.PI / 2) - i)) + overlapX - sheetRect.right
                            currDiffWidth = Math.abs(sheetRect.width - currWidth)
                            const currWidth2 = overlapX2 - sheetRect.right + Math.abs((y2 - sheetRect.top) / Math.cos(i))
                            currDiffWidth2 = Math.abs(currWidth2 - sheetRect.width)
                            if (currDiffWidth > 0 && currDiffWidth2 > 0 && (currDiffWidth + currDiffWidth2) < minDiff) {
                                minDiff = currDiffWidth + currDiffWidth2
                                minWidth = Math.abs((y - sheetRect.bottom) / Math.sin((Math.PI / 2) - i))
                                minWidth2 = Math.abs((y2 - sheetRect.top) / Math.cos(i))
                                minOverlapX = overlapX
                                minOverlapX2 = overlapX2
                                minDeg = i - Math.PI
                            }
                        }
                    }
                }

                if (minWidth < sheetRect.width) {
                    if (minHeight < sheetRect.height) {
                        pages[j * 2 + 1].style.translate = `${2 * sheetRect.width - diffX}px ${-diffY}px`
                        if (minDeg != 999) {
                            pages[j * 2 + 1].style.clipPath = `polygon(0 ${sheetRect.height - minHeight}px, ${minWidth}px 100%, -10px 105%)`
                            pages[j * 2].style.clipPath = `polygon(0 0, 100% 0, 100% ${minOverlapY - sheetRect.top}px, ${minOverlapX - sheetRect.right}px 100%, 0 100%)`
                            pages[j * 2 + 1].style.transform = `rotate(${(90 + (minDeg * 180 / Math.PI))}deg)`
                        }
                    } else if (minWidth2 < sheetRect.width) {
                        pages[j * 2 + 1].style.translate = `${2 * sheetRect.width - diffX}px ${-diffY}px`
                        if (minDeg != 999) {
                            pages[j * 2 + 1].style.clipPath = `polygon(-10px -10px, ${minWidth2}px 0, ${minWidth}px 100%, -10px 105%)`
                            pages[j * 2].style.clipPath = `polygon(0 0, ${minOverlapX2 - sheetRect.right}px 0%, ${minOverlapX - sheetRect.right}px 100%, 0 100%)`
                            pages[j * 2 + 1].style.transform = `rotate(${((90 + (minDeg * 180 / Math.PI)))}deg)`
                        }
                    }
                }
            }
        }
    })

    sheets[j].addEventListener("dragend", (e) => {
        if (j == sheets.length - 1 && pages[0].style.translate == "100%") {
            return
        }

        const x = e.clientX

        if (isFromLeft) {
            pages[j * 2 + 1].style.clipPath = `polygon(100% 0, 100% 100%, 0 100%, 0 0)`
            pages[j * 2].style.clipPath = `polygon(100% 0, 100% 100%, 0 100%, 0 0`
            pages[j * 2].style.transformOrigin = `50% 50%`
            pages[j * 2 + 1].style.transformOrigin = `50% 50%`
            if (x < sheetRect.right) {
                pages[j * 2].style.transform = 'rotate(0)'
                pages[j * 2].style.translate = `0 0`
                pages[j * 2].style.zIndex = `${j * 2}`
            } else {
                pages[j * 2].style.transform = 'rotate(0)'
                pages[j * 2].style.transform = 'rotate(180)'
                pages[j * 2].style.translate = `100% 0`
                pages[j * 2].style.zIndex = `${pages.length * 2 - (j * 2 + 1)}`
                pages[j * 2 + 1].style.translate = `100% 0`
                pages[j * 2 + 1].style.zIndex = `${pages.length * 2 - (j * 2 + 2)}`
                // pages[j * 2].children[0].style.background = 'linear-gradient(90deg, rgba(180,180,180,0.2) 0%, rgba(255,255,255,0.6) 33%, rgba(138,138,138,0.2) 100%)'
                // pages[j*2].style.background = `linear-gradient(90deg, rgba(180,180,180,1) 0%, rgba(255,255,255,1) 33%, rgba(138,138,138,1) 100%)`
            }
        } else {
            pages[j * 2 + 1].style.clipPath = `polygon(100% 0, 100% 100%, 0 100%, 0 0)`
            pages[j * 2].style.clipPath = `polygon(100% 0, 100% 100%, 0 100%, 0 0`
            pages[j * 2].style.transformOrigin = `50% 50%`
            pages[j * 2 + 1].style.transformOrigin = `50% 50%`
            if (x > sheetRect.right) {
                pages[j * 2 + 1].style.transform = 'rotate(0)'
                pages[j * 2 + 1].style.translate = `100% 0`
                pages[j * 2 + 1].style.zIndex = `${pages.length * 2 - (j * 2 + 2)}`
            } else {
                pages[j * 2 + 1].style.transform = 'rotate(0)'
                pages[j * 2 + 1].style.transform = 'rotate(180)'
                pages[j * 2 + 1].style.translate = `0 0`
                pages[j * 2 + 1].style.zIndex = `${j * 2 + 1}`
                pages[j * 2].style.translate = `0 0`
                pages[j * 2].style.zIndex = `${j * 2}`
                // pages[j * 2 + 1].children[0].style.background = 'linear-gradient(90deg, rgba(180,180,180,0.2) 0%, rgba(255,255,255,0.6) 66%, rgba(138,138,138,0.2) 100%)'
                // pages[j*2+1].style.background = `linear-gradient(90deg, rgba(180,180,180,1) 0%, rgba(255,255,255,1) 66%, rgba(138,138,138,1) 100%)`
            }
        }
    })
}

