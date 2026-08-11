const http = require("http");
const url = require("url");

/**
 * Todo REST API Server
 * Built with Node.js built-in HTTP module
 * Supports full CRUD operations with in-memory storage
 */

/**
 * Parse JSON request body from HTTP request
 * @param {IncomingMessage} req - HTTP request object
 * @returns {Promise<Object>} Parsed JSON data
 */
function parseBody(req) {
  // TODO: Implement async JSON body parsing
  // 1. Create promise to handle async data streaming
  // 2. Listen for 'data' events to collect chunks
  // 3. Listen for 'end' event to parse complete body
  // 4. Handle JSON parsing errors gracefully
  // 5. Return empty object if no body provided

  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      if (!body) {
        return resolve({});
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);

      } catch (e) {
        reject(new Error("Invalid JSON"));
      }
    })
    req.on("error", (err) => {
      reject(err);
    })
    // Implementation goes here
        //console.log("Body parsing not implemented yet");
    //resolve({});
  });
}

/**
 * Extract path parameters from URL pattern
 * @param {string} pattern - URL pattern like '/todos/:id'
 * @param {string} path - Actual path like '/todos/123'
 * @returns {Object} Extracted parameters like { id: "123" }
 */
function parsePathParams(pattern, path) {
  // TODO: Implement path parameter extraction
  // 1. Split pattern and path by '/'
  // 2. Find segments that start with ':'
  // 3. Extract corresponding values from path
  // 4. Return object with parameter names and values
  // 5. Handle edge cases (no params, mismatched segments)

  const params = {};

  // Implementation goes here
  const splitPattern = pattern.split("/");

  const splitPath = path.split("/");

  if (splitPattern.length !== splitPath.length) {
    return params;
  }

  for (let i = 0; i < splitPattern.length; i++) {
    const partPattern = splitPattern[i];
    const partPath = splitPath[i];

    if (partPattern.startsWith(":")) {
      const paramName = partPattern.slice(1);
      params[paramName] = partPath;
    } else if (partPattern !== partPath) {
      return {};
    }
  }
  //console.log("Path params parsing not implemented yet");
  return params;
}

/**
 * Send consistent JSON response
 * @param {ServerResponse} res - HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Response data
 */
function sendResponse(res, statusCode, data) {
  // TODO: Implement consistent response sending
  // 1. Set proper HTTP status code
  // 2. Set Content-Type to application/json
  // 3. Add CORS headers for browser compatibility
  // 4. Convert data to JSON string
  // 5. Send response and end connection

  // Headers to set:
  // - Content-Type: application/json
  // - Access-Control-Allow-Origin: *
  // - Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  // - Access-Control-Allow-Headers: Content-Type

  res.statusCode = statusCode;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  let jsonString = JSON.stringify(data);
  //console.log("Response sending not implemented yet");
  res.end(jsonString);
}

/**
 * Validate todo data according to business rules
 * @param {Object} todoData - Todo data to validate
 * @param {boolean} isUpdate - Whether this is an update operation
 * @returns {Object} Validation result with errors array
 */
function validateTodo(todoData, isUpdate = false) {
  // TODO: Implement todo data validation
  // 1. Check title requirements (required, string, 1-100 chars, not whitespace-only)
  // 2. Check description (optional, string, max 500 chars)
  // 3. Check completed (optional, boolean only)
  // 4. Return validation result with errors array
  // 5. Handle update vs create validation differences

  const errors = [];

  if (!todoData || typeof todoData !== "object") {
    return { isValid: false, errors: ["Invalid body data"] };
  }

  if (!isUpdate) {
    if (typeof todoData.title !== "string" || todoData.title.trim() === "") {
      errors.push("Title is required and cannot be whitespace only");
    } else if (todoData.title.length > 100) {
      errors.push("Title cannot be longer than 100");
    }
  }else {
    if (todoData.title !== undefined) {
      if (typeof todoData.title !== "string" || todoData.title.trim() === "") {
        errors.push("Title must be a non-empty string");
      } else if (todoData.title.length > 100) {
        errors.push("Title cannot be longer than 100");
      }
    }
  }

  if (todoData.description !== undefined) {
    if (typeof todoData.description !== "string") {
      errors.push("Description must be a string");
    } else if (todoData.description.length > 500) {
      errors.push("Description cannot be longer than 500");
    }
  }

  if (todoData.completed !== undefined) {
    if (typeof todoData.completed !== "boolean") {
      errors.push("Completed must be a boolean");
    }
  }
  // Title validation
  // - Required for create, optional for update
  // - Must be string
  // - 1-100 characters
  // - Cannot be only whitespace

  // Description validation
  // - Optional field
  // - Must be string if provided
  // - Max 500 characters

  // Completed validation
  // - Optional field
  // - Must be boolean if provided

  //console.log("Todo validation not implemented yet");
  return { isValid: errors.length === 0, errors };
}

