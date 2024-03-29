import * as vscode from 'vscode';

export function activate (context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.awsBatchCommandTranslator', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active editor found.");
      return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    if (!selectedText) {
      vscode.window.showErrorMessage("No text selected.");
      return;
    }

    const transformedText = awsBatchCommandTranslator(selectedText);

    editor.edit(editBuilder => {
      editBuilder.replace(selection, transformedText);
    });
  });

  context.subscriptions.push(disposable);
}

function awsBatchCommandTranslator (selectedText: string): string {
  if (!selectedText) {
    return selectedText;
  }

  // Split the arguments by space
  const argumentsArray = selectedText.split(/\s+/)

  // Create the transformed array with "scripts/batch_command" as first element
  const transformedArray = ["scripts/batch_command", ...argumentsArray];

  // Convert the array to a JSON string
  return JSON.stringify(transformedArray);
}

export function deactivate () { }
