
import {
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from '../deps.js'
import factorizeNode from './node.js'

Deno.test('node creation without providing a key name should throw', () => {
  assertThrows(
    () => { factorizeNode() },
    Error,
    'Cannot create node with missing key name'
  )
})

Deno.test('node creates default data object on no key data input', () => {
  const node = factorizeNode('foo')
  assertEquals(node.getKeyData(), {})
})

Deno.test('node returns its key name', () => {
  const node = factorizeNode('foo')
  assertEquals(node.getKeyName(), 'foo')
})

Deno.test('node returns its key data', () => {
  const node = factorizeNode('foo', { bar: 'baz' })
  assertEquals(node.getKeyData(), { bar: 'baz' })
})

Deno.test('node can be added a child node', () => {
  const node = factorizeNode('foo', { bar: 'baz' })
  const childNode1 = factorizeNode('child1')
  const childNode2 = factorizeNode('child2')
  node.addChild(childNode1)
  node.addChild(childNode2)
  assertEquals(node.getChildren(), [childNode1, childNode2])
})

Deno.test('node returns array of all children nodes', () => {
  const node = factorizeNode('foo', { bar: 'baz' })
  const childNode1 = factorizeNode('child1')
  const childNode2 = factorizeNode('child2')
  node.addChild(childNode1)
  node.addChild(childNode2)
  assertEquals(node.getChildren(), [childNode1, childNode2])
})

Deno.test('if node has child node with given key name', () => {
  const node1 = factorizeNode('keyName1')
  node1.addChild(factorizeNode('keyName2'))
  const result1 = node1.hasChild('keyName2')
  const result2 = node1.hasChild('keyName3')
  assertEquals(result1, true)
  assertEquals(result2, false)
})

Deno.test('node returns child node with given key name', () => {
  const node1 = factorizeNode('keyName1')
  node1.addChild(factorizeNode('keyName2', { foo: 'bar' }))
  node1.addChild(factorizeNode('keyName3', { foo: 'baz' }))
  const result1 = node1.getChild('keyName2')
  const result2 = node1.getChild('keyName3')
  assertEquals(result1.key, 'keyName2')
  assertEquals(result2.key, 'keyName3')
  assertEquals(result1.data.foo, 'bar')
  assertEquals(result2.data.foo, 'baz')
})

Deno.test('nodes have the same prototype object', () => {
  const node1 = factorizeNode('node1')
  const node2 = factorizeNode('node2')
  assertStrictEquals(Object.getPrototypeOf(node1), Object.getPrototypeOf(node2))
})
