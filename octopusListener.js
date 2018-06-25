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
        'custom': {
            label: 'custom command',
            options: [
                {
                    type: 'textinput',
                    label: 'Custom command',
                    id: 'custom',
                    default: 1
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

        'pNext': { label: 'PPT Next slide' },
        'pPrevious': { label: 'PPT Previous slide' },
        'pPlay': { label: 'PPT Start presentation' },
        'pFirst': { label: 'PPT First slide' },
        'pExit': { label: 'PPT Exit presentation' },

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

        'kNext': { label: 'Keynote Next slide' },
        'kPrevious': { label: 'Keynote Previous slide' },
        'kPlay': { label: 'Keynote Start presentation' },
        'kFirst': { label: 'Keynote First slide' },
        'kExit': { label: 'Keynote Exit presentation' }
    });
};


instance.prototype.action = function (action) {
    var self = this;
    var id = action.action;
    var cmd;
    var opt = action.options;


    switch (action.action) {

        case 'custom':
            cmd = opt.custom;
            break;

        case 'pSlide':
            cmd = 'P<TYPE>G*' + opt.slide + '<ENDOFTRANS>';
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
            cmd = 'K<TYPE>G*' + opt.slide + '<ENDOFTRANS>';
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
    version: '0.0.1'
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
