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
  // Regular expression to match commands and arguments
  const regex = /(?:\w+\s)?([^\s]+)(?:\s(.*))?/;

  // Extract command and arguments from the selected text
  const match = selectedText.match(regex);
  if (!match) {
    return selectedText;
  }

  const [, command, argumentsStr] = match;

  // Create an array with the command and its arguments
  const transformedArray = [command];
  if (argumentsStr) {
    transformedArray.push(...argumentsStr.split(/\s+/));
  }

  // Convert the array to a JSON string
  return JSON.stringify(transformedArray);
}

export function deactivate () { }
