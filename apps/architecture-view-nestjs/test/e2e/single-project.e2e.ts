import { Workbench } from 'wdio-vscode-service';

describe('Architecture view extension', () => {
  it('should load the workspace', async () => {
    const workbench: Workbench = await browser.getWorkbench();
    expect(await workbench.getTitleBar().getTitle()).toContain(
      '[Extension Development Host] guinea-pig-nestjs',
    );
  });

  it('should load the architecture view', async function () {
    this.retries(2);
    const workbench: Workbench = await browser.getWorkbench();
    await workbench.executeCommand('showArchitecture');
    await browser.pause(500);
    const archWebview = await workbench.getWebviewByTitle('Architecture View');
    await archWebview.open();
    await $('.react-flow__node-actual').waitForExist({
      timeout: 60 * 1000,
      timeoutMsg: 'Client took too long to load',
      interval: 500,
    });
    const nodes = await $$('.react-flow__node-actual');
    expect(nodes.length).toBe(7);
    const nodesText = await Promise.all(nodes.map((node) => node.getText()));
    expect(nodesText).toContain('AppService\ngetHello');
  });
});
