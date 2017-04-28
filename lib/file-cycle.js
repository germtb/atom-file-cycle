'use babel';

import fs from 'fs';

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

	cycleABC() {
		console.log('cycle abc');
	},

	cycleCBA() {
		console.log('cycle cba');
	},

	deactivate() {
		this.subscriptions.forEach(s => s.dispose());
		this.subscriptions = [];
	},

	serialize() {
		return {};
	},

};
