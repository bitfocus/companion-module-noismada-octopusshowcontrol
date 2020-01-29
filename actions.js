exports.getActions  = function(version) {
		let CHOICES_KEYSModifier = [
			{ label: 'None', id: 'None' },
			{ label: 'Option/Alt', id: 'Option/Alt' },
			{ label: 'Control', id: 'Control' },
			{ label: 'Shift', id: 'Shift' }
		];

		let CHOICES_KEYS = [
			{ label: 'Enter', id: 'Enter' },
			{ label: 'Space', id: 'Space' },
			{ label: 'Arrow up', id: 'Up Arrow' },
			{ label: 'Arrow Down', id: 'Down Arrow' },
			{ label: 'Arrow Left', id: 'Left Arrow' },
			{ label: 'Arrow Right', id: 'Right Arrow' },
			{ label: 'Delete', id: 'Delete' },
			{ label: 'Return', id: 'Return' },
			{ label: 'Esc', id: 'Esc' },
			{ label: 'Tab', id: 'Tab' },
			{ label: 'Page Down', id: 'Page Down' },
			{ label: 'Page Up', id: 'Page Up' },
			{ label: 'End', id: 'End' },
			{ label: 'Home', id: 'Home' },
			{ label: 'Help', id: 'Help' },
			{ label: 'Caps Lock', id: 'Caps Lock' },
			{ label: 'Clear', id: 'Clear' },
			{ label: '1', id: '1' },
			{ label: '2', id: '2' },
			{ label: '3', id: '3' },
			{ label: '4', id: '4' },
			{ label: '5', id: '5' },
			{ label: '6', id: '6' },
			{ label: '7', id: '7' },
			{ label: '8', id: '8' },
			{ label: '9', id: '9' },
			{ label: '0', id: '0' },
			{ label: 'b', id: 'b' },
			{ label: 'w', id: 'w' },
			{ label: 'r', id: 'r' },
			{ label: 'n', id: 'n' },
			{ label: 'p', id: 'p' },
			{ label: 'F1', id: 'F1' },
			{ label: 'F2', id: 'F2' },
			{ label: 'F3', id: 'F3' },
			{ label: 'F4', id: 'F4' },
			{ label: 'F5', id: 'F5' },
			{ label: 'F6', id: 'F6' },
			{ label: 'F7', id: 'F7' },
			{ label: 'F8', id: 'F8' },
			{ label: 'F9', id: 'F9' },
			{ label: 'F10', id: 'F10' },
			{ label: 'F11', id: 'F11' },
			{ label: 'F12', id: 'F12' },
			{ label: 'F13', id: 'F13' },
			{ label: 'F14', id: 'F14' },
			{ label: 'F15', id: 'F15' }
		];

		var actions = {}

		actions['customkey'] = {
			label: 'Hot(single)key',
			options: [
				{
					type: 'textinput',
					label: 'Single key to send',
					id: 'cust_GKS',
					default: 'n',
					regex: '/^.$/'
				}
			]
		}

		actions['pSlide'] = {
			label: 'PPT goto slide (nr)',
			options: [
				{
					type: 'textinput',
					label: 'Slide Nr.',
					id: 'pSlide',
					default: 1,
					regex: this.REGEX_NUMBER
				}
			]
		}

		if(version == 'free') {
			actions['GKS'] = {
				label: 'General Keystroke',
				options: [
					{
						type: 'dropdown',
						label: 'Modifier',
						id: 'GKS_Mod',
						default: 'None',
						choices: CHOICES_KEYSModifier
					},
					{
						type: 'dropdown',
						label: 'Key',
						id: 'GKS',
						default: 'Space',
						choices: CHOICES_KEYS
					}
				]
			}
		}
		
		actions['pNext']     = { label: 'PPT Next slide' }
		actions['pPrevious'] = { label: 'PPT Previous slide' }
		actions['pPlay']     = { label: 'PPT Start presentation' }
		actions['pFirst']    = { label: 'PPT First slide' }
		actions['pOpen']     = { label: 'PPT Open' }
		actions['pExit']     ={ label: 'PPT Exit presentation' }

		if(version == 'paid') {
			actions['kSlide'] = {
				label: 'Keynote goto slide (nr)',
				options: [
					{
						type: 'textinput',
						label: 'Slide Nr.',
						id: 'kSlide',
						default: 1,
						regex: this.REGEX_NUMBER
					}
				]
			}

			actions['kFirst']  = { label: 'Keynote First slide' }
		}



		actions['kNext']     = { label: 'Keynote Next slide' }
		actions['kPrevious'] = { label: 'Keynote Previous slide' }
		actions['kPlay']     = { label: 'Keynote Start presentation' }

		actions['kOpen']     = { label: 'Keynote Open' }
		actions['kExit']     = { label: 'Keynote Exit presentation' }

		return actions
}
