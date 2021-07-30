
import factorizeRegistry from '../src/registry.js'
import { splitFileStringToKeyDataStringParts } from '../src/utils.js'

const parseRegistryFile = async (filePath) => {
  let fileAsString
  try {
    fileAsString = await Deno.readTextFile(filePath)
  } catch (err) {
    if (err instanceof Deno.errors.NotFound)
      console.log(`Cannot find file ${filePath}`)
    else
      console.log(err.message)
    Deno.exit(1)
  }

  let regParts
  try {
    regParts = splitFileStringToKeyDataStringParts(fileAsString)
  } catch (err) {
    console.log(err.message)
    Deno.exit(1)
  }

  const registry = factorizeRegistry()
  for (const part of regParts) {
    registry.insertKey(part)
  }

  return registry
}

export {
  parseRegistryFile,
}
