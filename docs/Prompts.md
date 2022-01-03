# Prompts
## Installation
Copy the contents of [install.js](/gui/install.js) anywhere on to your system and run it to install the GUI scripts.

## Usage
Import the library in to your custom script

```js
import Prompt from '/gui/lib/Prompt.js'
```

And then call with the desired header and await the response

```js
const input1 = await Prompt("Pick a number.")
const input2 = await Prompt("And another...")
```
