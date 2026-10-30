// results_sink.js — where a study's results go: the role minno-datapipe's init_data_pipe() fills on the
// live site, kept behind the same function name and arguments so their study files call it unchanged.
//
// minno-datapipe registers a logger with the study manager (API.addSettings('logger', {onRow, onEnd,
// serialize, send})) and its `send` POSTs each task's rows to a server.  Here `send` hands the rows to
// a ResultsSink instead.  The default sink keeps them in the page for download; a sink that delivered
// them elsewhere (an upload the study's owners had agreed to, for instance) would replace only this
// class, nothing in their files or the loader.
//
// minno-datapipe has no licence file, so none of its code is copied here; only its interface is followed.

class DownloadResultsSink {
    constructor() {
        this.tasks = {};               // task name -> its logged rows, in the order the study logged them
    }

    receive(taskName, rows) {
        this.tasks[taskName] = rows;
    }

    /** All rows of all tasks as JSON: nothing flattened or dropped, so it can be re-read exactly. */
    asJson() {
        return JSON.stringify({ format: 'iat-offline-results 1', tasks: this.tasks }, null, 1);
    }

    /** Offer the results as a file download. Returns the link element (null when nothing was logged). */
    downloadLink(fileName = 'results.json') {
        if (!Object.keys(this.tasks).length) return null;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([this.asJson()], { type: 'application/json' }));
        link.download = fileName;
        link.textContent = `download ${fileName}`;
        return link;
    }
}

window.offlineResults = new DownloadResultsSink();

/** Same name and arguments as minno-datapipe's; experimentId and options are accepted and unused. */
function init_data_pipe(API, experimentId, options) {
    const sink = window.offlineResults;
    API.addSettings('logger', {
        onRow(logName, row, settings, context) {
            if (logName === API.script.name) {     // the manager's own log, which minno-datapipe skips too
                context.logs = [];
                context.isTask = false;
                return;
            }
            context.isTask = true;
            (context.logs = context.logs || []).push(row);
        },
        onEnd(name, settings, context) { return context.logs; },
        serialize(logName, rows) { return rows; },
        send(logName, rows, settings, context) {
            if (context.isTask) sink.receive(logName, rows);
        },
    });
}
