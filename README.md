***Structured Logging using Winston.***

Good formatting for developers working with it in a terminal.

Nice clean JSON when logs aren't being piped through a tty.

---------

**Env Vars:**

`process.env['LOGLEVEL']`

Minimum log level, so set this to `info` and `debug` messages will *NOT* come through.

Needs the actual level name, `debug`, rather than the `config.mjs`-associated numerical value (1).

`process.env['SHOWMETA']`

Normally metadata won't show on the TTY console feed, you have to enable it by either setting this env var (showing metadata for all log messages
while that var is set), or you could do something like for individual messages:

```javascript
logger.message('badda-bing', { show: 'The Sopranos', _show_meta: 1 });
```

That `_show_meta: 1` in the metadata block is telling the winston formatter to output the metadata with the message as an indented JSON string.

---------

**Config:**

You can use any loglevel scheme you want, I personally choose the ES Console logging methods, but you can switch to syslog by modifying config.mjs

---------

**TODO:**

* Sensitive content masking. Though maybe not as I've yet to find any winston implementation to do it right and make it easy to turn off for
a single message if you absolutely must because some bit of info you really need matches some really horribly-written regex and gets filtered out.
What? No, I'm fine.  Yeah, really.  I'm OK.  Just some PTSD there, I'll work it out and get back to you.

* Add transport for sending to ELK, either local Docker instance or a real endpoint, don't care which as target will be definable in env vars.

* Clean up some of the comments, especially trying to get the caller's file/line # from stack trace.
