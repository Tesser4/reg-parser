# Windows Registry File Parser

### Parses Windows registry file to a tree data structure for further processing.

### Runtime

Deno

## Usage

```
import { parseRegistryFile } from './mod.js'
const registry = await parseRegistryFile(Deno.args[0])
```

Requires `--allow-read` Deno flag:

```
deno run --allow-read <app-file> <reg-file>
```

### Note

Experimental - Don't rely 100% on it yet.
