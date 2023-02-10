import Winston from 'winston';
import { logLevels, logColors } from './config.mjs';
import { formatErrInfo, formatOutput } from './formatters.mjs';

import stackback from 'stackback';
import path from 'path';

const isTTY = (process.stdout.isTTY || process.stdout._isStdio || process.stdout._type === 'tty') && !process.env['NOTATTY'];

const ttyFormat = Winston.format.combine(
    formatErrInfo(),
    Winston.format.colorize({ colors: logColors, all: true }),
    Winston.format.timestamp(),
    Winston.format.metadata({ key: 'meta', fillExcept: ['timestamp', 'message', 'level'] }), // don't move those into meta key
    formatOutput(),
);

const pipeFormat = Winston.format.combine(
    formatErrInfo(),
    Winston.format.timestamp(),
    Winston.format.metadata({ key: 'meta', fillExcept: ['timestamp', 'message', 'level'] }),
    Winston.format.prettyPrint(),
);

const transports = [
    new Winston.transports.Console({
            level: process.env.LOGLEVEL || 'silly',
            levels: logLevels,
            format: isTTY ? ttyFormat : pipeFormat,
    }),
];

const logger = Winston.createLogger({
  level: process.env.LOGLEVEL || 'silly',

  defaultMeta: {
    get invoker () {
      const e = new Error();
      const stacks = stackback(e);

/*
      let stack = stacks.shift();
      do {
        stack = stacks.shift();
        console.log(stack.getMethodName() + ' - ' + stack.getFunctionName() + ', next is: ' + stacks[0].getMethodName() + ', ' + stacks[0].getFunctionName());

        if (stack.getMethodName() !== 'DerivedLogger' || 
          (stack.getMethodName() == 'DerivedLogger' && stacks[0].getMethodName() !== 'DerivedLogger')) { // .getFunctionName() !== 'log')) {
            console.log("NEXT!");
        }
      } // DerivedLogger is the class Winston.createLogger spits out
      while (
        (stack.getMethodName() !== 'DerivedLogger' || 
        (stack.getMethodName() == 'DerivedLogger' && stacks[0].getMethodName() !== 'DerivedLogger'))); // .getFunctionName() !== 'log')

      // ok, this next stack should be this function, so everything before here was invoked by the winston instance to do the log.
      stacks.shift();
*/
      // hard-coded after trial-and error
      const frame = stacks[4]; // frame before this definition, keep stack in tact as this is a good stack up to this invokation

      // figure out how we were called so we can subtract our dir root from filenames later

      const __root = path.dirname(process.argv[Math.max(1, process.argv.length)-1]);            
      let __dir = path.dirname(frame.getFileName()).replace('file://','').replace(__root, '');
      if (__dir.length) __dir += '/';

      const __file = path.basename(frame.getFileName());
      const __lineNum = frame.getLineNumber();

      let meta = {
        __root,
        __dir,
        __file,
        __lineNum
      };

      return meta;
    }
  },
  transports
});

logger.err = logger.error;
logger.warn = logger.warning;

export default logger;
