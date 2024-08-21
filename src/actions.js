module.exports = {
	initActions: function () {
		let self = this;
		let actions = {};

		actions['customkey'] = {
			name: 'Hot(single)key',
			options: [
				{
					type: 'textinput',
					label: 'Single key to send',
					id: 'cust_GKS',
					default: 'n',
					useVariables: true,
				}
			],
			callback: async (action) => {
				let cmd = '';
				let key = self.parseVariablesInString(action.options.cust_GKS);
				if(self.config.version == 'paid') {
					cmd = `<TYPE>KS</TYPE><Value1>${key}</Value1>`
				} else {
					cmd = 'GKS<TYPE>'+ 'None*' + key + '<ENDOFTRANS>'
				}
				self.sendCommand(cmd);
			}
		}

		actions['pSlide'] = {
			name: 'PowerPoint: Go To Slide Number',
			options: [
				{
					type: 'textinput',
					label: 'Slide Number',
					id: 'pSlide',
					default: 1,
					useVariables: true,
				}
			],
			callback: async (action) => {
				let pSlide = self.parseVariablesInString(action.options.pSlide);
				let cmd = '';
				if(self.config.version == 'paid') {
					cmd = `<TYPE>P</TYPE><Value1>G</Value1><Value2>${pSlide}</Value2>`
				} else {
					cmd = 'P<TYPE>G*' + pSlide + '<ENDOFTRANS>'
				}
				self.sendCommand(cmd);
			}
		}

		actions['GKS'] = {
			label: 'General Keystroke',
			options: [
				{
					type: 'dropdown',
					label: 'Modifier',
					id: 'GKS_Mod',
					default: 'None',
					choices: self.CHOICES_KEYSModifier
				},
				{
					type: 'dropdown',
					label: 'Key',
					id: 'GKS',
					default: 'Space',
					choices: self.CHOICES_KEYS
				}
			],
			callback: async (action) => {
				let cmd = 'GKS<TYPE>'+ action.options.GKS_Mod +'*' + action.options.GKS + '<ENDOFTRANS>'
				self.sendCommand(cmd);
			}
		}

		actions['pNext'] = {
			name: 'PowerPoint: Next Slide',
			options: [],
			callback: async (action) => {
				if (self.config.version == 'paid') {
					self.sendCommand('<TYPE>P</TYPE><Value1>N</Value1>');
				}
				else {
					self.sendCommand('P<TYPE>N<ENDOFTRANS>');
				}
			}
		}

		actions['pPrevious'] = {
			name: 'PowerPoint: Previous Slide',
			options: [],
			callback: async (action) => {
				if (self.config.version == 'paid') {
					self.sendCommand('<TYPE>P</TYPE><Value1>B</Value1>');
				}
				else {
					self.sendCommand('P<TYPE>B<ENDOFTRANS>');
				}
			}
		}

		actions['pPlay'] = {
			name: 'PowerPoint: Start Presentation',
			options: [],
			callback: async (action) => {
				if (self.config.version == 'paid') {
					self.sendCommand('<TYPE>P</TYPE><Value1>S</Value1>');
				}
				else {
					self.sendCommand('P<TYPE>S<ENDOFTRANS>');
				}
			}
		}

		actions['pFirst'] = {
			name: 'PowerPoint: First Slide',
			options: [],
			callback: async (action) => {
				if (self.config.version == 'paid') {
					self.sendCommand('<TYPE>P</TYPE><Value1>F</Value1>');
				}
				else {
					self.sendCommand('P<TYPE>F<ENDOFTRANS>');
				}
			}
		}

		actions['pOpen'] = {
			name: 'PowerPoint: Open',
			options: [],
			callback: async (action) => {
				if (self.config.version == 'paid') {
					self.sendCommand('<TYPE>P</TYPE><Value1>O</Value1>');
				}
				else {
					self.sendCommand('P<TYPE>O<ENDOFTRANS>');
				}
			}
		}

		actions['pExit'] = {
			name: 'PowerPoint: Exit Presentation',
			options: [],
			callback: async (action) => {
				if (self.config.version == 'paid') {
					self.sendCommand('<TYPE>P</TYPE><Value1>Q</Value1>');
				}
				else {
					self.sendCommand('P<TYPE>Q<ENDOFTRANS>');
				}
			}
		}

		if(self.config.version == 'paid') {
			actions['kSlide'] = {
				name: 'Keynote: Go to Slide Number',
				options: [
					{
						type: 'textinput',
						label: 'Slide Nr.',
						id: 'kSlide',
						default: 1,
						useVariables: true,
					}
				],
				callback: async (action) => {
					let kSlide = self.parseVariablesInString(action.options.kSlide);
					let cmd = `<TYPE>K</TYPE><Value1>G</Value1><Value2>${kSlide}</Value2>`
				}
			}

			actions['kFirst'] = {
				name: 'Keynote: First Slide',
				options: [],
				callback: async (action) => {
					self.sendCommand('<TYPE>K</TYPE><Value1>G</Value1><Value2>1</Value2>');
				}
			}
		}

		actions['kNext'] = {
			name: 'Keynote: Next Slide',
			options: [],
			callback: async (action) => {
				if (self.config.version == 'paid') {
					self.sendCommand('<TYPE>K</TYPE><Value1>N</Value1>');
				}
				else {
					self.sendCommand('K<TYPE>N<ENDOFTRANS>');
				}
			}
		}

		actions['kPrevious'] = {
			name: 'Keynote: Previous Slide',
			options: [],
			callback: async (action) => {
				if (self.config.version == 'paid') {
					self.sendCommand('<TYPE>K</TYPE><Value1>B</Value1>');
				}
				else {
					self.sendCommand('K<TYPE>B<ENDOFTRANS>');
				}
			}
		}

		actions['kPlay'] = {
			name: 'Keynote: Start Presentation',
			options: [],
			callback: async (action) => {
				if (self.config.version == 'paid') {
					self.sendCommand('<TYPE>K</TYPE><Value1>S</Value1>');
				}
				else {
					self.sendCommand('K<TYPE>S<ENDOFTRANS>');
				}
			}
		}

		actions['kOpen'] = {
			name: 'Keynote: Open',
			options: [],
			callback: async (action) => {
				if (self.config.version == 'paid') {
					self.sendCommand('<TYPE>K</TYPE><Value1>O</Value1>');
				}
				else {
					self.sendCommand('K<TYPE>O<ENDOFTRANS>');
				}
			}
		}

		actions['kExit'] = {
			name: 'Keynote: Exit Presentation',
			options: [],
			callback: async (action) => {
				if (self.config.version == 'paid') {
					self.sendCommand('<TYPE>K</TYPE><Value1>Q</Value1>');
				}
				else {
					self.sendCommand('K<TYPE>Q<ENDOFTRANS>');
				}
			}
		}
		
		self.setActionDefinitions(actions);
	}
}