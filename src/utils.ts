export const getFormattedTime = () => {
  const today = new Date()
  const y = today.getFullYear()
  const m = today.getMonth() + 1
  const d = today.getDate()
  const h = today.getHours()
  const mi = today.getMinutes()
  const sec = today.getSeconds()
  return `${y}-${m}-${d}T${h}-${mi}-${sec}`
}

export const isMobileDevice = () => {
  const mobileDetector = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/gi
  return mobileDetector.test(window.navigator.userAgent)
}

export const copyToClipboard = (text: string) => {
  if (isMobileDevice()) {
    // text area method
    const input = document.body.appendChild(document.createElement('input'))
    input.value = text
    input.focus()
    input.select()
    document.execCommand('copy')
    input.parentNode?.removeChild(input)
  } else if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  }
}

export const truncate = (msg: string, charsToShow = 20) => {
  if (msg.length <= charsToShow) return msg

  const separator = '...'
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)

  return msg.substr(0, frontChars) + separator + msg.substr(msg.length - backChars)
}

export const restrictNumberDecimals = ($event: any, input: any, decimals: number) => {
  const keyCode = $event.keyCode ? $event.keyCode : $event.which

  input = input.toString()

  // only allow number and one dot
  if ((keyCode < 48 || keyCode > 57) && (keyCode !== 46 || input.indexOf('.') != -1)) {
    // 46 is dot
    $event.preventDefault()
  }
  // restrict to 2 decimal places
  if (input != null && input.indexOf('.') > -1 && input.split('.')[1].length > decimals - 1) {
    $event.preventDefault()
  }
}
