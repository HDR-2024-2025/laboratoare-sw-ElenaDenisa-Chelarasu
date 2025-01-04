// logger.js
const { createLogger, format, transports } = require('winston');
const FileRotateTransport = require('fast-file-rotate');
const { combine, timestamp, printf, colorize, prettyPrint } = format;
const os = require('os');

const customLevels = {
    levels: {
        critical: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4
    },
    colors: {
        critical: 'red',
        error: 'magenta',
        warn: 'yellow',
        info: 'green',
        debug: 'grey'
    }
};

const customFormat = format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.prettyPrint(),
    format.printf((info) => {
        const pid = process.pid || 'N/A';
        const hostname = os.hostname() || 'N/A';
        
        return `${info.timestamp} [${pid || 'N/A'}] ${hostname || 'N/A'} ${info.method || 'N/A'} ${info.route || 'N/A'} ${info.ip || 'N/A'} ${info.statusCode || 'N/A'} ${info.level}: ${info.message}`;
    })
);

const logger = createLogger({
    levels: customLevels.levels,
    level: 'info',
    format: customFormat,
    transports: [
        new transports.Console(),
        new transports.File({
            filename: __dirname + '/logs/console%DATE%.txt',
            format: format.json({ space: 2 })
        })
    ]
});

module.exports = logger;