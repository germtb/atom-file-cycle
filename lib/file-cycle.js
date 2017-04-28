'use babel';

import fs from 'fs';
import path from 'path';

const nameWithoutExtension = (name) => {
	return name.split('.')[0];
};

export default {

	subscriptions: null,

	activate(state) {
		this.subscriptions = [];

		this.subscriptions.push(atom.commands.add('atom-workspace', {
			'file-cycle:cycle-abc': () => this.cycleABC()
		}));

		this.subscriptions.push(atom.commands.add('atom-workspace', {
			'file-cycle:cycle-cba': () => this.cycleCBA()
		}));

	},

	cycle(direction) {
		const editor = atom.workspace.getActiveTextEditor();
		const file = editor.getFileName();
		const dir = path.dirname(editor.getPath());
		const fileWithoutExtension = nameWithoutExtension(file);
		const cycleableFiles = fs.readdirSync(dir).filter(f => nameWithoutExtension(f) === fileWithoutExtension);
		const sortedFiles = cycleableFiles.sort(f => path.extname(f));
		let nextIndex;
		for (let i = 0; i < sortedFiles.length; i += 1) {
			if (sortedFiles[i] === file) {
				nextIndex = i + direction;
				nextIndex = nextIndex >= sortedFiles.length ? 0 : nextIndex;
				nextIndex = nextIndex < 0 ? sortedFiles.length - 1 : nextIndex;
			}
		}

		const nextFile = sortedFiles[nextIndex];
		atom.workspace.open(path.join(dir, nextFile));
	},

	cycleABC() {
		this.cycle(1);
	},

	cycleCBA() {
		this.cycle(-1);
	},

	deactivate() {
		this.subscriptions.forEach(s => s.dispose());
		this.subscriptions = [];
	},

	serialize() {
		return {};
	},

};
