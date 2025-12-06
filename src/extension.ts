"use strict";
import * as vscode from "vscode";

let restartTsServerStatusBarItem: vscode.StatusBarItem;

const typeScriptExtensions = [
	{
		extensionId: "vscode.typescript-language-features",
		restartCommandId: "typescript.restartTsServer"
	},
	{
		extensionId: "TypeScriptTeam.native-preview",
		restartCommandId: "typescript.native-preview.restart"
	}
];

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
	const commands = await vscode.commands.getCommands(true);

	for (const extensionData of typeScriptExtensions) {
		const stradaTypeScriptExtension = vscode.extensions.getExtension(extensionData.extensionId);
		if (stradaTypeScriptExtension?.isActive && commands.includes(extensionData.restartCommandId)) {
			await vscode.commands.executeCommand(extensionData.restartCommandId);
			return;
		}
	}

	vscode.window.showErrorMessage("No TypeScript extension is active or running.");
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

// This method is called when your extension is deactivated
export function deactivate() {
}
