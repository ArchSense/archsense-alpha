import * as vscode from 'vscode';
import ArchitectureViewPanel from './panel';
import { BI_ACTIONS, initReporter, sendEvent, sendException } from './services/bi';
import { analyze } from './services/parser';
import { nestJsMainGlobPattern, notifications, quickPickerPlaceholder } from './consts';
import { sep } from 'path';
import { clearAllMeasurement } from './services/measurements';

export function activate(context: vscode.ExtensionContext) {
  const reporter = initReporter();
  const showArchitecture = vscode.commands.registerCommand(
    'archsense.showArchitecture',
    async () => {
      sendEvent({ action: BI_ACTIONS.start });

      const roots = await vscode.workspace.findFiles(nestJsMainGlobPattern, '**/node_modules/**');

      if (!roots || roots.length === 0) {
        vscode.window.showWarningMessage(notifications.emptyWorkspace);
        return;
      }

      const rootFoldersMap = roots.reduce((acc, curr) => {
        const parts = curr.fsPath.split(sep);
        const rootFolderName = parts.at(-3) as string;
        const rootFolderPath = parts.slice(0, -2).join(sep);
        acc[rootFolderName] = rootFolderPath;
        return acc;
      }, {});

      let rootFolderPath = Object.values(rootFoldersMap)[0] as string;

      if (Object.values(rootFoldersMap).length > 1) {
        // show the picker only in mono-repo several projects
        const rootAppName = await vscode.window.showQuickPick(Object.keys(rootFoldersMap), {
          canPickMany: false,
          placeHolder: quickPickerPlaceholder,
        });

        if (!rootAppName) {
          return;
        }
        rootFolderPath = rootFoldersMap[rootAppName];
      }

      try {
        const currentView = ArchitectureViewPanel.createOrShow(context);
        currentView.sendAnalysisResult(null);

        const measurementToken = sendEvent({ action: BI_ACTIONS.parserStart }) as symbol;
        const analysis = await analyze(rootFolderPath);

        sendEvent({ action: BI_ACTIONS.parserSuccess, measurementToken, payload: analysis });

        vscode.window.showInformationMessage(notifications.analysisSuccess);

        currentView.onInit(() => {
          currentView.sendAnalysisResult(analysis);
        });

        currentView.onActivate(() => {
          currentView.sendAnalysisResult(analysis);
        });
      } catch (error) {
        sendEvent({ action: BI_ACTIONS.parserError, payload: error });
        sendException(error as Error);
        vscode.window.showErrorMessage(notifications.analysisError);
      }
    },
  );

  context.subscriptions.push(showArchitecture, reporter);
}

// This method is called when your extension is deactivated
export function deactivate() {
  clearAllMeasurement();
}
