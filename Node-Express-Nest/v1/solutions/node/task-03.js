const fs = require("fs");
const fsPromises = require("fs").promises;
const util = require("util");

/**
 * Event Loop Analysis and Async Debugging
 * Learn Node.js event loop phases and fix broken async code
 */

/**
 * Analyze execution order of event loop phases
 * @returns {object} Analysis of execution order
 */
function analyzeEventLoop() {
  // TODO: Implement event loop analysis
  // 1. Create examples showing each event loop phase
  // 2. Demonstrate microtask vs macrotask priority
  // 3. Show execution order with detailed logging
  // 4. Return analysis object with explanations

  const analysis = {
    phases: [
      "timers phase: runs setTimeout() and setInterval() callbacks",
      "pending callbacks phase: executes callbacks for some system operations such as types of TCP errors",
      "idle, prepare phase: only used internally by Node.js",
      "poll phase: waits for and processes I/O (file reads, sockets)",
      "check phase: runs setImmediate() callbacks",
      "close callbacks phase: runs on closing sockets/streams (socket.on('close'))"
    ],
    executionOrder: [
      "1. Synchronous Code",
      "2. process.nextTick Queue (microtask)",
      "3. Promise Microtask Queue (microtask)",
      "4. Timers Phase (macrotask)",
      "5. Pending Callbacks Phase (macrotask)",
      "6. Poll Phase (macrotask)",
      "7. Check Phase (macrotask)",
      "8. Close Callbacks Phase (macrotask)"
    ],
    explanations: [
      "Synchronous code runs before processing any async events or event loop phases",
      "Microtasks (process.nextTick and Promises) run after current operation completes",
      "process.nextTick microtask queue has higher priority than Promise microtask queue",
      "Macrotasks are processed phase by phase in the Node.js event loop lifecycle"
    ],
  };

  //console.log("Event loop analysis not implemented yet");
  return analysis;
}

/**
 * Predict execution order for code snippets
 * @param {string} snippet - Code snippet identifier
 * @returns {array} Predicted execution order
 */
function predictExecutionOrder(snippet) {
  // TODO: Implement execution order prediction
  // 1. Analyze the provided code snippets
  // 2. Apply event loop phase rules
  // 3. Consider microtask priority
  // 4. Return predicted order with explanations

  const predictions = {
    snippet1: [
        '1. "Start" - synchronous console.log',
        '2. "End" - synchronous console.log',
        '3. "NextTick 1" - process.nextTick (microtask)',
        '4. "NextTick 2" - process.nextTick (microtask)',
        '5. "Promise 1" - promise.then (microtask)',
        '6. "Promise 2" - promise.then (microtask)',
        '7. "Timer 1" - setTimeout (macrotask, Timer Phase)',
        '8. "Timer 2" - setTimeout (macrotask, Timer Phase)',
        '9. "Immediate 1" - setImmediate (macrotask, Check Phase)',
        '10. "Immediate 2" - setImmediate (macrotask, Check Phase)',
      // Basic event loop snippet predictions
    ],
    snippet2: [
        '1. "=== Start ===" - synchronous console.log',
        '2. "=== End ===" - synchronous console.log',
        '3. "NextTick" - process.nextTick, console.log (microtask)',
        '4. "Nested NextTick" - process.nextTick, process.nextTick (microtask)',
        '5. "Timer" - setTimeout, console.log (Timer Phase)',
        '6. "NextTick in Timer" - setTimeout, process.nextTick (microtask in Timer Phase)',
        '7. "Immediate" - setImmediate, console.log (Check Phase)',
        '8. "NextTick in Immediate" - setImmediate, process.nextTick (microtask in Check Phase)',
        '9. "fs.readFile" - fs.readFile, console.log (Poll Phase)',
        '10. "NextTick in readFile" - fs.readFile, process.nextTick (microtask in Poll Phase)',
        '11. "Immediate in readFile" - fs.readFile, setImmediate (Check Phase immediately following Poll phase)',
        '12. "Timer in readFile" - fs.readFile, setTimeout (Timers Phase after Check Phase)',
      // File system operations snippet predictions
    ],
  };

  return predictions[snippet] || [];
}

/**
 * Fix race condition in file processing
 * @returns {Promise} Promise that resolves when files are processed
 */
