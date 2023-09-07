import * as vscode from 'vscode';
export {};

declare global {
  interface Window {
    vscode: vscode.Webview;
  }
}
