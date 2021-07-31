
import factorizeRegistry from '../src/registry.js'
import { splitFileStringToKeyDataStringParts } from '../src/utils.js'

const parseRegistryFile = async (filePath) => {
  let fileAsString
  try {
    fileAsString = await Deno.readTextFile(filePath)
  } catch (err) {
    if (err instanceof Deno.errors.NotFound)
      throw new Error(`Cannot find file ${filePath}`)
    else
      throw err
  }

  const regParts = splitFileStringToKeyDataStringParts(fileAsString)

  const registry = factorizeRegistry()
  for (const part of regParts) {
    registry.insertKey(part)
  }

  return registry
}

export {
  parseRegistryFile,
}
