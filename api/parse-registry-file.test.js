
import {
  assertEquals,
  assertThrowsAsync,
} from '../deps.js'
import { parseRegistryFile } from './parse-registry-file.js'

Deno.test('parse reg file throws if file is not found', () => {
  assertThrowsAsync(
    async () => { await parseRegistryFile('./non-existed-file.reg') },
    Error,
    'Cannot find file'
  )
})

Deno.test('parse reg file throws if file is invalid', () => {
  assertThrowsAsync(
    async () => { await parseRegistryFile('./test-assets/small-invalid.reg') },
    Error,
    'Invalid registry file'
  )
})

Deno.test('parse registry file', async () => {
  const registry = await parseRegistryFile('./test-assets/medium.reg')

  const rootNode = registry.getRoot()
  const rootNodeKeyName = rootNode.getKeyName()
  assertEquals(rootNodeKeyName, 'HKEY_LOCAL_MACHINE')

  const ieMainNode = rootNode
    .getChild('SOFTWARE')
    .getChild('Microsoft')
    .getChild('Internet Explorer')
    .getChild('MAIN')
  const ieMainNodeData = ieMainNode.getKeyData()
  assertEquals(ieMainNodeData.AutoHide, 'yes')
})
