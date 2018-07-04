var instance_skel = require('../../instance_skel');
var tcp = require('../../tcp');
var debug;
var log;

function instance(system, id, config) {
		var self = this;

		// super-constructor
		instance_skel.apply(this, arguments);
		self.actions(); // export actions
		return self;
}

instance.prototype.init = function () {
		var self = this;

		debug = self.debug;
		log = self.log;

		self.status(self.STATUS_UNKNOWN);

		if (self.config.host !== undefined) {
			self.tcp = new tcp(self.config.host, 10001);

			self.tcp.on('status_change', function (status, message) {
				self.status(status, message);
			});

			self.tcp.on('error', function () {
				// Ignore
			});
		}
};

instance.prototype.updateConfig = function (config) {
		var self = this;
		self.config = config;

		if (self.tcp !== undefined) {
			self.tcp.destroy();
			delete self.tcp;
		}
		// Octopus Listener port 10001
		if (self.config.host !== undefined) {
			self.tcp = new tcp(self.config.host, 10001);

			self.tcp.on('status_change', function (status, message) {
				self.status(status, message);
			});

			self.tcp.on('error', function (message) {
				// ignore for now
			});
		}
};

// Return config fields for web config
instance.prototype.config_fields = function () {
		var self = this;
		return [{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module is for the Octopus Listener from <a href="http://noismada.com" target="_new">noismada.com</a>.'
			},
			{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: self.REGEX_IP
			}
		]
};

// When module gets deleted
instance.prototype.destroy = function () {
		var self = this;

		if (self.tcp !== undefined) {
			self.tcp.destroy();
		}
		debug("destroy", self.id);
};

instance.prototype.CHOICES_KEYS = [
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
		{ label: 'p', id: 'p' }

];
instance.prototype.CHOICES_KEYSModifier = [
		{ label: 'None', id: 'Enter' },
		{ label: 'Option/Alt', id: 'Option/Alt' },
		{ label: 'Control', id: 'Control' },
		{ label: 'Shift', id: 'Shift' }
];

instance.prototype.actions = function (system) {
		var self = this;

		self.system.emit('instance_actions', self.id, {
				'customkey': {
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
				},
				'GKS': {
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
					]
				},

				'pSlide': {
					label: 'PPT goto slide (nr)',
					options: [
						{
							type: 'textinput',
							label: 'Slide Nr.',
							id: 'pSlide',
							default: 1,
							regex: self.REGEX_NUMBER
						}
					]
				},

				'pNext':      { label: 'PPT Next slide' },
				'pPrevious':  { label: 'PPT Previous slide' },
				'pPlay':      { label: 'PPT Start presentation' },
				'pFirst':     { label: 'PPT First slide' },
				'pExit':      { label: 'PPT Exit presentation' },

				'kSlide': {
					label: 'Keynote goto slide (nr)',
					options: [
						{
							type: 'textinput',
							label: 'Slide Nr.',
							id: 'kSlide',
							default: 1,
							regex: self.REGEX_NUMBER
						}
					]
				},

				'kNext':       { label: 'Keynote Next slide' },
				'kPrevious':   { label: 'Keynote Previous slide' },
				'kPlay':       { label: 'Keynote Start presentation' },
				'kFirst':      { label: 'Keynote First slide' },
				'kExit':       { label: 'Keynote Exit presentation' }
		});
};


instance.prototype.action = function (action) {
		var self = this;
		var id = action.action;
		var cmd;
		var opt = action.options;

		switch (action.action) {

			case 'custom':
				cmd = opt.custom ;
			break;

			case 'customkey':
				cmd = 'GKS<TYPE>'+ 'none*' + opt.cust_GKS + '<ENDOFTRANS>';
			break;

			case 'GKS':
				cmd = 'GKS<TYPE>'+ opt.GKS_Mod +'*' + opt.GKS + '<ENDOFTRANS>';
			break;

			case 'pSlide':
				cmd = 'P<TYPE>G*' + opt.pSlide + '<ENDOFTRANS>';
			break;

			case 'pNext':
				cmd = 'P<TYPE>N<ENDOFTRANS>';
			break;

			case 'pPrevious':
				cmd = 'P<TYPE>B<ENDOFTRANS>';
			break;

			case 'pPlay':
				cmd = 'P<TYPE>P<ENDOFTRANS>';
			break;

			case 'pFirst':
				cmd = 'P<TYPE>G*1<ENDOFTRANS>';
			break;

			case 'pExit':
				cmd = 'P<TYPE>S<ENDOFTRANS>';
			break;

			case 'kSlide':
				cmd = 'K<TYPE>G*' + opt.kSlide + '<ENDOFTRANS>';
			break;

			case 'kNext':
				cmd = 'K<TYPE>N<ENDOFTRANS>';
			break;

			case 'kPrevious':
				cmd = 'K<TYPE>B<ENDOFTRANS>';
			break;

			case 'kPlay':
				cmd = 'K<TYPE>P<ENDOFTRANS>';
			break;

			case 'kFirst':
				cmd = 'K<TYPE>G*1<ENDOFTRANS>';
			break;

			case 'kExit':
				cmd = 'K<TYPE>S<ENDOFTRANS>';
			break;

		}

		if (cmd !== undefined) {
			if (self.tcp !== undefined) {
				debug('sending ', cmd, "to", self.tcp.host);
				self.tcp.send(cmd);
			}
		}
};

instance.module_info = {
		label: 'Octopus Listener',
		id: 'octopusListener',
		version: '0.0.3'
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
