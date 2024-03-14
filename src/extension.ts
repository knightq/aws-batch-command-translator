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
  // Regular expression to match command and arguments
  const regex = /(?:\w+\s)?([^\s]+)(?:\s(.*))?/;

  // Extract command and arguments from the selected text
  const match = selectedText.match(regex);
  if (!match) {
    return selectedText;
  }

  const [, command, argumentsStr] = match;

  // Split the arguments by space
  const argumentsArray = argumentsStr ? argumentsStr.split(/\s+/) : [];

  // Insert "scripts/batch_command" at the beginning of the array
  argumentsArray.unshift("scripts/batch_command");

  // Convert the array to a JSON string
  return JSON.stringify([command, ...argumentsArray]);
}

export function deactivate () { }
