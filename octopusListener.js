let instance_skel = require('../../instance_skel')
let tcp           = require('../../tcp')
let actions       = require('./actions')
let debug
let log

class instance extends instance_skel {

	constructor(system,id,config) {
			super(system,id,config)

			Object.assign(this, {...actions})

			this.actions()
	}

	actions(system) {
		let version
		(this.config.version == undefined) ? version = 'free' : version = this.config.version
		this.setActions(this.getActions(version));
	}

	// Return config fields for web config
	config_fields() {

		return [
			{
				type:    'text',
				id:      'info',
				width:   12,
				label:   'Information',
				value:   'This module is for the Octopus Listener from <a href="http://noismada.com" target="_new">noismada.com</a> (free) or <a href="http://octopusshowcontrol.com" target="_new">octopusshowcontrol.com</a> (paid)'
			},
			{
				type:    'textinput',
				id:      'host',
				label:   'Target IP',
				width:   6,
				regex:   this.REGEX_IP
			},
			{
				type:    'dropdown',
				id:      'version',
				label:   'Version',
				width:   6,
				default: 'free',
				choices: [{ id: 'free', label: 'free'},{ id: 'paid', label: 'paid'}]
			}
		]
	}

	init() {
		debug = this.debug
		log = this.log

		this.status(this.STATUS_UNKNOWN);

		if (this.config.host !== undefined) {
			this.tcp = new tcp(this.config.host, 10001);

			this.tcp.on('status_change', (status, message) => {
				this.status(status, message);
			});

			this.tcp.on('error', function () {
				// Ignore
			});
		}
	}

	updateConfig(config) {
		this.config = config;

		if (this.tcp !== undefined) {
			this.tcp.destroy();
			delete this.tcp;
		}
		// Octopus Listener port 10001
		if (this.config.host !== undefined) {
			this.tcp = new tcp(this.config.host, 10001);

			this.tcp.on('status_change', (status, message) => {
				this.status(status, message);
			});

			this.tcp.on('error', function (message) {
				// ignore for now
			});
		}

		this.actions()
	}

	// When module gets deleted
	destroy() {
		if (this.tcp !== undefined) {
			this.tcp.destroy()
		}
		debug("destroy", this.id)
	}

	action(action) {
		var id = action.action
		var cmd
		var opt = action.options
		let version

		(this.config.version == undefined) ? version = 'free' : version = this.config.version

		switch (id) {

			case 'custom':
				cmd = opt.custom
			break;

			case 'customkey':
				if(version == 'paid') {
					cmd = `<TYPE>KS</TYPE><Value1>${opt.cust_GKS}</Value1>`
				} else {
					cmd = 'GKS<TYPE>'+ 'None*' + opt.cust_GKS + '<ENDOFTRANS>'
				}
				break;

			case 'GKS':
				if(version == 'paid') {
					if(opt.GSK_Mod == 'none') {
						cmd = `<TYPE>KS</TYPE><Value1>${opt.GKS}</Value1>`
					} else {
						cmd = `<TYPE>KS</TYPE><Value1>${opt.GKS_Mod}</Value1><Value2>${opt.GKS}</Value2>`
					}
				} else {
					cmd = 'GKS<TYPE>'+ opt.GKS_Mod +'*' + opt.GKS + '<ENDOFTRANS>'
				}
				break;

			case 'pSlide':
				if(version == 'paid') {
					cmd = `<TYPE>P</TYPE><Value1>G</Value1><Value2>${opt.pSlide}</Value2>`
				} else {
					cmd = 'P<TYPE>G*' + opt.pSlide + '<ENDOFTRANS>'
				}
				break;

			case 'pNext':
				if(version == 'paid') {
					cmd = '<TYPE>P</TYPE><Value1>N</Value1>'
				} else {
					cmd = 'P<TYPE>N<ENDOFTRANS>'
				}
				break;

			case 'pPrevious':
				if(version == 'paid') {
					cmd = '<TYPE>P</TYPE><Value1>B</Value1>'
				} else {
					cmd = 'P<TYPE>B<ENDOFTRANS>'
				}
				break;

			case 'pPlay':
				if(version == 'paid') {
					cmd = '<TYPE>P</TYPE><Value1>P</Value1>'
				} else {
					cmd = 'P<TYPE>P<ENDOFTRANS>'
				}
				break;

			case 'pFirst':
				if(version == 'paid') {
					cmd = `<TYPE>P</TYPE><Value1>G</Value1><Value2>1</Value2>`
				} else {
					cmd = 'P<TYPE>G*1<ENDOFTRANS>'
				}
				break;

			case 'pOpen':
				if(version == 'paid') {
					cmd = '<TYPE>P</TYPE><Value1>O</Value1>'
				} else {
					cmd = 'P<TYPE>O<ENDOFTRANS>'
				}
				break;

			case 'pExit':
				if(version == 'paid') {
					cmd = '<TYPE>P</TYPE><Value1>Q</Value1>'
				} else {
					cmd = 'P<TYPE>S<ENDOFTRANS>'
				}
				break;

			case 'kNext':
				if(version == 'paid') {
					cmd = '<TYPE>K</TYPE><Value1>N</Value1>'
				} else {
					cmd = 'K<TYPE>N<ENDOFTRANS>'
				}
				break;

			case 'kPrevious':
				if(version == 'paid') {
					cmd = '<TYPE>K</TYPE><Value1>B</Value1>'
				} else {
					cmd = 'K<TYPE>B<ENDOFTRANS>'
				}
				break;

			case 'kPlay':
				if(version == 'paid') {
					cmd = '<TYPE>K</TYPE><Value1>P</Value1>'
				} else {
					cmd = 'K<TYPE>P<ENDOFTRANS>'
				}
				break;

			case 'kOpen':
				if(version == 'paid') {
					cmd = '<TYPE>K</TYPE><Value1>O</Value1>'
				} else {
					cmd = 'K<TYPE>O<ENDOFTRANS>'
				}
				break;

			case 'kExit':
				if(version == 'paid') {
					cmd = '<TYPE>K</TYPE><Value1>Q</Value1>'
				} else {
					cmd = 'K<TYPE>S<ENDOFTRANS>'
				}
				break;

			case 'kSlide':
				if(version == 'paid') {
					cmd = `<TYPE>K</TYPE><Value1>G</Value1><Value2>${opt.kSlide}</Value2>`
				} else {
					cmd = ''
				}
				break;

				case 'kFirst':
					if(version == 'paid') {
						cmd = `<TYPE>K</TYPE><Value1>G</Value1><Value2>1</Value2>`
					} else {
						cmd = ''
					}
					break;

		}

		if (cmd !== undefined) {
			if (this.tcp !== undefined) {
				debug('sending ', cmd, "to", this.tcp.host);
				console.log(cmd);
				this.tcp.send(cmd);
			}
		}
	};

}
exports = module.exports = instance;
