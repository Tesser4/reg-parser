# Windows Registry File Parser

Parses Windows registry file to a tree data structure for further processing.

## Runtime

Deno

## Usage

On Windows registry file:

```ini
REGEDIT4

[foo\bar]
"Par1"="val1"
"Par2"="val2"

[foo\bar\baz]
"Par3"="val3"
```

Then:

```js
import { parseRegistryFile } from "mod.js";

const registry = await parseRegistryFile(Deno.args[0]);

const root = registry.getRoot();
root.getKeyName(); // foo
root.getKeyData(); // {}

root.getChildren().map((child) => child.getKeyName()); // [ "bar" ]

const child = root.getChild("bar");
child.getKeyName(); // bar
child.getKeyData(); // { Par1: "val1", Par2: "val2" }

registry.getDataOf("foo", "bar", "baz"); // { Par3: "val3" }
```

Requires `--allow-read` Deno flag:

```sh
deno run --allow-read <app-file> <reg-file>
```

## Note

Experimental - Don't rely 100% on it yet.
