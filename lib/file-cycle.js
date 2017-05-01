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

	cycleableFiles(dir, file) {
		const files = fs.readdirSync(dir).filter(f => !fs.statSync(path.join(dir, f)).isDirectory());
		const sameNameFiles = files.filter(f => nameWithoutExtension(f) === nameWithoutExtension(file));
		return sameNameFiles.sort(f => path.extname(f));
	},

	cycle(direction) {
		const editor = atom.workspace.getActiveTextEditor();
		const file = editor.getFileName();
		const dir = path.dirname(editor.getPath());
		const cycleableFiles = this.cycleableFiles(dir, file);
		let nextIndex;
		for (let i = 0; i < cycleableFiles.length; i += 1) {
			if (cycleableFiles[i] === file) {
				nextIndex = i + direction;
				nextIndex = nextIndex >= cycleableFiles.length ? 0 : nextIndex;
				nextIndex = nextIndex < 0 ? cycleableFiles.length - 1 : nextIndex;
			}
		}

		const nextFile = cycleableFiles[nextIndex];
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
