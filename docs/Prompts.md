# Prompts
## Installation
Copy the contents of [install.js](/gui/install.js) anywhere on to your system and run it to install the GUI scripts.

## Usage
Import the library in to your custom script

```js
import Prompt from '/gui/lib/Prompt.js'
```

And then call with the desired message and await the response

```js
// Text prompt
const input1 = await Prompt("Pick a number.")
const input2 = await Prompt("And another...")

// Drop-down prompt
const servers = ['n00dles', 'home', 'joesguns']
const index = await Prompt("Select a target", servers)

const options = { "one": "Option one", "two": "Option two", "three": "Option three"}
const key = await Prompt("Select an option", options)
```
