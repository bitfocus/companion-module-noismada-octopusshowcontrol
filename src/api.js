const { InstanceStatus, TCPHelper } = require('@companion-module/base')

module.exports = {
	initConnection: function() {
		let self = this;

		if (self.config.host) {
			self.tcp = new TPCHelper(self.config.host, 10001);

			self.tcp.on('error', function () {
				// Ignore
			});

			self.tcp.on('connect', function () {
				self.updateStatus(InstanceStatus.Ok);
			});
		}
	},

	sendCommand: function(cmd) {
		let self = this;
		
		if (self.config.verbose) {
			self.log('info', 'Sending: ' + cmd);
		}

		if (self.tcp !== undefined) {		
			if (cmd !== undefined) {
				self.tcp.send(cmd);
			}
		}
		else {	
			if (self.config.verbose) {
				self.log('warn', 'Unable to send: Not connected.');
			}
		}
	}
}