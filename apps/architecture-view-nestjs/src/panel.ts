import { AnalysisResult } from '@archsense/scout';
import * as vscode from 'vscode';
import { webviewTabTitle } from './consts';
import { BI_ACTIONS, sendEvent } from './services/bi';
import { getNonce } from './utils';

type InitCallback = () => void;

enum MessageType {
  analysis = 'analysis',
  startup = 'startup',
  openFile = 'openFile',
}

type Message = {
  type: MessageType;
  payload: unknown;
};

export default class ArchitectureViewPanel {
  public static currentPanel: ArchitectureViewPanel | undefined;

  private static readonly viewType = 'archsense';

  private isAppLoaded = false;
  private initCallbacks: InitCallback[] = [];
  private activateCallbacks: InitCallback[] = [];
  private readonly webviewPanel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extContext: vscode.ExtensionContext) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;
    if (ArchitectureViewPanel.currentPanel) {
      ArchitectureViewPanel.currentPanel.webviewPanel.reveal(column);
    } else {
      ArchitectureViewPanel.currentPanel = new ArchitectureViewPanel(
        extContext.extensionUri,
        column || vscode.ViewColumn.One,
      );
    }
    return ArchitectureViewPanel.currentPanel;
  }

  private constructor(extensionPath: vscode.Uri, column: vscode.ViewColumn) {
    this.extensionUri = extensionPath;
    this.webviewPanel = vscode.window.createWebviewPanel(
      ArchitectureViewPanel.viewType,
      webviewTabTitle,
      column,
      {
        enableScripts: true,
        localResourceRoots: [this.extensionUri],
      },
    );

    this.webviewPanel.iconPath = vscode.Uri.joinPath(this.extensionUri, 'images', 'icon-color.png');
    this.webviewPanel.webview.html = this._getHtmlForWebview(this.webviewPanel.webview);
    this.webviewPanel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle messages from the webview
    this.webviewPanel.webview.onDidReceiveMessage(
      this.handleIncomingMessage,
      this,
      this._disposables,
    );
  }

  private async flushInitCallbacks() {
    sendEvent({ action: BI_ACTIONS.clientStart });
    console.log(`Flashing ${this.initCallbacks.length} init callbacks`);
    this.isAppLoaded = true;
    for (const cb of this.initCallbacks) {
      await cb();
    }
    this.initCallbacks = [];
  }

  private async flushActivateCallbacks() {
    for (const cb of this.activateCallbacks) {
      await cb();
    }
  }

  private handleIncomingMessage(message: Message) {
    switch (message.type) {
      case MessageType.startup:
        if (!this.isAppLoaded) {
          this.flushInitCallbacks();
        } else {
          this.flushActivateCallbacks();
        }
        return;
      case MessageType.openFile:
        this.openFileHandler(message.payload as string);
        return;
      default:
        console.log(`Unknown message received ${message.type}`);
    }
  }

  private openFileHandler(filePath: string) {
    sendEvent({ action: BI_ACTIONS.openFile, payload: filePath });
    const fileUri = vscode.Uri.file(filePath);
    const fileIsAlreadyOpen = () => {
      return vscode.window.visibleTextEditors.some(
        (editor: vscode.TextEditor) => editor.document.uri.fsPath === filePath,
      );
    };
    if (!fileIsAlreadyOpen()) {
      vscode.window.showTextDocument(fileUri, {
        viewColumn: vscode.ViewColumn.Beside,
      });
    }
  }

  private sendOutcomingMessage(message: Message) {
    this.webviewPanel.webview.postMessage(message);
  }

  public onInit(cb: InitCallback) {
    if (this.isAppLoaded) {
      cb();
    } else {
      this.initCallbacks.push(cb);
    }
  }

  public onActivate(cb: InitCallback) {
    this.activateCallbacks.push(cb);
  }

  public sendAnalysisResult(data: AnalysisResult | null) {
    this.sendOutcomingMessage({ type: MessageType.analysis, payload: data });
  }

  public dispose() {
    ArchitectureViewPanel.currentPanel = undefined;
    this.webviewPanel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'out', 'main.wv.js'),
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${webviewTabTitle}</title>
      </head>
      <body>
        <div id="root"></div>
        <script>
          window.vscode = acquireVsCodeApi();
          window.onload = function() {
            vscode.postMessage({ type: 'startup' });
          };
        </script>
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>
    `;
  }
}