/**
 * TodoServer Class - Main HTTP server for Todo API
 */
class TodoServer {
  constructor(port = 3000) {
    // TODO: Initialize server properties
    // 1. Set port number
    // 2. Initialize empty todos array
    // 3. Set nextId counter for new todos
    // 4. Initialize with sample data

    this.port = port;
    this.todos = [];
    this.nextId = 1;

    // Sample todos for testing
    this.initializeSampleData();
  }

  /**
   * Initialize server with sample todo data
   */
  initializeSampleData() {
    // TODO: Add sample todos for testing
    // 1. Create 2-3 sample todos with proper structure
    // 2. Include variety: completed/incomplete, different dates
    // 3. Set proper id sequence for new todos

    const sampleTodos = [
      // Add sample todos here
      {
        id: this.generateNextId(),
        title: "Buy groceries for dinner",
        description: "Pick up fresh cucumbers, cherry tomatoes, cheese, and bread for sandwiches.",
        completed: false,
        createdAt: new Date("2026-08-08T10:15:00.000Z"),
        updatedAt: new Date("2026-08-08T10:15:00.000Z")
      },
      {
        id: this.generateNextId(),
        title: "Schedule annual dental checkup",
        description: "Call the clinic to book a cleaning appointment for next month.",
        completed: true,
        createdAt: new Date("2026-08-05T16:00:00.000Z"),
        updatedAt: new Date("2026-08-06T09:30:00.000Z")
      },
      {
        id: this.generateNextId(),
        title: "Plan weekend hiking trip",
        description: "Research trail options in the state park, check the weather forecast, and pack gear.",
        completed: false,
        createdAt: new Date("2026-08-07T18:45:00.000Z"),
        updatedAt: new Date("2026-08-07T18:45:00.000Z")
      },
      {
        id: this.generateNextId(),
        title: "Finish reading 'Dune'",
        description: "Read the final three chapters before movie night on Friday.",
        completed: true,
        createdAt: new Date("2026-08-01T12:00:00.000Z"),
        updatedAt: new Date("2026-08-08T21:10:00.000Z")
      }
    ];

    //console.log("Sample data initialization not implemented yet");
  }