async function fixRaceCondition() {
  // TODO: Fix the race condition in file processing
  // Issues to fix:
  // 1. Race condition in file processing
  // 2. Incorrect error handling
  // 3. Missing await keywords
  // 4. Array index might be wrong due to closure

  const files = ["file1.txt", "file2.txt", "file3.txt"];

  try {
    // Implementation goes here
    //console.log("Race condition fix not implemented yet");
    const results = await Promise.all(
        files.map(async (file) => {
          try {
            const content = await fsPromises.readFile(file, "utf8");
            return String(content).toUpperCase();
          } catch (err) {
            await fsPromises.writeFile(file, `Content of ${file}`);
            return `${file.toUpperCase()}`;
          }
        })
    )
    return results;
  } catch (error) {
    throw new Error(`Failed to process files: ${error.message}`);
  }
}

/**
 * Convert callback hell to async/await
 * @param {number} userId - User ID to process
 * @returns {Promise} Promise that resolves with processed user data
 */
async function fixCallbackHell(userId) {
  // TODO: Convert callback hell to async/await
  // Issues to fix:
  // 1. Callback hell structure
  // 2. No error handling for JSON.parse
  // 3. Repetitive error handling code
  // 4. No file existence checking
  // 5. Blocking operations
  const userPath = `user-${userId}.json`;
  const prefPath = `preferences-${userId}.json`;
  const actPath = `activity-${userId}.json`;

  try {
    if (!fs.existsSync(userPath)) {
      throw new Error(`User file ${userPath} does not exist`);
    } else if (!fs.existsSync(prefPath)) {
      throw new Error(`User file ${prefPath} does not exist`);
    } else if (!fs.existsSync(actPath)) {
      throw new Error(`User file ${actPath} does not exist`);
    }

    const readAndParse = async (filePath) => {
      const raw = await fsPromises.readFile(filePath, "utf8");
      try {
        return JSON.parse(String(raw));
      } catch (err) {
        throw new Error(`JSON parse error in ${filePath}`);
      }
    }

    const [userData, prefData, actData] = await Promise.all([
        readAndParse(userPath),
        readAndParse(prefPath),
        readAndParse(actPath)
    ])

    const combinedUserData = {
      ...userData,
      ...prefData,
      ...actData,
      processedAt: new Date()
    }

    await fsPromises.writeFile(`processed-${userId}.json`,
        JSON.stringify(combinedUserData, null, 2));
    // Step 1: Read user file
    // Step 2: Read user preferences
    // Step 3: Read user activity
    // Step 4: Combine data and write result

    //console.log("Callback hell fix not implemented yet");
    return combinedUserData;
  } catch (error) {
    throw new Error(`Failed to process user data: ${error.message}`);
  }
}

/**
 * Fix mixed promises and callbacks
 * @returns {Promise} Promise that resolves when processing is complete
 */
async function fixMixedAsync() {
  // TODO: Fix mixed promises and callbacks
  // Issues to fix:
  // 1. Mixing promises and callbacks inconsistently
  // 2. Nested async operations without proper chaining
  // 3. Error handling inconsistencies
  // 4. No proper async/await usage
  const inputPath = "input.txt";
  const outputPath = "output.txt";


  try {
    let data;
    // Implementation goes here
    if (!fs.existsSync(inputPath)) {
      try {
        data = await fsPromises.readFile(inputPath, "utf8");
        logWithPhase("Input file read completed for processing", "poll");
      } catch (e) {
        data = "Hello, World!";
        await fsPromises.writeFile(inputPath, data);
        logWithPhase("Input file created with initial processing data", "poll");
      }
    }
    let processedData = String(data).toUpperCase();

    await fsPromises.writeFile(outputPath, processedData);
    logWithPhase("Async processing result written to output file", "poll");

    const checkContent = await fsPromises.readFile(outputPath, "utf8");
    logWithPhase(`Completed result verified with length ${String(checkContent).length}`, "poll");

    return String(checkContent);
  } catch (error) {
    throw new Error(`Failed to process data: ${error.message}`);
  }
}

/**
 * Demonstrate all event loop phases
 * @returns {Promise} Promise that resolves when demonstration is complete
 */
