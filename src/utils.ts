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
