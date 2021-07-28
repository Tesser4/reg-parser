
import {
  assertEquals,
} from 'https://deno.land/std@0.102.0/testing/asserts.ts'
import {
  parseKeyDataString,
} from './utils.js'

Deno.test('parsing string of a single reg key with its params', () => {
  const r = `[foo\\bar\\baz\\foo-foo\\bar-bar]\r\n"Par1"="val1"\r\n"Par2"="val2"`
  const expected = {
    keys: ['foo', 'bar', 'baz', 'foo-foo', 'bar-bar'],
    data: {
      Par1: 'val1',
      Par2: 'val2',
    }
  }
  const result = parseKeyDataString(r)
  assertEquals(result.keys, expected.keys)
  assertEquals(result.data, expected.data)
})
