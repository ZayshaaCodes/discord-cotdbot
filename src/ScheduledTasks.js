const cron = require('node-cron');

class ScheduledTasks {
  constructor() {
    this.tasks = {};
  }

  add(id, schedule, func) {
    if (this.tasks[id]) {
      this.tasks[id].destroy();
    }

    this.tasks[id] = cron.schedule(schedule, () => {
      func();
      this.remove(id);
    }, { timezone: 'Etc/GMT' });
  }

  remove(id) {
    if (this.tasks[id]) {
      this.tasks[id].destroy();
      delete this.tasks[id];
    }
  }

  getTask(id) {
    return this.tasks[id];
  }
}

module.exports = ScheduledTasks;