  /**
   * Start the HTTP server
   */
  start() {
    // TODO: Create and start HTTP server
    // 1. Create HTTP server with request handler
    // 2. Listen on specified port
    // 3. Log server startup message
    // 4. Handle server errors
    const server = http.createServer((req, res) => {
      this.handleRequest(req, res).catch((err) => {
        console.error(err);
        if (!res["headersSent"]) {
          sendResponse(res, 500, {
            success: false,
            error: "Internal Server Error",
          })
        }
      });
    })

    server.on("error", (err) => {
      console.error("Server error: ", err);
    })

    server.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}/`);
    })
    //console.log("Server start not implemented yet");
  }

  /**
   * Main request handler - routes requests to appropriate methods
   * @param {InstanceType<typeof IncomingMessage>} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  async handleRequest(req, res) {
    // TODO: Implement main request routing
    // 1. Parse URL and extract pathname, query
    // 2. Route based on HTTP method and path pattern
    // 3. Handle CORS preflight requests (OPTIONS)
    // 4. Call appropriate handler method
    // 5. Handle unknown routes with 404

    try {
      const parsedUrl = url.parse(req.url, true);
      const { pathname, query } = parsedUrl;
      const method = req.method;

      // console.log(
      //   `${method} ${pathname} - Request handling not implemented yet`
      // );

      // Route to appropriate handler based on method and path
      // GET /todos -> getAllTodos
      // GET /todos/:id -> getTodoById
      // POST /todos -> createTodo
      // PUT /todos/:id -> updateTodo
      // DELETE /todos/:id -> deleteTodo
      // OPTIONS -> handleCORS

      const params = parsePathParams("/todos/:id", pathname);

      if (pathname === "/todos") {
        if (method === "GET") {
          return await this.getAllTodos(req, res, query);
        } else if (method === "POST") {
          return await this.createTodo(req, res);
        } else {
          return sendResponse(res, 405, {success: false, error: "Method not allowed"});
        }
      } else if (params.id) {
        if (method === "GET") {
          return await this.getTodoById(req, res, params);
        } else if (method === "PUT") {
          return await this.updateTodo(req, res, params);
        } else if (method === "DELETE") {
          return await this.deleteTodo(req, res, params);
        } else {
          return sendResponse(res, 405, {success: false, error: "Method not allowed"});
        }
      } else if (method === "OPTIONS") {
        this.handleCORS(req, res);
      } else {
        return sendResponse(res, 404, {success: false, error: "Route not found"});
      }

      // sendResponse(res, 501, {
      //   success: false,
      //   error: "Request handling not implemented yet",
      // });
    } catch (error) {
      console.error("Request handling error:", error);
      sendResponse(res, 500, {
        success: false,
        error: "Internal server error",
      });
    }
  }

  /**
   * Handle GET /todos - Get all todos with optional filtering
   * @param {InstanceType<IncomingMessage>} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} query - URL query parameters
   */
  async getAllTodos(req, res, query) {
    // TODO: Implement get all todos with filtering
    // 1. Get all todos from storage
    // 2. Apply completed filter if provided in query
    // 3. Return success response with data and count
    // 4. Handle query parameter validation

    let allTodos = this.todos;
    if (query || query.completed !== undefined) {
     if (query.completed === true) {
       allTodos = allTodos.filter(todo => todo.completed === true);
     } else if (query.completed === false) {
       allTodos = allTodos.filter(todo => todo.completed === false);
     }
    } else {
      return sendResponse(res, 400, {
        success: false,
        error: "Invalid completed query parameter"});
    }

    return sendResponse(res, 200, {
      success: true,
      data: allTodos,
      count: allTodos.length,
    })

    // console.log("Get all todos not implemented yet");
    // sendResponse(res, 501, {
    //   success: false,
    //   error: "Get all todos not implemented yet",
    // });
  }

  /**
   * Handle GET /todos/:id - Get specific todo by ID
   * @param {InstanceType<IncomingMessage>} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async getTodoById(req, res, params) {
    // TODO: Implement get todo by ID
    // 1. Extract ID from path parameters
    // 2. Find todo in storage
    // 3. Return 404 if not found
    // 4. Return success response with todo data
    // 5. Handle invalid ID format

    const numericId = parseInt(params.id, 10);

    if (isNaN(numericId)) {
      return sendResponse(res, 400, {
        success: false,
        error: "Invalid id",
      })
    }

    const todo = this.findTodoById(numericId);
    if (!todo) {
      return sendResponse(res, 404, {
        success: false,
        error: "Todo not found"
      })
    }
    // console.log("Get todo by ID not implemented yet");
    // sendResponse(res, 501, {
    //   success: false,
    //   error: "Get todo by ID not implemented yet",
    // });
    return sendResponse(res, 200, {
      success: true,
      data: todo
    })
  }

  /**
   * Handle POST /todos - Create new todo
   * @param {InstanceType<IncomingMessage>} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  async createTodo(req, res) {
    // TODO: Implement create new todo
    // 1. Parse request body
    // 2. Validate todo data
    // 3. Create new todo with generated ID and timestamps
    // 4. Add to storage
    // 5. Return 201 with created todo
    // 6. Handle validation errors
    try {
      const parsedBody = await parseBody(req);

      const validationError = validateTodo(parsedBody);

      if (!validationError.isValid) {
        return sendResponse(res, 400, {
          success: false,
          error: validationError.errors.join("; ") || "Validation Error"
        })
      }

      const newTodo = {
        //id: this.nextId++,
        id: this.generateNextId(),
        title: parsedBody.title.trim(),
        description: parsedBody.description ? parsedBody.description.trim() : "",
        completed: parsedBody.completed ?? false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      this.todos.push(newTodo);


      sendResponse(res, 201, {
        success: true,
        data: newTodo
      });
    } catch (error) {
      return sendResponse(res, 400, {
        success: false,
        error: "Invalid JSON format"
      })
    }

    // console.log("Create todo not implemented yet");
    // sendResponse(res, 501, {
    //   success: false,
    //   error: "Create todo not implemented yet",
    // });
  }

  /**
   * Handle PUT /todos/:id - Update existing todo
   * @param {InstanceType<IncomingMessage>} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async updateTodo(req, res, params) {
    // TODO: Implement update existing todo
    // 1. Extract ID from path parameters
    // 2. Find existing todo
    // 3. Parse request body
    // 4. Validate update data
    // 5. Merge changes with existing todo
    // 6. Update timestamp
    // 7. Return updated todo
    // 8. Handle not found and validation errors

    try {
      const id = parseInt(params.id, 10);
      if (isNaN(id)) {
        return sendResponse(res, 400, {
          success: false,
          error: "Invalid todo ID format",
        });
      }

      const existingTodo = this.findTodoById(id);
      if (!existingTodo) {
        return sendResponse(res, 404, {
          success: false,
          error: "Todo not found"
        })
      }

      const parsedBody = await parseBody(req);

      const validation = validateTodo(parsedBody, true);
      if (!validation.isValid) {
        return sendResponse(res, 400, {
          success: false,
          error: validation.errors.join("; ") || "Validation Error"
        })
      }

      if (parsedBody.title !== undefined) {
        existingTodo.title = parsedBody.title.trim();
      }
      if (parsedBody.description !== undefined) {
        existingTodo.description = parsedBody.description.trim();
      }
      if (parsedBody.completed !== undefined) {
        existingTodo.completed = parsedBody.completed;
      }
      existingTodo.updatedAt = new Date();

      return sendResponse(res, 200, {
        success: true,
        data: existingTodo
      })
    } catch (error) {
      return sendResponse(res, 400, {
        success: false,
        error: "Invalid JSON format"
      })
    }

    // console.log("Update todo not implemented yet");
    // sendResponse(res, 501, {
    //   success: false,
    //   error: "Update todo not implemented yet",
    // });
  }

  /**
   * Handle DELETE /todos/:id - Delete todo
   * @param {InstanceType<IncomingMessage>} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async deleteTodo(req, res, params) {
    // TODO: Implement delete todo
    // 1. Extract ID from path parameters
    // 2. Find todo index in storage
    // 3. Return 404 if not found
    // 4. Remove from storage
    // 5. Return success message
    // 6. Handle invalid ID format

    try {
      const id = parseInt(params.id, 10);
      if (isNaN(id)) {
        return sendResponse(res, 400, {
          success: false,
          error: "Invalid todo ID format",
        });
      }

      const index = this.findTodoIndexById(id);
      if (index === -1) {
        return sendResponse(res, 404, {
          success: false,
          error: "Todo not found",
        });
      }

      this.todos.splice(index, 1);
      return sendResponse(res, 200, {
        success: true,
        message: `Todo ${id} deleted`
      })
    } catch (error) {
      return sendResponse(res, 500, {
        success: false,
        error: "Internal server error"
      });
    }

    // console.log("Delete todo not implemented yet");
    // sendResponse(res, 501, {
    //   success: false,
    //   error: "Delete todo not implemented yet",
    // });
  }

  /**
   * Handle CORS preflight requests
   * @param {InstanceType<IncomingMessage>} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  handleCORS(req, res) {
    // TODO: Implement CORS preflight handling
    // 1. Set CORS headers
    // 2. Return 204 No Content
    // 3. Handle preflight request properly

    //console.log("CORS handling not implemented yet");
    return sendResponse(res, 204, {});
  }

  /**
   * Find todo by ID in storage
   * @param {number|string} id - Todo ID
   * @returns {Object|null} Found todo or null
   */
  findTodoById(id) {
    // TODO: Implement find todo by ID
    // 1. Convert ID to number
    // 2. Search in todos array
    // 3. Return found todo or null
    // 4. Handle invalid ID format

    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return null;
    }
    const foundTodo = this.todos.find(todo => todo.id === numId);
    if (!foundTodo) {
      return null;
    }
    return foundTodo;
  }

  /**
   * Find todo index by ID in storage
   * @param {number|string} id - Todo ID
   * @returns {number} Todo index or -1 if not found
   */
  findTodoIndexById(id) {
    // TODO: Implement find todo index by ID
    // 1. Convert ID to number
    // 2. Find index in todos array
    // 3. Return index or -1 if not found

    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return -1;
    }
    return this.todos.findIndex(todo => todo.id === numId);
  }

  /**
   * Generate next available ID
   * @returns {number} Next ID
   */
  generateNextId() {
    // TODO: Implement ID generation
    // 1. Return current nextId
    // 2. Increment nextId for next use
    // 3. Handle edge cases

    if (typeof this.nextId !== "number" || isNaN(this.nextId)) {
      this.nextId = 1;
    }

    const currentId = this.nextId;
    this.nextId += 1;

    return currentId;
  }
}

// Export the TodoServer class
module.exports = TodoServer;

// Example usage (for testing):
const isReadyToTest = false;

if (isReadyToTest) {
  // Start server for testing
  const server = new TodoServer(3000);
  server.start();

  console.log("🚀 Todo Server starting...");
  console.log("📝 Replace TODO comments with implementation");
  console.log("🧪 Run task-04-test.js to verify functionality");
}

// If this file is run directly, start the server
if (require.main === module) {
  const server = new TodoServer(3000);
  server.start();
}
