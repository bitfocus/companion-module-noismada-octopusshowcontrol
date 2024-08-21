const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')

const config = require('./src/config')
const actions = require('./src/actions')

const constants = require('./src/constants')
const api = require('./src/api')

class octopusInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...config,
			...actions,
			...constants,
			...api,
		})
	}

	async destroy() {
		if (this.tcp !== undefined) {
			this.tcp.destroy()
		}
	}

	async init(config) {
		this.updateStatus(InstanceStatus.Connecting)
		this.configUpdated(config)
	}

	async configUpdated(config) {
		this.config = config

		if (this.config.verbose) {
			this.log('info', 'Verbose mode enabled. Log entries will contain detailed information.');
		}

		if (this.config.version == undefined) {
			this.config.version = 'free'
		}
	
		this.updateStatus(InstanceStatus.Connecting)
	
		this.initActions();
	}
}

runEntrypoint(octopusInstance, UpgradeScripts)