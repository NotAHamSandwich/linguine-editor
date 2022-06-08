var rpanrResize = document.getElementById('rpanrResize')
var pan1 = document.getElementById('file-browser')
var pan2 = document.getElementById('container')

let ismdwn = 0
rpanrResize.addEventListener('mousedown', mD)

    function mD(event) {
        ismdwn = 1
        document.body.addEventListener('mousemove', mV)
        document.body.addEventListener('mouseup', end)
    }

    function mV(event) {
        if (ismdwn === 1) {
            pan1.style.flexBasis = event.clientX + "px"
        } else {
            end()
        }
    }
    const end = (e) => {
        ismdwn = 0
        document.body.removeEventListener('mouseup', end)
        rpanrResize.removeEventListener('mousemove', mV)
}