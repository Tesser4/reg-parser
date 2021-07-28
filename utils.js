
const parseKeyDataString = (str) => {
  const [keySequence, ...params] = str.split('\r\n')
  const keys = keySequence
    .substring(1, keySequence.length - 1)
    .split('\\')
  const uuid = crypto.randomUUID()
  const data = params
    .map(param => param.replace('"=', `"${uuid}`))
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

export {
  parseKeyDataString,
}
