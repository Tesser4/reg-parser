
import factorizeNode from './node.js'
import { parseKeyDataString } from './utils.js'

const factorizeRegistry = () => {
  let rootNode = null
  let numOfKeys = 0

  const getRoot = () => rootNode

  const init = () => {
    rootNode = null
    numOfKeys = 0
  }

  const getNumberOfKeys = () => numOfKeys

  const insertKey = (keyDataString) => {
    const { keys, data } = parseKeyDataString(keyDataString)

    if (rootNode && rootNode.getKeyName() !== keys[0])
      throw new Error('Key to be inserted has invalid root key')

    if (!rootNode && keys.length === 1) {
      rootNode = factorizeNode(keys[0], data)
      numOfKeys += 1
      return
    }

    let currentNode
    if (rootNode) {
      currentNode = rootNode
    } else {
      currentNode = factorizeNode(keys[0])
      numOfKeys += 1
      rootNode = currentNode
    }

    for (let i = 0; i < keys.length - 1; i += 1) {
      const nextIdx = i + 1
      const nextKeyName = keys[nextIdx]
      if (currentNode.hasChild(nextKeyName)) {
        currentNode = currentNode.getChild(nextKeyName)
      } else {
        const isNextKeyLast = nextIdx === keys.length - 1
        const nextNode = isNextKeyLast
          ? factorizeNode(nextKeyName, data)
          : factorizeNode(nextKeyName)
        currentNode.addChild(nextNode)
        numOfKeys += 1
        currentNode = nextNode
      }
    }
  }

  const getDataOf = (...keySequence) => {
    const rootKeyInput = keySequence.shift()
    if (rootKeyInput.toLowerCase() !== rootNode?.getKeyName().toLowerCase())
      throw new Error('Given key sequence does not exist')

    let node = rootNode
    for (const key of keySequence) {
      const keyLowerCase = key.toLowerCase()
      const [childName] = node
        .getChildren()
        .map(child => child.getKeyName())
        .filter(childName => childName.toLowerCase() === keyLowerCase)
      if (childName) {
        node = node.getChild(childName)
      } else {
        throw new Error('Given key sequence does not exist')
      }
    }

    return node.getKeyData()
  }

  const findKey = (keyName) => {
    keyName = keyName.toLowerCase()
    const result = []

    if (!rootNode)
      return result

    const queue = [{
      node: rootNode,
      keySequence: [rootNode.getKeyName()],
    }]

    while (queue.length) {
      const item = queue.shift()
      if (item.node.getKeyName().toLowerCase() === keyName)
        result.push(item)
      const children = item.node.getChildren()
      for (const child of children) {
        queue.push({
          node: child,
          keySequence: [...item.keySequence, child.getKeyName()],
        })
      }
    }

    return result
      .map(item => ({
        keySequence: item.keySequence,
        data: item.node.getKeyData(),
      }))
  }

  return {
    getRoot,
    init,
    getNumberOfKeys,
    insertKey,
    getDataOf,
    findKey,
  }
}

export default factorizeRegistry
