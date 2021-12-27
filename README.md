# BitBurner Scripts

Here's a collection of scripts I've amassed during my play-time.

Below are some things I think you'll be most interested in.

## Quality of life

- `/qol/make-tabs-scrollable.js` This script will allow you to scroll horizontally through your text-editor's opened
  tabs using the mouse wheel. ([Demo](docs/qol-scroll-tabs.gif))


- `/qol/make-boxes-minimisable.js` This script will allow you to minimise the game's modals (Active Scripts etc.) by
  double-clicking the title. ([Demo](docs/qol-minimise-boxes.gif))

Quality of life scripts need running once to activate; they will end immediately, freeing up RAM, but continue to
function.

## GUI

- `/gui/server-list.js` Render a searchable list of servers with one-click root, connect or backdoor
  access. ([Demo](/docs/server-list.png))  
  __Dependencies__
    - `/gui/lib/*`
    - `/gui/css/window.js`
    - `/lib/servers.js`

## Utils

- `/util/server/enslave.js` Copy a payload to all rooted servers and run it against a target.  
  This script depends on `/lib/servers.js`

- `/util/server/reset.js` Kills all running scripts on all rooted servers.  
  This script depends on `/lib/servers.js`

