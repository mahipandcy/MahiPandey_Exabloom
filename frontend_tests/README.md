## 🧠 Features Summary

### ✅ Level 1 – Basic Workflow
- Start Node
- Add Button
- End Node
- Static edges and layout

### ✅ Level 2 – Action Nodes
- Add unlimited Action Nodes
- Label editing
- Node deletion
- Smart edge connections
- Auto layout and updates

### ✅ Level 3 – If/Else Logic
- Add If/Else nodes with editable labels
- Dynamically add and rename branches
- Add Action Nodes inside branches
- End Node is initialized by default
- Auto edge from last node → End Node
- No manual End Node creation

---
# 🔧 Setup Instructions – Workflow Builder
---

## 🧱 Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

---

## 📦 Install & Run

```bash
# Clone the repository
git clone https://github.com/mahipandcy/MahiPandey_Exabloom.git
cd MahiPandey_Exabloom/frontend_tests

# Install dependencies
npm install

# Run the app
npm run start
```
---
## 🧩 Challenges Encountered
---

### 1. Learning React Flow from Scratch  
This was my first time working with React Flow, which has a unique mental model around nodes, edges, and custom components. I overcame this by:
- Studying the [React Flow documentation](https://reactflow.dev/docs/)
- Exploring open-source examples to understand best practices
- Experimenting with different node types and dynamic layouts through hands-on trial and error

---

### 2. Conditional Branch Layout
Ensuring consistent and readable branch layouts as users added or renamed branches posed layout issues. I addressed this by:
- Dynamically calculating the X position of each branch node
- Center-aligning branches horizontally based on total branch count

---

### 3. Modular Logic Across Levels
Adding functionality across levels without cluttering earlier stages was important for code clarity. I handled this by:
- Modularizing all custom nodes (`AddButtonNode`, `IfElseNode`, `ActionNode`)
- Using props and data structures to handle all logic types without repeating code
