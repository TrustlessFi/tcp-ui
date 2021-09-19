
const localStorage = window.localStorage

export const getLocalStorage = (key: string, defaultValue: any = null) => {
  const val = localStorage.getItem(key)
  if (val === null) return defaultValue
  return JSON.parse(val)
}