async function demonstrateEventLoop() {
  // TODO: Create comprehensive event loop demonstration
  // 1. Show timers phase (setTimeout, setInterval)
  // 2. Show pending callbacks phase
  // 3. Show poll phase (I/O operations)
  // 4. Show check phase (setImmediate)
  // 5. Show close callbacks phase
  // 6. Demonstrate microtask priority (nextTick, Promises)
  logWithPhase("Demonstrate event loop", "sync");

  setTimeout(() => {
    logWithPhase("Timer Callback in Timers Phase", "timers");
  });

  setImmediate(() => {
    logWithPhase("setImmediate Callback in Check Phase", "check");
  });

  process.nextTick(() => {
    logWithPhase("NextTick in Microtask Queue", "nextTick");
  });

  Promise.resolve().then(() => {
    logWithPhase("Promise.then executed in Promise Microtask Queue", "promise");
  });

  try {
    await fsPromises.readFile(__filename, () => {
      logWithPhase("I/O operation completed in Poll Phase", "poll");
    });
  } catch (error) {
    throw new Error(`Failed to process result in ${error.message}`);
  }

  //console.log("Event loop demonstration not implemented yet");
}

/**
 * Create test files for debugging exercises
 */
async function createTestFiles() {
  // TODO: Create test files for the exercises
  // 1. Create sample user data files
  // 2. Create input files for processing
  // 3. Handle file creation errors gracefully

  const testData = {
    "user-123.json": {
      id: 123,
      name: "John Doe",
      email: "john@example.com",
    },
    "preferences-123.json": {
      theme: "dark",
      language: "en",
      notifications: true,
    },
    "activity-123.json": {
      lastLogin: "2025-01-01",
      sessionsCount: 42,
      totalTime: 3600,
    },
    "input.txt": "Hello World! This is test data for processing.",
    "file1.txt": "Content of file 1",
    "file2.txt": "Content of file 2",
    "file3.txt": "Content of file 3",
  };

  try {
    // Implementation goes here
    for (const [filename, content] of Object.entries(testData)) {
      const data = typeof content === "object" ? JSON.stringify(content, null, 2) : content;
      await fsPromises.writeFile(filename, data);
    }
    logWithPhase("Test files created successfully", "sync");
    //console.log("Test files creation not implemented yet");
  } catch (error) {
    console.error("Failed to create test files:", error.message);
  }
}

/**
 * Helper function to log with timestamps
 * @param {string} message - Message to log
 * @param {string} phase - Event loop phase
 */
function logWithPhase(message, phase = "unknown") {
  // TODO: Implement detailed logging
  // 1. Add timestamp
  // 2. Add event loop phase information
  // 3. Add color coding for different phases
  // 4. Format output for better readability
  const timestamp = new Date().toISOString();

  const colors = {
    sync: "\x1b[36m",
    nextTick: "\x1b[35m",
    timers: "\x1b[32m",
    poll: "\x1b[33m",
    check: "\x1b[34m",
    promise: "\x1b[37m",
    reset: "\x1b[0m"
  };
  const color = colors[phase.toUpperCase()] || colors.reset;

  console.log(`${color}${timestamp}: [PHASE: ${phase}] ${message}`);
}

// Export functions and data
module.exports = {
  analyzeEventLoop,
  predictExecutionOrder,
  fixRaceCondition,
  fixCallbackHell,
  fixMixedAsync,
  demonstrateEventLoop,
  createTestFiles,
  logWithPhase,
};

// Example usage (for testing):
const isReadyToTest = false;

if (isReadyToTest) {
  async function runExamples() {
    console.log("🔄 Starting Event Loop Analysis Examples...\n");

    // Create test files
    await createTestFiles();

    // Demonstrate event loop
    console.log("=== Event Loop Demonstration ===");
    await demonstrateEventLoop();

    // Analyze execution order
    console.log("\n=== Execution Order Analysis ===");
    const analysis = analyzeEventLoop();
    console.log("Analysis:", analysis);

    // Fix broken code
    console.log("\n=== Fixing Broken Code ===");
    try {
      await fixRaceCondition();
      console.log("✅ Race condition fixed");

      await fixCallbackHell(123);
      console.log("✅ Callback hell converted");

      await fixMixedAsync();
      console.log("✅ Mixed async resolved");
    } catch (error) {
      console.error("❌ Error fixing code:", error.message);
    }
  }

  runExamples();
}
