
import {
  assertEquals,
  assertThrows,
} from 'https://deno.land/std@0.102.0/testing/asserts.ts'
import {
  parseKeyDataString,
  splitFileStringToKeyDataStringParts,
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

Deno.test('splitting reg file string to key data string parts', async () => {
  const fileAsString = await Deno.readTextFile('./test-assets/small.reg')
  const [part1, part2, part3, part4] = splitFileStringToKeyDataStringParts(fileAsString)
  const expectedPart1 = `[HKLM\\SW\\WN]\r\n"User"="AUser"\r\n"Monitor"="Primary"`
  const expectedPart2 = `[HKLM\\SW\\WN\\Install]`
  const expectedPart3 = `[HKLM\\SW\\WN\\Install\\CurrVer]\r\n"Root"="The root"\r\n"Version"="75.40"`
  const expectedPart4 = `[HKLM\\SW\\WN\\Para]\r\n"TMP"="c:\\\\TMP"\r\n"REG_FLUSH"="FALSE"\r\n"DEF"="c:\\\\DEF"`
  assertEquals(part1, expectedPart1)
  assertEquals(part2, expectedPart2)
  assertEquals(part3, expectedPart3)
  assertEquals(part4, expectedPart4)
})

Deno.test('splitting reg file string to parts throws on invalid file', async () => {
  const fileAsString = await Deno.readTextFile('./test-assets/small-invalid.reg')
  assertThrows(
    () => { splitFileStringToKeyDataStringParts(fileAsString) },
    Error,
    'Invalid registry file'
  )
})
