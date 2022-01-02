# Macros
## Installation
Copy the contents of [install.js](/gui/install.js) anywhere on to your system and run it to install the GUI scripts.

## Config
Macros requires you to create a config file in this location: `/gui/config/macro-list.config.js`.  
Inside this config file must go the following:
```js
export const macroList = {
	"Buy all": ["buy BruteSSH.exe", "buy FTPCrack.exe", "buy relaySMTP.exe", "buy HTTPWorm.exe", "buy SQLInject.exe"],
	"Go home": ["home"],
	"Show servers": ["home", "run /gui/server-list.js"]
}
```
These commands can be modified, added to and extended to suit your needs.
This file is not destroyed on re-install and does not need to be recreated.

## Usage
`run /gui/macros.js` will launch the script.
