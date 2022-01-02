# Process List
## Installation
Copy the contents of [install.js](/gui/install.js) anywhere on to your system and run it to install the GUI scripts.

## Config
Process List requires you to create a config file in this location: `/gui/config/process-list.config.js`.  
Inside this config file must go the following:
```js
export const processListPayloads = {
	grow: ["/path/to/grow.js"],
	hack: ["/path/to/hack.js"],
	weaken: ["/path/to/weaken.js"]
}
```
These arrays can be modified to list the filenames that you want to associate with hacking, weakening and growing (for colouring purposes).
This file is not destroyed on re-install and does not need to be recreated.

## Usage
`run /gui/process-list.js` will launch the script and show you your running processes.

## Flags
- `--no-group` Right now, non-unique processes spread across multiple servers will be grouped (it is assumed they are part of the same attack). This flag will prevent that grouping and show all processes individually.
