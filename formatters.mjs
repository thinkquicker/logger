import Winston from 'winston';
import util from 'util';

export const formatErrInfo = Winston.format( info => {
    let err;
    if (info instanceof Error) {
        err = info;
    } else if (info.message instanceof Error) {
        err = info.message;
    } else {
        return info;
    }

    info.__err = err;
    info.message = err.message;

    return info;
});

export const formatOutput = () => {
    return Winston.format.printf( info => {
        let msg = `${info.timestamp} ${info.level} (${info.meta.invoker.__dir}${info.meta.invoker.__file}:${info.meta.invoker.__lineNum})\t${info.message}`;

        if (info.meta.length > 1 && (info.meta.__show_meta || process.env.SHOWMETA)) {
            const indent = '\t\t\t\t\t\t';

            const out = util.inspect(info.meta, { depth: 1, compact: true, colors: true });

            msg += '\n' + indent + '[meta]: ' + out.replace(/(\n)/g, '\n' + indent);
        }

        return msg;
    });
};
