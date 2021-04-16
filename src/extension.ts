"use strict";
import * as vscode from "vscode";

let restartTsServerStatusBarItem: vscode.StatusBarItem;

const TYPESCRIPT_EXTENSION_ID = 'vscode.typescript-language-features';
const RESTART_TS_SERVER_LABEL = "$(debug-restart) Restart TS server";

const SUPPORTED_LANGUAGES = [
	"javascript",
	"javascriptreact",
	"typescript",
	"typescriptreact"
];

export async function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand("restartTsServerButton.softRestartTsServer", softRestartTsServer));

	restartTsServerStatusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
		0
	);
	restartTsServerStatusBarItem.command = "restartTsServerButton.softRestartTsServer";
	restartTsServerStatusBarItem.text = RESTART_TS_SERVER_LABEL;

	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItemVisibility));
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItemVisibility));
	context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(updateStatusBarItemVisibility));
	context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(updateStatusBarItemVisibility));

	updateStatusBarItemVisibility();
}

async function softRestartTsServer() {
	const typeScriptExtension = vscode.extensions.getExtension(TYPESCRIPT_EXTENSION_ID);
	if (!typeScriptExtension || typeScriptExtension.isActive === false) {
		vscode.window.showErrorMessage("TypeScript extension is not active or not running.");
		return;
	}

	await vscode.commands.executeCommand("typescript.restartTsServer");
}

function updateStatusBarItemVisibility(): void {
	const { activeTextEditor } = vscode.window;

	if (!activeTextEditor
		|| !activeTextEditor.document
		|| SUPPORTED_LANGUAGES.indexOf(activeTextEditor.document.languageId) === -1
	) {
		restartTsServerStatusBarItem.hide();
	} else {
		restartTsServerStatusBarItem.show();
	}
}

// this method is called when your extension is deactivated
export function deactivate() {
}
