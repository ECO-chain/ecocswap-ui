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

export const restrictNumberDecimals = ($event: any, decimals: number) => {
  const keyCode = $event.keyCode ? $event.keyCode : $event.which
  const value = $event.target?.value

  if (value && typeof value == 'string') {
    // only allow number and one dot
    if ((keyCode < 48 || keyCode > 57) && (keyCode !== 46 || value.indexOf('.') != -1)) {
      // 46 is dot
      $event.preventDefault()
    }
    // restrict to 2 decimal places
    if (value != null && value.indexOf('.') > -1 && value.split('.')[1].length > decimals - 1) {
      $event.preventDefault()
    }
  }
}

export const numberWithCommas = (num: number, options?: { decimal?: number; fixed?: number[] }) => {
  if (!options) {
    return num.toLocaleString()
  }

  if (options && options.decimal) {
    num = num / Math.pow(10, options.decimal as number)
  }

  if (options && options.fixed) {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: options.fixed[0],
      maximumFractionDigits: options.fixed[1],
    })
  }
  return num.toLocaleString()
}
