
import {
  assertEquals,
  assertThrows,
} from '../deps.js'
import factorizeRegistry from './registry.js'

Deno.test('registry inserts a string key sequence with its data', () => {
  const registry = factorizeRegistry()
  const r = `[HKLM\\foo\\bar\\baz]\r\n"Par1"="val1"\r\n"Par2"="val2"`
  registry.insertKey(r)
  const root = registry.getRoot()
  assertEquals(root.getKeyName(), 'HKLM')
  assertEquals(root.getKeyData(), {})
  assertEquals(root.hasChild('foo'), true)
  assertEquals(root.hasChild('bar'), false)
  let next = root.getChild('foo')
  assertEquals(next.getKeyName(), 'foo')
  assertEquals(next.getKeyData(), {})
  assertEquals(next.hasChild('bar'), true)
  next = next.getChild('bar')
  next = next.getChild('baz')
  assertEquals(next.getKeyName(), 'baz')
  assertEquals(next.getKeyData(), {
    Par1: 'val1',
    Par2: 'val2',
  })
})

Deno.test('registry inserts two string key sequences with data', () => {
  const registry = factorizeRegistry()
  const r1 = `[HKLM\\foo\\bar]\r\n"ApplicationRuntime"="true"\r\n"ApplicationTest"="false"`
  const r2 = `[HKLM\\foo\\bar\\baz]\r\n"Par1"="val1"\r\n"Par2"="val2"`
  registry.insertKey(r1)
  registry.insertKey(r2)
  const root = registry.getRoot()
  assertEquals(root.getKeyName(), 'HKLM')
  assertEquals(root.getKeyData(), {})
  assertEquals(root.hasChild('foo'), true)
  assertEquals(root.hasChild('bar'), false)
  let next = root.getChild('foo')
  assertEquals(next.getKeyName(), 'foo')
  assertEquals(next.getKeyData(), {})
  assertEquals(next.hasChild('bar'), true)
  next = next.getChild('bar')
  assertEquals(next.getKeyName(), 'bar')
  assertEquals(next.getKeyData(), {
    ApplicationRuntime: 'true',
    ApplicationTest: 'false',
  })
  next = next.getChild('baz')
  assertEquals(next.getKeyName(), 'baz')
  assertEquals(next.getKeyData(), {
    Par1: 'val1',
    Par2: 'val2',
  })
})

Deno.test('registry returns total number of keys', () => {
  const registry = factorizeRegistry()
  const r1 = `[HKLM\\foo\\bar]\r\n"Par1"="val1"\r\n"Par2"="val2"`
  const r2 = `[HKLM\\foo\\bar\\baz]\r\n"Par3"="val3"\r\n"Par4"="val4"`
  registry.insertKey(r1)
  registry.insertKey(r2)
  const expected = 4
  const result = registry.getNumberOfKeys()
  assertEquals(result, expected)
})

Deno.test('registry insertion can handle string with unary key and its data', () => {
  const registry = factorizeRegistry()
  const reg = `[HKLM]\r\n"foo"="bar"\r\n"baz"="bar-bar"`
  registry.insertKey(reg)
  const root = registry.getRoot()
  assertEquals(root.getKeyName(), 'HKLM')
  assertEquals(root.getKeyData(), {
    foo: 'bar',
    baz: 'bar-bar',
  })
})

Deno.test('registry insertion throws for key with different root', () => {
  const registry = factorizeRegistry()
  const r1 = `[HKLM\\foo\\bar]\r\n"Par1"="val1"\r\n"Par2"="val2"`
  const r2 = `[HKL\\foo\\bar\\baz]\r\n"Par3"="val3"\r\n"Par4"="val4"`
  assertThrows(
    () => {
      registry.insertKey(r1)
      registry.insertKey(r2)
    },
    Error,
    'Key to be inserted has invalid root key'
  )
})

Deno.test('registry getDataOf returns the data of a key sequence input', () => {
  const registry = factorizeRegistry()
  const r = `[HKLM\\foo\\bar\\baz]\r\n"Par1"="val1"\r\n"Par2"="val2"\r\n"Par3"="val3"`
  registry.insertKey(r)
  const expected = {
    Par1: 'val1',
    Par2: 'val2',
    Par3: 'val3',
  }
  const result = registry.getDataOf('HKLM', 'foo', 'bar', 'baz')
  assertEquals(result, expected)
})

Deno.test('registry getDataOf is case insensitive on the key sequence input', () => {
  const registry = factorizeRegistry()
  const r = `[HKLM\\foo\\bar\\baz]\r\n"Par1"="val1"\r\n"Par2"="val2"\r\n"Par3"="val3"`
  registry.insertKey(r)
  const expected = {
    Par1: 'val1',
    Par2: 'val2',
    Par3: 'val3',
  }
  const result = registry.getDataOf('hklm', 'Foo', 'baR', 'BAZ')
  assertEquals(result, expected)
})

