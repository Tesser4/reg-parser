
import {
  assertEquals,
  assertThrows,
} from '../deps.js'
import registry from './registry.js'

Deno.test('registry inserts a string key sequence with its data', () => {
  registry.init()
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
    Par1: "val1",
    Par2: "val2",
  })
})

Deno.test('registry inserts two string key sequences with data', () => {
  registry.init()
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
    ApplicationRuntime: "true",
    ApplicationTest: "false",
  })
  next = next.getChild('baz')
  assertEquals(next.getKeyName(), 'baz')
  assertEquals(next.getKeyData(), {
    Par1: "val1",
    Par2: "val2",
  })
})

Deno.test('registry returns total number of keys', () => {
  registry.init()
  const r1 = `[HKLM\\foo\\bar]\r\n"Par1"="val1"\r\n"Par2"="val2"`
  const r2 = `[HKLM\\foo\\bar\\baz]\r\n"Par3"="val3"\r\n"Par4"="val4"`
  registry.insertKey(r1)
  registry.insertKey(r2)
  const expected = 4
  const result = registry.getNumberOfKeys()
  assertEquals(result, expected)
})

Deno.test('registry insertion can handle string with unary key and its data', () => {
  registry.init()
  const reg = `[HKLM]\r\n"foo"="bar"\r\n"baz"="bar-bar"`
  registry.insertKey(reg)
  const root = registry.getRoot()
  assertEquals(root.getKeyName(), 'HKLM')
  assertEquals(root.getKeyData(), {
    foo: "bar",
    baz: "bar-bar",
  })
})

Deno.test('registry insertion throws for key with different root', () => {
  const r1 = `[HKLM\\foo\\bar]\r\n"Par1"="val1"\r\n"Par2"="val2"`
  const r2 = `[HKL\\foo\\bar\\baz]\r\n"Par3"="val3"\r\n"Par4"="val4"`
  registry.init()
  assertThrows(
    () => {
      registry.insertKey(r1)
      registry.insertKey(r2)
    },
    Error,
    'Key to be inserted has invalid root key'
  )
})
