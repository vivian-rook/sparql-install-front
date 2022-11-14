import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

import { ILauncher } from '@jupyterlab/launcher';

import { LabIcon } from '@jupyterlab/ui-components';

import pythonIconStr from '../style/cat.svg';
//import pythonIconStr from '../style/Python-logo-notext.svg';

const FACTORY = 'Editor';
const PALETTE_CATEGORY = 'Extension Examples';

namespace CommandIDs {
  export const createNew = 'jlab-examples:create-new-python-file';
}

const extension: JupyterFrontEndPlugin<void> = {
  id: 'launcher',
  autoStart: true,
  requires: [IFileBrowserFactory],
  optional: [ILauncher, ICommandPalette],
  activate: (
    app: JupyterFrontEnd,
    browserFactory: IFileBrowserFactory,
    launcher: ILauncher | null,
    palette: ICommandPalette | null
  ) => {
    const { commands } = app;
    const command = CommandIDs.createNew;
    const icon = new LabIcon({
      name: 'launcher:python-icon',
      svgstr: pythonIconStr,
    });

    commands.addCommand(command, {
      label: (args) => (args['isPalette'] ? 'New Python File' : 'install SPARQL'),
      caption: 'Create a new Python file',
      icon: (args) => (args['isPalette'] ? null : icon),
      execute: async (args) => {
        // Get the directory in which the Python file must be created;
        // otherwise take the current filebrowser directory
        const cwd =
          args['cwd'] || browserFactory.tracker.currentWidget.model.path;

        // Create a new untitled python file
        const model = await commands.execute('docmanager:new-untitled', {
          path: cwd,
          type: 'file',
          ext: 'py',
        });

        // Open the newly created file with the 'Editor'
        return commands.execute('docmanager:open', {
          path: model.path,
          factory: FACTORY,
        });
      },
    });

    // Add the command to the launcher
    if (launcher) {
      launcher.add({
        command,
        category: 'Install',
        rank: 1,
      });
    }

    // Add the command to the palette
    if (palette) {
      palette.addItem({
        command,
        args: { isPalette: true },
        category: PALETTE_CATEGORY,
      });
    }
  },
};

export default extension;
