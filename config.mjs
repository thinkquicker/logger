import Winston from 'winston';

const syslogColors = {
    emerg:      'brightWhite bgBrightRed',    // exception, emergency, emerg, etc.
    alert:      'brightWhite bgRed',          // alert
    critical:   'brightRed',                  // critical
    error:      'red',                        // err
    warn:       'black bgYellow',             // warn
    notice:     'bold yellow',                // notice
    info:       'white',                       // info
    debug:      'gray',                      // debug
};
const npmColors = {
    error:      'brightWhite bgBrightRed',    // exception, emergency, emerg, etc.
    warn:       'brightRed',                  // critical
    info:       'white',                       // info
    http:       'dim magenta',
    verbose:    'dim cyan',
    debug:      'dim blue',                      // debug
    silly:      'gray'
};

export const logColors = npmColors; // or syslogColors
export const logLevels = Winston.config.npm.levels; // or Winston.config.npm.syslog, or there's cli also
