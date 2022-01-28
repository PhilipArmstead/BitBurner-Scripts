# BitBurner Scripts

Here's a collection of scripts I've amassed during my play-time.

Below are some things I think you'll be most interested in.

## Quality of life

- `/qol/shortcuts.js` Use customisable keyboard shortcuts to jump to any window linked from the sidebar, without
  cancelling crimes, programs or faction contracts. ([Demo](docs/qol-shortcuts.gif))

- `/qol/make-tabs-scrollable.js` This script will allow you to scroll horizontally through your text-editor's opened
  tabs using the mouse wheel. ([Demo](docs/qol-scroll-tabs.gif))

- `/qol/add-tab-control-to-editor` This script will allow you to navigate through editor tabs with ctrl + tab (or backwards with ctrl + shift + tab).

- `/qol/colourful-terminal.js` This script will allow you to style terminal output with rudimentary styles, like `<red></red>`, `<bold></bold>`, `<blue></blue>` etc.. ([Demo](docs/qol-colour-terminal.gif))

Quality of life scripts need running once to activate; they will end immediately, freeing up RAM, but continue to
function.

## GUI

- `/gui/server-list.js` Render a searchable list of servers with one-click root, connect or backdoor
  access. ([Demo](/docs/server-list.gif))
- `/gui/process-list.js` Render a list of hack/grow/weaken processes in progress. ([Demo](/docs/process-list.gif)) ([Usage guide](/docs/ProcessList.md))
- `/gui/macros.js` Bind configurable Terminal commands to clickable buttons. ([Usage guide](/docs/Macros.md))
- `/gui/lib/Prompt.js` An importable library allowing for user-inputs inside scripts. ([Demo](/docs/user-prompt.gif)) ([Usage guide](/docs/Prompts.md))

**To install** copy the contents of [gui/install.js](gui/install.js) anywhere on your device and execute it. 
## Utils

- `/util/server/enslave.js` Copy a payload to all rooted servers and run it against a target.  
  This script depends on `/lib/servers.js`

- `/util/server/reset.js` Kills all running scripts on all rooted servers.  
  This script depends on `/lib/servers.js`

