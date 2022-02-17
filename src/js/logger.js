/** Log throttling, etc */
const THROTTLE_TIME_MS = 3000;

class Logger {
  constructor() {
    this.queues = {};
  }

  #addToQueue(msg, severity) {
    const queue = this.queues[msg];

    if (queue) {
      console.assert(queue.severity === severity, `Severity mismatch: ${queue.severity} vs ${severity}`);
      queue.count += 1;
    }
    else {
      this.queues[msg] = {
        msg,
        count: 1,
        severity: severity,
        timeout: setTimeout(() => {
          const queue = this.queues[msg];
          const str = `${msg} (x${queue.count})`;

          if (severity === 'error') {
            console.error(str);
          } else if (severity === 'warn') {
            console.warn(str);
          } else {
            console.log(str);
          }

          this.queues[msg] = null;
        }, THROTTLE_TIME_MS)
      };
    }
  }

  log(msg) {
    this.#addToQueue(msg, 'log');
  }

  warn(msg) {
    this.#addToQueue(msg, 'warn');
  }

  error(msg) {
    this.#addToQueue(msg, 'error');
  }
}


const logger = new Logger();
export default logger;