Deno.test('registry getDataOf throws on invalid key 1', () => {
  const registry = factorizeRegistry()
  assertThrows(
    () => { registry.getDataOf('HKLM', 'foo', 'bar', 'baz') },
    Error,
    'Given key sequence does not exist'
  )
})

Deno.test('registry getDataOf throws on invalid key 2', () => {
  const registry = factorizeRegistry()
  const r = `[HKLM\\foo\\bar\\baz]\r\n"Par1"="val1"\r\n"Par2"="val2"\r\n"Par3"="val3"`
  registry.insertKey(r)
  assertThrows(
    () => { registry.getDataOf('HKL', 'foo', 'bar', 'baz') },
    Error,
    'Given key sequence does not exist'
  )
})

Deno.test('registry getDataOf throws on invalid key 3', () => {
  const registry = factorizeRegistry()
  const r = `[HKLM\\foo\\bar\\baz]\r\n"Par1"="val1"\r\n"Par2"="val2"\r\n"Par3"="val3"`
  registry.insertKey(r)
  assertThrows(
    () => { registry.getDataOf('HKLM', 'foo', 'baz', 'bar') },
    Error,
    'Given key sequence does not exist'
  )
})

Deno.test('registry finds the data of a given key name', () => {
  const registry = factorizeRegistry()
  const r1 = `[HKLM\\foo\\bar]\r\n"Par1"="val1"\r\n"Par2"="val2"`
  const r2 = `[HKLM\\foo\\bar\\baz]\r\n"Par3"="val3"`
  registry.insertKey(r1)
  registry.insertKey(r2)

  const [result1] = registry.findKey('bar')
  assertEquals(result1.keySequence.length, 3)
  assertEquals(result1.keySequence[0], 'HKLM')
  assertEquals(result1.keySequence[1], 'foo')
  assertEquals(result1.keySequence[2], 'bar')
  assertEquals(result1.data, { Par1: 'val1', Par2: 'val2' })

  const [result2] = registry.findKey('baz')
  assertEquals(result2.keySequence.length, 4)
  assertEquals(result2.keySequence[0], 'HKLM')
  assertEquals(result2.keySequence[1], 'foo')
  assertEquals(result2.keySequence[2], 'bar')
  assertEquals(result2.keySequence[3], 'baz')
  assertEquals(result2.data, { Par3: 'val3' })
})

Deno.test('registry find is case insensitive on key name input', () => {
  const registry = factorizeRegistry()
  const r1 = `[HKLM\\foo\\bar]\r\n"Par1"="val1"\r\n"Par2"="val2"`
  const r2 = `[HKLM\\foo\\bar\\baz]\r\n"Par3"="val3"`
  registry.insertKey(r1)
  registry.insertKey(r2)

  const [result1] = registry.findKey('Bar')
  assertEquals(result1.keySequence, ['HKLM', 'foo', 'bar'])
  assertEquals(result1.data, { Par1: 'val1', Par2: 'val2' })

  const [result2] = registry.findKey('bAZ')
  assertEquals(result2.keySequence.length, 4)
  assertEquals(result2.keySequence, ['HKLM', 'foo', 'bar', 'baz'])
  assertEquals(result2.data, { Par3: 'val3' })
})

Deno.test('registry finds multiple data of a key name', () => {
  const registry = factorizeRegistry()
  const r1 = `[HKLM\\foo\\bar]\r\n"Par1"="val1"\r\n"Par2"="val2"`
  const r2 = `[HKLM\\foo\\bar\\baz]\r\n"Par3"="val3"`
  const r3 = `[HKLM\\foo\\bar\\baz\\bar]\r\n"Par4"="val4"`
  registry.insertKey(r1)
  registry.insertKey(r2)
  registry.insertKey(r3)

  const [result1, result2] = registry.findKey('bar')

  assertEquals(result1.keySequence.length, 3)
  assertEquals(result1.keySequence[0], 'HKLM')
  assertEquals(result1.keySequence[1], 'foo')
  assertEquals(result1.keySequence[2], 'bar')
  assertEquals(result1.data, { Par1: 'val1', Par2: 'val2' })

  assertEquals(result2.keySequence.length, 5)
  assertEquals(result2.keySequence[0], 'HKLM')
  assertEquals(result2.keySequence[1], 'foo')
  assertEquals(result2.keySequence[2], 'bar')
  assertEquals(result2.keySequence[3], 'baz')
  assertEquals(result2.keySequence[4], 'bar')
  assertEquals(result2.data, { Par4: 'val4' })
})
