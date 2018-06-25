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
    }
};

// Return config fields for web config
instance.prototype.config_fields = function () {
    var self = this;
    return [
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

instance.prototype.actions = function (system) {
    var self = this;

    self.system.emit('instance_actions', self.id, {
        'slide': {
            label: 'Goto slide (nr)',
            options: [
                {
                    type: 'textinput',
                    label: 'Slide Nr.',
                    id: 'slide',
                    default: 1,
                    regex: self.REGEX_NUMBER
                }
            ]
        },

        'custom': {
            label: 'custom command',
            options: [
                {
                    type: 'textinput',
                    label: 'Custom command',
                    id: 'custom',
                    default: 1,
                    regex: self.REGEX_NUMBER
                }
            ]
        },

        'next': { label: 'next slide' },
        'previous': { label: 'previous slide' },
        'play': { label: 'start presentation' },
        'first': { label: 'first slide' },
        'exit': { label: 'exit presentation' }
    });
};


instance.prototype.action = function (action) {
    var self = this;
    var id = action.action;
    var cmd;
    var opt = action.options;


    switch (action.action) {

        case 'slide':
            cmd = 'P<TYPE>G*' + opt.slide + '<ENDOFTRANS>';
            break;

        case 'custom':
            cmd = opt.custom;
            break;

        case 'next':
            cmd = 'P<TYPE>N<ENDOFTRANS>';
            break;

        case 'previous':
            cmd = 'P<TYPE>B<ENDOFTRANS>';
            break;

        case 'play':
            cmd = 'P<TYPE>P<ENDOFTRANS>';
            break;

        case 'first':
            cmd = 'P<TYPE>G*1<ENDOFTRANS>';
            break;

        case 'exit':
            cmd = 'P<TYPE>S<ENDOFTRANS>';
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
    label: 'Octopus Listener PPT',
    id: 'PPT',
    version: '0.0.1'
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;