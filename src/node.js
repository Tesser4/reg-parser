
const nodeProto = {
  getKeyName: function () {
    return this.key
  },
  getKeyData: function () {
    return this.data
  },
  addChild: function (childNode) {
    this.children.push(childNode)
  },
  hasChild: function (keyName) {
    return this.children
      .some(child => child.key === keyName)
  },
  getChild: function (keyName) {
    const [child] = this.children
      .filter(child => child.key === keyName)
    return child
  },
  getChildren: function () {
    return this.children
  },
}

const factorizeNode = (keyName, keyData = {}) => {
  if (!keyName)
    throw new Error('Cannot create node with missing key name')

  return Object.create(
    nodeProto,
    {
      key: { value: keyName },
      data: { value: keyData },
      children: { value: [] },
    }
  )
}

export default factorizeNode
