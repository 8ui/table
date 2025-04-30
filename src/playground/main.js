import EditorJS from "@editorjs/editorjs";
import Table from "../plugin.js";
import "./test-svg.js";

// Sample data with a table
const sampleData = {
  time: 1550476186479,
  blocks: [
    {
      type: "table",
      data: {
        content: [
          ["Header 1", "Header 2", "Header 3"],
          ["Cell 1", "Cell 2", "Cell 3"],
          ["Cell 4", "Cell 5", "Cell 6"],
        ],
      },
    },
  ],
};

// Initialize EditorJS
const editor = new EditorJS({
  holder: "editorjs",
  tools: {
    table: {
      class: Table,
      inlineToolbar: true,
      config: {
        rows: 2,
        cols: 3,
      },
    },
  },
  data: sampleData,
});

// Save button handler
document.getElementById("save").addEventListener("click", async () => {
  const outputData = await editor.save();
  document.getElementById("output").textContent = JSON.stringify(
    outputData,
    null,
    2
  );
});

// Load button handler
document.getElementById("load").addEventListener("click", async () => {
  const output = document.getElementById("output").textContent;
  if (output) {
    try {
      const data = JSON.parse(output);
      await editor.render(data);
    } catch (e) {
      console.error("Failed to load data:", e);
    }
  }
});

// Clear button handler
document.getElementById("clear").addEventListener("click", () => {
  editor.clear();
  document.getElementById("output").textContent = "";
});
