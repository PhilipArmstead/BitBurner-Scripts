# BitBurner Scripts
Here's a collection of scripts I've amassed during my play-time.

Below are some things I think you'll be most interested in.

## Quality of life

- `/qol/make-tabs-scrollable.js` This script will allow you to scroll horizontally through your text-editor's opened tabs using the mouse wheel.  
  [Scrollable tabs demo](docs/qol-scroll-tabs.gif)


- `/qol/make-boxes-minimisable.js` This script will allow you to minimise the game's modals (Active Scripts etc.) by double-clicking the title.  
  [Minimised boxes demo](docs/qol-minimise-boxes.gif)
  
Quality of life scripts need running once to activate; they will end immediately, freeing up RAM, but continue to function.


## GUI

- `/gui/server-list.js` Render a list of all available servers in a draggable, minimisable pop-up window. Servers can be connected to and backdoored by clicking them.  
  This script depends on the `/gui/lib/*` scripts as well as `/lib/servers.js`  
  [Server list demo](/docs/server-list.png)


## Utils

- `/util/server/enslave.js` Copy a payload to all rooted servers and run it against a target.  
  This script depends on `/lib/servers.js`

- `/util/server/reset.js` Kills all running scripts on all rooted servers.  
  This script depends on `/lib/servers.js`

