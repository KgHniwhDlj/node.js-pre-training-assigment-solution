/**
 * task-05.js
 * Extend your Task 04 server by adding EventEmitter functionality,
 * logging, analytics, and new endpoints.
 *
 * Implement all TODOs below.
 */

 const http = require("http");
const url = require("url");
const { EventEmitter } = require("events");
const https = require("node:https");

// ---------- Utilities ----------

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(data);
}

function parseIdFromPath(pathname) {
  const m = pathname.match(/^\/todos\/(\d+)$/);
  return m ? Number(m[1]) : null;
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (e) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function nowISO() {
  return new Date().toISOString();
}

// ---------- Analytics ----------

class AnalyticsTracker {
  constructor() {
    this.stats = {
      totalCreated: 0,
      totalUpdated: 0,
      totalDeleted: 0,
      totalViews: 0,
      errors: 0,
      dailyStats: {},
    };
  }
  _bumpDaily(field) {
    // TODO: implement daily stats tracking
    // - use YYYY-MM-DD date keys
    // - track created, updated, deleted, views per day
    const today = new Date().toISOString().split("T")[0];

    if (!this.stats.dailyStats[today]) {
      this.stats.dailyStats[today] = {
        created:  0,
        updated:  0,
        deleted:  0,
        views:  0
      }
    }

    if (this.stats.dailyStats[today][field] !== undefined) {
      this.stats.dailyStats[today][field]++;
    }
  }
  trackCreated() {
    // TODO: implement tracking logic
    this.stats.totalCreated++;
    this._bumpDaily("created")
  }
  trackUpdated() {
    // TODO: implement tracking logic
    this.stats.totalUpdated++;
    this._bumpDaily("updated")
  }
  trackDeleted() {
    // TODO: implement tracking logic
    this.stats.totalDeleted++;
    this._bumpDaily("deleted")
  }
  trackViewed() {
    // TODO: implement tracking logic
    this.stats.totalViews++;
    this._bumpDaily("views")
  }
  trackError() {
    // TODO: implement tracking logic
    this.stats.errors++;
  }
  getStats() {
    // TODO: implement stats retrieval
    return this.stats
  }
}

// ---------- Console Logger ----------
class ConsoleLogger {
  todoCreated(data) {
    console.log(
      `📝 [${data.timestamp}] Created "${data.todo.title}" (ID: ${data.todo.id})`
    );
  }
  todoUpdated(data) {
    console.log(
      `✏️  [${data.timestamp}] Updated ID ${
        data.newTodo.id
      }; changed: ${data.changes.join(", ")}`
    );
  }
  todoDeleted(data) {
    console.log(
      `🗑️  [${data.timestamp}] Deleted "${data.todo.title}" (ID: ${data.todo.id})`
    );
  }
  todoViewed(data) {
    console.log(`👁️  [${data.timestamp}] Viewed ID ${data.todo.id}`);
  }
  todosListed(data) {
    console.log(`📃 [${data.timestamp}] Listed todos count=${data.count}`);
  }
  todoNotFound(data) {
    console.warn(
      `⚠️  [${data.timestamp}] Not found: id=${data.todoId} op=${data.operation}`
    );
  }
  validationError(data) {
    console.error(
      `❌ [${data.timestamp}] Validation error: ${data.errors.join(", ")}`
    );
  }
  serverError(data) {
    console.error(
      `💥 [${data.timestamp}] Server error in ${data.operation}: ${
        data.error && data.error.message
      }`
    );
  }
}

// ---------- Validation ----------
function validateTodoPayload(payload, isCreate = false) {
  const errors = [];
  const out = {};

  // TODO: implement full validation logic
  // - title: required, non-empty string
  // - description: optional, string
  // - completed: optional, boolean (default false)
  if (!payload || typeof payload !== "object") {
    return { errors: ["Invalid payload format"], values: out };
  }

  if (!isCreate) {
    if (payload.title !== undefined) {
      if (typeof payload.title !== "string" || payload.title === "") {
        errors.push("title must be a string and cannot be whitespace only");
      } else if (payload.title.length > 100) {
        errors.push("title can't be more than 100");
      } else {
        out.title = payload.title.trim();
      }
    }
  } else {
    if (typeof payload.title !== "string" || payload.title === "") {
      errors.push("title must be a string and cannot be whitespace only");
    } else if (payload.title.length > 100) {
      errors.push("title can't be more than 100");
    } else {
      out.title = payload.title.trim();
    }
  }

  if (payload.description !== undefined) {
    if (typeof payload.description !== "string") {
      errors.push("description must be a string");
    } else if (payload.description.length > 500) {
      errors.push("description can't be more than 500");
    } else {
      out.description = payload.description.trim();
    }
  } else if (isCreate) {
    out.description = "";
  }

  if (payload.completed !== undefined) {
    if (typeof payload.completed !== "boolean") {
      errors.push("completed must be a boolean");
    } else {
      out.completed = payload.completed;
    }
  } else if (isCreate) {
    out.completed = false;
  }

  return { errors, values: out };
}

class TodoServer extends EventEmitter {
  constructor(port = 3000) {
    super();
    this.port = port;
    this.todos = [];
    this.nextId = 1;

    // TODO: initialize analytics tracker
    this.analytics = new AnalyticsTracker();
    // TODO: initialize logger
    this.logger = new ConsoleLogger();
    // TODO: initialize recent events list keeping last 100 events
    this.recentEvents = [];
    this.maxEvents = 100;
    this.server = null;

    this._wireDefaultListeners();
  }

  _wireDefaultListeners() {
    const remember = (eventType) => (data) => {
      this.recentEvents.push({eventType, timestamp: nowISO(), data});
      if (this.recentEvents.length > 100) this.recentEvents.shift();
    };
    // Remember all key events for /events
    [
      "todoCreated",
      "todoUpdated",
      "todoDeleted",
      "todoViewed",
      "todosListed",
      "todoNotFound",
      "validationError",
      "serverError",
    ].forEach((evt) => this.on(evt, remember(evt)));

    // Logging
    this.on("todoCreated", (d) => this.logger.todoCreated(d));
    this.on("todoUpdated", (d) => this.logger.todoUpdated(d));
    this.on("todoDeleted", (d) => this.logger.todoDeleted(d));
    this.on("todoViewed", (d) => this.logger.todoViewed(d));
    this.on("todosListed", (d) => this.logger.todosListed(d));
    this.on("todoNotFound", (d) => this.logger.todoNotFound(d));
    this.on("validationError", (d) => this.logger.validationError(d));
    this.on("serverError", (d) => this.logger.serverError(d));

    // Analytics
    this.on("todoCreated", () => this.analytics.trackCreated());
    this.on("todoUpdated", () => this.analytics.trackUpdated());
    this.on("todoDeleted", () => this.analytics.trackDeleted());
    this.on("todoViewed", () => this.analytics.trackViewed());
    this.on("validationError", () => this.analytics.trackError());
    this.on("serverError", () => this.analytics.trackError());
  }

  /**
   * Start the server
   */
  async start() {
    // TODO: create HTTP server and bind request handler
    // TODO: listen on this.port
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        this._handleRequest(req, res).catch((err) => {
          this.emit("serverError", {
            errors: err,
            operation: "handleRequest",
            requestInfo: {
              method: req.method,
              url: req.url,
              userAgent: req.headers["user-agent"] || "unknown",
              ip: req.socket ? req.socket.remoteAddress : "unknown",
            },
          });
          sendJson(res, 400, {
            success: false,
            error: "Invalid request data"
          });
        });

      })
      this.server.on("error", (err) => {
        reject(err);
      });

      this.server.listen(this.port, () => {
        console.log("Server started on port", this.port);
        resolve();
      });
    });
  }

  /**
   * Stop the server
   */
  async stop() {
    // TODO: stop the HTTP server if running
    if (this.server === null) {
      return;
    }
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) {
          reject(err);
        }

        this.server = null;
        resolve();
      });
    })
  }

  /**
   * Handle incoming requests
   */
  async _handleRequest(req, res) {
    // TODO: implement CORS preflight handling
    // TODO: implement routes:
    // - /todos (GET, POST)
    // - /todos/:id (GET, PUT, DELETE)
    // - /analytics (GET)
    // - /events (GET)
    // TODO: emit events for CRUD, errors, validation, etc.
    // TODO: send JSON responses with proper status codes

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method.toUpperCase();

    const requestInfo = {
      method,
      url: req.url,
      userAgent: req.headers["user-agent"] || "unknown",
      ip: req.socket ? req.socket.remoteAddress : "unknown",
    }

    if (method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      return res.end();
    }
    if (method === "GET" && pathname === "/analytics") {
      return sendJson(res, 200, {
        success: true,
        data: this.analytics.getStats(),
      })
    } else if (method === "GET" && pathname === "/events") {
      const limit = parsedUrl.query.limit ? parseInt(parsedUrl.query.limit, 10) : this.recentEvents.length;
      const events = this.recentEvents.slice(-limit);
      return sendJson(res, 200, {
        success: true,
        data: events,
      });
    }

    if (pathname === "/todos") {
      if (method === "GET") {
        const filters = parsedUrl.query;
        let result = [...this.todos];
        if (parsedUrl.query.completed !== undefined) {
          const isCompleted = parsedUrl.query.completed === "true";
          result = result.filter(t => t.completed === isCompleted);
        }
        this.emit("todosListed", {
          todos: result,
          count: result.length,
          filters: filters,
          timestamp: nowISO(),
        });
        return sendJson(res, 200, {
          success: true,
          data: result,
          count: result.length
        })
      } else if (method === "POST") {
        let body ={}
        try {
          body = await parseBody(req);
          const { errors, values } = validateTodoPayload(body, true)

          const newTodo = {
            id: this.nextId++,
            ...values,
            createdAt: nowISO(),
            updatedAt: nowISO()
          }
          this.todos.push(newTodo)
          this.emit("todoCreated", {
            todo: newTodo,
            timestamp: nowISO(),
            requestInfo,

          })
          return sendJson(res, 201, {
            success: true,
            data: newTodo })

        } catch (e) {
          const { errors, values } = validateTodoPayload(body, true)
          this.emit("validationError", {
            errors,
            data: body,
            requestInfo
          });
          return sendJson(
              res, 400, {
                success: false,
                errors
              })
        }
        }

    }
    const id = parseIdFromPath(pathname);
    if (id !== null) {
      const todoIndex = this.todos.findIndex(t => t.id === id);
      const existingTodo = this.todos[todoIndex];

      if (!existingTodo) {
        this.emit("todoNotFound", {
          todoId: id,
          operation: method,
          timestamp: nowISO(),
        })
        return sendJson(res, 404, {success: false, error: "Todo not found"})
      }

        if (method === "GET") {
          this.emit("todoViewed", {
            todo: existingTodo,
            timestamp: nowISO(),
            requestInfo
          })
          return sendJson(res, 200, {
            success: true,
            data: existingTodo
          })
        } else if (method === "PUT") {
          let body = {}
          try {
            body = await parseBody(req)
            const validation = validateTodoPayload(body, false)

            const oldTodo = { ...existingTodo };
            const changes = Object
                .keys(validation.values)
                .filter((k) => validation.values[k] !== existingTodo[k]);

            Object.assign(existingTodo, validation.values, {updatedAt: nowISO()})

            this.emit("todoUpdated", {
              oldTodo,
              newTodo: existingTodo,
              changes,
              timestamp: nowISO(),
            })
            return sendJson(res, 200, {
              success: true,
              data: existingTodo
            })

          } catch (e) {
            const validation = validateTodoPayload(body, false)
            this.emit("validationError", {
              errors: validation.errors,
              data: body,
              requestInfo
            })
            return sendJson(
                res, 400, {
                  success: false,
                  validationErrors: validation.errors
                })
          }

        } else if (method === "DELETE") {
          this.todos.splice(todoIndex, 1)
          this.emit("todoDeleted", {
            todo: existingTodo,
            timestamp: nowISO(),
            requestInfo
          })
          return sendJson(res, 200, {
            success: true,
            data: existingTodo
          })
        }


    }

    return sendJson(res, 404, { success: false, error: "Route not found" });
  }


}

module.exports = { TodoServer };
