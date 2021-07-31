
const parseKeyDataString = (str) => {
  const [keySequence, ...params] = str.split('\r\n')
  const keys = keySequence
    .substring(1, keySequence.length - 1)
    .split('\\')
  const uuid = crypto.randomUUID()
  const data = params
    .map(param => param.replace('=', `${uuid}`))
    .map(param => param.split(uuid))
    .map(pair => pair.map(x => x.trim()))
    .map(pair => pair.map(x =>
      x.at(0) === '"' && x.at(-1) === '"'
        ? x.substring(1, x.length - 1)
        : x
    ))
    .reduce((acc, pair) => {
      acc[pair[0]] = pair[1]
      return acc
    }, {})

  return { keys, data }
}

const splitFileStringToKeyDataStringParts = (str) => {
  const keyDataParts = str
    .trim()
    .split('\r\n\r\n')
    .map(x => x.trim())
  const header = keyDataParts.shift()
  if (header !== 'REGEDIT4')
    throw new Error('Invalid registry file')

  return keyDataParts
}

export {
  parseKeyDataString,
  splitFileStringToKeyDataStringParts,
}
