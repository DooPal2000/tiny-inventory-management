const morgan = require('morgan');
const winston = require('winston');
const path = require('path');

// winston logger 생성 (미리 utils/logger.js에서 만들 수도 있지만 여기서 직접 만들 수도 있음)
const logger = winston.createLogger({
  level: 'debug',
  transports: [
    // 1. 콘솔 전용 포맷
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ level: true }),
        winston.format.timestamp({
          format: () => {
            const date = new Date();
            const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000); // +9시간
            return kst.toISOString().replace('Z', '+09:00');
          }
        }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      )
    }),
    // 2. 파일 전용 포맷
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'warn',
      format: winston.format.combine(
        winston.format.timestamp({
          format: () => {
            const date = new Date();
            const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000); // +9시간
            return kst.toISOString().replace('Z', '+09:00');
          }
        }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
      )
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: () => {
            const date = new Date();
            const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000); // +9시간
            return kst.toISOString().replace('Z', '+09:00');
          }
        }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
      )
    }),
  ],
});

const morganMiddleware = morgan((tokens, req, res) => {
  const status = Number(tokens.status(req, res));
  const log = [
    tokens.method(req, res),
    tokens.url(req, res),
    status,
    tokens['response-time'](req, res), 'ms',
    '-',
    tokens.res(req, res, 'content-length') || '0', 'bytes'
  ].join(' ');

  if (status >= 500) {
    logger.error(log);
  } else if (status >= 400) {
    logger.warn(log);
  } else {
    logger.info(log);
  }

  return null; // morgan의 기본 출력 방지
});

module.exports = morganMiddleware;
