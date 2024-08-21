const { Regex } = require('@companion-module/base')

module.exports = {
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				label: 'Information',
				width: 12,
				value: `This module is for the Octopus Listener from <a href="http://noismada.com" target="_new">noismada.com</a> (free) or <a href="http://octopusshowcontrol.com" target="_new">octopusshowcontrol.com</a> (paid)`
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Host',
				width: 3,
				default: '127.0.0.1',
				regex: Regex.IP
			},
			{
				type: 'static-text',
				id: 'info2',
				width: 12,
				label: '',
				value: '<hr />',
			},
			{
				type:    'dropdown',
				id:      'version',
				label:   'Version',
				width:   6,
				default: 'free',
				choices: [{ id: 'free', label: 'Free'},{ id: 'paid', label: 'Paid'}]
			},
			{
				type: 'static-text',
				id: 'info3',
				width: 12,
				label: '',
				value: '<hr />',
			},
			{
				type: 'static-text',
				id: 'info2',
				label: 'Verbose Logging',
				width: 12,
				value: `Enabling this option will put more detail in the log, which can be useful for troubleshooting purposes.`
			},
			{
				type: 'checkbox',
				id: 'verbose',
				label: 'Enable Verbose Logging',
				default: false
			},
		]
	}
}