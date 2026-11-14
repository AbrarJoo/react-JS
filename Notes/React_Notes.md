# React JS - Complete Study Notes


---

# 1. Working with Functions in React


## 1.1 What is a function component?

A **function component** is a plain JavaScript function that accepts a single object called **props** and returns **JSX** (what should appear on screen). Since React 16.8 (Hooks), function components are the standard way to write React; class components are legacy.

- The function name **must start with a capital letter** (Welcome, not welcome) - otherwise React treats it as an HTML tag.
- It must return JSX, a string, a number, an array, null or false.
- It should be **pure** while rendering: same props + same state = same output, with no side effects (no API calls, no changing outside variables) in the render body.

**Three ways to write a component**

```jsx
// Function declaration
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Arrow function (most common today)
const Greeting = ({ name }) => {
  return <h2>Welcome back, {name}</h2>;
};

// Arrow function with implicit return
const Badge = ({ text }) => <span className="badge">{text}</span>;

export default Welcome;
```


## 1.2 Using a component

```jsx
import Welcome from "./Welcome";

function App() {
  return (
    <div>
      <Welcome name="Aman" />
      <Welcome name="Riya" />   {/* reusable: each call is independent */}
    </div>
  );
}
```


## 1.3 Props and destructuring

**Props** are read-only inputs passed from parent to child, like function arguments. Never modify props inside the child. Destructuring in the parameter list makes code cleaner and lets you set **default values**.

**Destructuring, default props and children**

```jsx
function UserCard({ name, age = 18, isAdmin = false, children }) {
  return (
    <div className="card">
      <h3>{name} ({age})</h3>
      {isAdmin && <p>Admin</p>}
      {children}               {/* anything placed between the tags */}
    </div>
  );
}

<UserCard name="Aman" age={21} isAdmin>
  <button>Message</button>
</UserCard>
```

> **KEY POINT:** Strings are passed with quotes (name="Aman"); numbers, booleans, arrays, objects and functions need curly braces (age={21}).


## 1.4 Passing functions as props (child to parent communication)

Data flows **down** through props. To send data **up**, the parent passes a function to the child; the child calls it.

**Callback props**

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  const handleAdd = (amount) => setCount(count + amount);

  return (
    <>
      <p>Total: {count}</p>
      <Child onAdd={handleAdd} />
    </>
  );
}

function Child({ onAdd }) {
  return <button onClick={() => onAdd(5)}>Add 5</button>;
}
```


## 1.5 Helper functions and functions inside components

```jsx
// Pure helper outside the component (not re-created on every render)
const formatPrice = (n) => "Rs. " + n.toFixed(2);

function Product({ title, price }) {
  // Event handler defined inside the component
  const handleBuy = () => alert("Bought " + title);

  // Function that returns JSX
  const renderStock = () => (price > 0 ? <em>In stock</em> : <em>Sold out</em>);

  return (
    <div>
      <h4>{title}</h4>
      <p>{formatPrice(price)}</p>
      {renderStock()}
      <button onClick={handleBuy}>Buy</button>
    </div>
  );
}
```


## 1.6 Rendering lists with map()

```jsx
const fruits = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Mango" },
];

function FruitList() {
  return (
    <ul>
      {fruits.map((f) => (
        <li key={f.id}>{f.name}</li>      // key must be unique and stable
      ))}
    </ul>
  );
}
```


## 1.7 Conditional rendering

```jsx
function Status({ loggedIn, items }) {
  if (!loggedIn) return <p>Please log in</p>;   // early return

  return (
    <div>
      {loggedIn ? <p>Welcome</p> : <p>Guest</p>}      {/* ternary */}
      {items.length > 0 && <p>{items.length} items</p>} {/* && operator */}
      {items.length === 0 && <p>Cart is empty</p>}
    </div>
  );
}
```

> **COMMON MISTAKE:** Writing {count && <X/>} when count is 0 renders the number 0 on screen. Use {count > 0 && <X/>} instead.


## 1.8 Higher-order functions and callbacks

Array methods like **map, filter, reduce, find, some, every** take a function as an argument (higher-order functions) and are used constantly in React.

```jsx
const nums = [1, 2, 3, 4, 5];
const even   = nums.filter((n) => n % 2 === 0);      // [2, 4]
const double = nums.map((n) => n * 2);               // [2,4,6,8,10]
const sum    = nums.reduce((acc, n) => acc + n, 0);  // 15
const found  = nums.find((n) => n > 3);              // 4
```


## 1.9 Function components vs class components

| Feature | Function component | Class component |
|---|---|---|
| Syntax | Plain function | class X extends React.Component |
| State | useState hook | this.state / this.setState |
| Lifecycle | useEffect hook | componentDidMount, DidUpdate, WillUnmount |
| `this` keyword | Not needed | Required, a common source of bugs |
| Code size | Shorter, easier to test | More boilerplate |
| Status | Recommended | Legacy, still supported |


---

# 2. DOM Management in React


## 2.1 What is the DOM?

The **DOM (Document Object Model)** is the browser's tree representation of an HTML page. JavaScript can read and change it. Direct DOM updates are slow when done often, because the browser must recalculate layout and repaint.


## 2.2 Virtual DOM

The **Virtual DOM** is a lightweight JavaScript copy of the real DOM, kept in memory. React updates the Virtual DOM first and then efficiently applies only the necessary changes to the real DOM.


### How rendering works (step by step)

- **1. Render:** state or props change, so React calls your component and builds a new Virtual DOM tree.
- **2. Diffing:** React compares the new tree with the previous one.
- **3. Reconciliation:** React works out the minimum set of changes.
- **4. Commit:** only those changes are applied to the real DOM.

> **KEY POINT:** Reconciliation rules: (a) elements of different types produce a rebuilt subtree, (b) elements of the same type only update changed attributes, (c) in lists, **keys** let React match old and new children.


## 2.3 Mounting React into the DOM

**React 18+ entry point**

```jsx
// index.html:  <div id="root"></div>

// main.jsx
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
```


## 2.4 How JSX becomes DOM

JSX is syntax sugar. Build tools (Babel/Vite) convert it into **React.createElement** calls (or the newer jsx runtime), which produce plain objects describing the UI.

```jsx
// What you write
const el = <h1 className="title">Hello</h1>;

// What it becomes
const el2 = React.createElement("h1", { className: "title" }, "Hello");

// What it evaluates to (simplified)
// { type: "h1", props: { className: "title", children: "Hello" } }
```


### JSX rules to remember

- Return **one root element**; use a Fragment (`<>...</>`) to avoid extra divs.
- Use **className** instead of class, **htmlFor** instead of for.
- Attributes are camelCase: onClick, tabIndex, maxLength, readOnly.
- Close every tag, including `<img />`, `<input />`, `<br />`.
- Put JavaScript **expressions** (not statements) inside { }.
- Inline style takes an object: style={{ color: "red", fontSize: 18 }}.


## 2.5 Keys in lists

A **key** is a special string/number attribute that identifies list items so React can tell which were added, moved or removed.

- Use a stable unique ID from your data (database id).
- Avoid using array index when the list can be reordered, filtered or edited - it causes wrong state and extra DOM work.
- Keys only need to be unique among siblings. Keys are not passed as a prop.


## 2.6 Accessing the real DOM with useRef

Normally you never touch the DOM directly. For things that need it (focus, scroll, measuring size, playing video, third-party libraries) use **refs**.

**useRef to focus an input**

```jsx
import { useRef, useEffect } from "react";

function SearchBox() {
  const inputRef = useRef(null);      // { current: null } initially

  useEffect(() => {
    inputRef.current.focus();         // available after the first render
  }, []);

  return (
    <>
      <input ref={inputRef} placeholder="Search..." />
      <button onClick={() => (inputRef.current.value = "")}>Clear</button>
    </>
  );
}
```

|  | useState | useRef |
|---|---|---|
| Changing it | Triggers a re-render | Does NOT re-render |
| Value lives in | state variable | ref.current |
| Use for | Data shown on screen | DOM nodes, timers, previous values |

> **COMMON MISTAKE:** Do not use document.getElementById / querySelector to change content that React manages. React will not know about it and may overwrite your change.


## 2.7 Other DOM-related tools


### Fragments

```jsx
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);
// With a key (in lists) you must use the long form: <React.Fragment key={id}>
```


### Portals - render outside the parent DOM node

**createPortal** renders children into a different DOM node (e.g. modals, tooltips, dropdowns) while keeping React event bubbling and context intact.

```jsx
import { createPortal } from "react-dom";

function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.body            // or document.getElementById("modal-root")
  );
}
```


### Updating the document title (side effect)

```jsx
useEffect(() => {
  document.title = "Cart (" + count + ")";
}, [count]);
```


### Conditional styles and classes

```jsx
<button
  className={isActive ? "btn active" : "btn"}
  style={{ backgroundColor: isActive ? "green" : "gray" }}
>
  Toggle
</button>
```


---

# 3. Events in React


## 3.1 What are events?

An **event** is something that happens in the UI: a click, key press, form submit, mouse move, etc. React lets you attach **event handlers** (functions) to elements.


## 3.2 Syntax: HTML vs React

| Point | HTML | React |
|---|---|---|
| Name | onclick (lowercase) | onClick (camelCase) |
| Handler | String: "doIt()" | Function reference: {doIt} |
| Prevent default | return false | e.preventDefault() |

```jsx
// HTML
<button onclick="handleClick()">Click</button>

// React
<button onClick={handleClick}>Click</button>
```

> **COMMON MISTAKE:** Pass the function, do not call it. onClick={handleClick} is correct. onClick={handleClick()} runs it immediately during render.


## 3.3 Basic examples

```jsx
function Demo() {
  function handleClick() {
    alert("Button clicked");
  }

  const handleChange = (e) => {
    console.log(e.target.value);       // current text in the input
  };

  return (
    <>
      <button onClick={handleClick}>Click me</button>
      <input onChange={handleChange} />
    </>
  );
}
```


## 3.4 Passing arguments to handlers

```jsx
function List() {
  const remove = (id) => console.log("Removing", id);

  return (
    <ul>
      {[1, 2, 3].map((id) => (
        <li key={id}>
          Item {id}
          {/* Wrap in an arrow function to pass arguments */}
          <button onClick={() => remove(id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

// If you also need the event object:
<button onClick={(e) => remove(id, e)}>Delete</button>
```


## 3.5 The Synthetic Event object

React wraps the browser's native event in a **SyntheticEvent**, a cross-browser wrapper with the same interface as the native event. The native event is available as **e.nativeEvent**.

| Property / method | Meaning |
|---|---|
| e.target | Element that triggered the event (e.g. the input) |
| e.currentTarget | Element the handler is attached to |
| e.type | Event name, e.g. "click" |
| e.preventDefault() | Stops default browser action (form submit, link navigation) |
| e.stopPropagation() | Stops event bubbling to parent handlers |
| e.key / e.code | Keyboard events: which key was pressed |
| e.clientX / e.clientY | Mouse position in the viewport |
| e.nativeEvent | The original browser event |


## 3.6 Commonly used events

| Category | Events |
|---|---|
| Mouse | onClick, onDoubleClick, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp, onMouseMove, onContextMenu |
| Keyboard | onKeyDown, onKeyUp (onKeyPress is deprecated) |
| Form | onChange, onSubmit, onInput, onReset, onInvalid |
| Focus | onFocus, onBlur |
| Clipboard | onCopy, onCut, onPaste |
| Drag and drop | onDrag, onDragStart, onDragOver, onDrop |
| Touch | onTouchStart, onTouchMove, onTouchEnd |
| Scroll / wheel | onScroll, onWheel |
| Media / image | onLoad, onError, onPlay, onPause, onEnded |


## 3.7 preventDefault and stopPropagation

```jsx
function LoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault();          // stop the page from reloading
    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Login</button>
    </form>
  );
}

// stopPropagation
function Outer() {
  return (
    <div onClick={() => console.log("outer")}>
      <button onClick={(e) => { e.stopPropagation(); console.log("inner"); }}>
        Click
      </button>                      {/* logs only "inner" */}
    </div>
  );
}
```


## 3.8 Event bubbling and capturing

By default, events **bubble**: they fire on the target first, then on each parent up to the root. To handle during the capture phase (parent first), add **Capture** to the name, e.g. **onClickCapture**.


## 3.9 Keyboard and input examples

```jsx
function Search() {
  const [text, setText] = useState("");

  const handleKey = (e) => {
    if (e.key === "Enter") alert("Searching: " + text);
    if (e.key === "Escape") setText("");
  };

  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKey}
      onFocus={() => console.log("focused")}
      onBlur={() => console.log("blurred")}
    />
  );
}
```


## 3.10 Passing event handlers as props

```jsx
function Button({ label, onPress }) {
  return <button onClick={onPress}>{label}</button>;
}

function App() {
  return <Button label="Save" onPress={() => console.log("saved")} />;
}
// Custom component props can be named anything; by convention they start with "on".
```

> **TIP:** Event handler naming convention: the handler function is named handleXxx and the prop name is onXxx. Example: onSubmit={handleSubmit}.


---

# 4. Hooks Overview


## 4.1 What are Hooks?

**Hooks** are special functions (introduced in React 16.8) that let function components use state, lifecycle behaviour and other React features without writing a class. All hook names start with **use**.


### Why hooks were introduced

- Reuse stateful logic between components without wrapper hell (custom hooks).
- Avoid confusing this and class lifecycle methods.
- Group related logic together instead of splitting it across lifecycle methods.


## 4.2 Rules of Hooks

- **Only call hooks at the top level** - not inside loops, conditions or nested functions.
- **Only call hooks from React function components or custom hooks** - not from regular JavaScript functions or class components.
- React relies on the **order** of hook calls being the same on every render. Breaking the rule corrupts state.

```jsx
// WRONG
function Bad({ show }) {
  if (show) {
    const [x, setX] = useState(0);   // hook inside a condition
  }
}

// RIGHT
function Good({ show }) {
  const [x, setX] = useState(0);     // always called
  if (!show) return null;
  return <p>{x}</p>;
}
```

> **TIP:** Install eslint-plugin-react-hooks (included by default in Vite/CRA templates) to automatically warn about rule violations.


## 4.3 Built-in hooks at a glance

| Hook | Purpose | Quick example |
|---|---|---|
| useState | Local component state | const [n, setN] = useState(0) |
| useEffect | Side effects: fetch, timers, subscriptions, DOM sync | useEffect(() => {...}, [dep]) |
| useRef | Mutable value / DOM reference without re-render | const r = useRef(null) |
| useContext | Read shared data without prop drilling | const t = useContext(ThemeCtx) |
| useReducer | Complex state with a reducer function (like Redux) | const [s, dispatch] = useReducer(fn, init) |
| useMemo | Cache an expensive calculated value | useMemo(() => calc(a), [a]) |
| useCallback | Cache a function between renders | useCallback(fn, [dep]) |
| useLayoutEffect | Like useEffect but runs before browser paints | measure DOM, avoid flicker |
| useId | Generate unique IDs for accessibility | const id = useId() |
| useTransition | Mark updates as non-urgent (smooth UI) | const [pending, start] = useTransition() |
| useDeferredValue | Defer re-rendering a less important value | const d = useDeferredValue(v) |
| useImperativeHandle | Customize what a ref exposes to parent | advanced |
| useSyncExternalStore | Subscribe to external stores | library authors |
| useActionState / useOptimistic | Form actions and optimistic UI (React 19) | newer APIs |


## 4.4 The most important hooks with mini examples


### useContext

```jsx
const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);   // "dark"
  return <p>Theme: {theme}</p>;
}
```


### useReducer

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "inc":   return { count: state.count + 1 };
    case "dec":   return { count: state.count - 1 };
    case "reset": return { count: 0 };
    default:      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "inc" })}>+</button>
      <button onClick={() => dispatch({ type: "dec" })}>-</button>
    </>
  );
}
```


### useMemo and useCallback

```jsx
const total = useMemo(() => items.reduce((s, i) => s + i.price, 0), [items]);

const handleDelete = useCallback((id) => {
  setItems((prev) => prev.filter((i) => i.id !== id));
}, []);
// Use only when you measured a performance problem or pass the value to a
// memoized child (React.memo). Do not wrap everything.
```


## 4.5 Custom hooks

A **custom hook** is your own function whose name starts with **use** and which calls other hooks. It lets you extract and reuse stateful logic. Each call has its own independent state.

```jsx
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((prev) => !prev);
  return [on, toggle];
}

function Panel() {
  const [open, toggleOpen] = useToggle();
  return (
    <>
      <button onClick={toggleOpen}>{open ? "Hide" : "Show"}</button>
      {open && <p>Details...</p>}
    </>
  );
}
```


---

# 5. useState in Detail


## 5.1 Definition

**useState** is a hook that adds a **state variable** to a component. State is data that changes over time and, when it changes, makes React **re-render** the component so the UI stays in sync.


## 5.2 Syntax

```jsx
import { useState } from "react";

const [state, setState] = useState(initialValue);
//      |         |                    |
//   current   function to        value used on the FIRST render only
//   value     update it
```

- It returns an **array of two items**, which we destructure: the current value and a setter function.
- The names are your choice; convention is **[thing, setThing]**.
- Initial value can be any type: number, string, boolean, array, object, null, function.


## 5.3 Basic example: counter

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increase</button>
      <button onClick={() => setCount(count - 1)}>Decrease</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```


## 5.4 How state works internally

- State is stored by React **outside** your function, tied to the component's position in the tree. Normal local variables reset on every render; state persists.
- Calling the setter does **not** change the variable immediately. It schedules a re-render, and the **next render** sees the new value.
- State is a **snapshot**: inside one render, the value never changes.
- If you set the same value (checked with Object.is), React skips the re-render.

**State is a snapshot**

```jsx
function Demo() {
  const [n, setN] = useState(0);

  function handle() {
    setN(n + 1);
    console.log(n);     // still the OLD value (0), not 1
    setN(n + 1);        // n is still 0 here, so this also sets 1
    setN(n + 1);        // final result: 1, not 3
  }
  return <button onClick={handle}>{n}</button>;
}
```


## 5.5 Functional updates

When the new state depends on the previous state, pass a **function** to the setter. React gives it the latest pending value.

```jsx
function handle() {
  setN((prev) => prev + 1);
  setN((prev) => prev + 1);
  setN((prev) => prev + 1);   // result: 3
}

// Also needed inside timers / async code to avoid stale values
useEffect(() => {
  const id = setInterval(() => setSeconds((s) => s + 1), 1000);
  return () => clearInterval(id);
}, []);
```

> **KEY POINT:** Rule of thumb: if the next value is calculated from the current value, use setX(prev => ...).


## 5.6 Lazy initial state

If computing the initial value is expensive (e.g. reading localStorage), pass a **function**. It runs only on the first render.

```jsx
// BAD: readSavedList() is called on EVERY render (result is just ignored later)
const [list, setList] = useState(readSavedList());

// GOOD: runs once
const [list2, setList2] = useState(() => readSavedList());
const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
```


## 5.7 State with different data types


### Numbers, strings, booleans

```jsx
const [age, setAge] = useState(20);
const [name, setName] = useState("");
const [isOpen, setIsOpen] = useState(false);

setIsOpen(!isOpen);            // toggle
setIsOpen((prev) => !prev);    // safer toggle
```


### Objects - always create a NEW object

```jsx
const [user, setUser] = useState({ name: "Aman", age: 21, city: "Jammu" });

// WRONG: mutation, React will not detect it
user.age = 22;
setUser(user);

// RIGHT: copy with spread, then override
setUser({ ...user, age: 22 });
setUser((prev) => ({ ...prev, city: "Delhi" }));

// Nested object
setUser((prev) => ({ ...prev, address: { ...prev.address, pin: "180001" } }));
```


### Arrays - never use push, splice, sort or reverse directly on state

```jsx
const [todos, setTodos] = useState(["Learn React"]);

// Add
setTodos([...todos, "Build app"]);
setTodos((prev) => [...prev, "Build app"]);
setTodos((prev) => ["Start", ...prev]);              // add at the beginning

// Remove
setTodos((prev) => prev.filter((t) => t.id !== id));

// Update one item
setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

// Insert / sort (copy first)
const sorted = [...todos].sort();
setTodos(sorted);

// Clear
setTodos([]);
```

| Action | Avoid (mutates) | Prefer (returns new array) |
|---|---|---|
| Add | push, unshift | [...arr, x] or concat |
| Remove | pop, shift, splice | filter, slice |
| Replace | arr[i] = x | map |
| Sort / reverse | sort(), reverse() on state | [...arr].sort() |


## 5.8 Batching

React **batches** multiple state updates in the same event (and, since React 18, also in timeouts, promises and native handlers) into **one re-render** for performance.

```jsx
function handle() {
  setA(1);
  setB(2);
  setC(3);        // only ONE re-render
}
```


## 5.9 Multiple state variables vs one object

- Use **separate states** for unrelated values (name, isOpen, count).
- Use **one object** (or useReducer) when values change together, such as form fields.
- Do not store values that can be **calculated** from other state or props.

```jsx
// Bad: duplicated/derived state
const [items, setItems] = useState([]);
const [count, setCount] = useState(0);      // can get out of sync

// Good: derive it
const [items2, setItems2] = useState([]);
const total = items2.length;                // calculated during render
```


## 5.10 Lifting state up and resetting state

- **Lifting state up:** when two components need the same data, move the state to their closest common parent and pass it down via props (with callbacks to change it).
- **Resetting state with key:** changing a component's **key** makes React destroy and recreate it, resetting its state: <Profile key={userId} />.


## 5.11 Complete example: Todo list

```jsx
function TodoApp() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = () => {
    if (!text.trim()) return;
    setTodos((prev) => [...prev, { id: Date.now(), title: text, done: false }]);
    setText("");
  };
  const toggle = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <span
              onClick={() => toggle(t.id)}
              style={{ textDecoration: t.done ? "line-through" : "none" }}
            >
              {t.title}
            </span>
            <button onClick={() => remove(t.id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```


## 5.12 Common mistakes with useState

- Mutating state directly (user.age = 5, arr.push(x)).
- Expecting the value to update immediately after calling the setter.
- Calling the setter during render (causes an infinite loop): write **onClick={() => setX(1)}**, not **onClick={setX(1)}**.
- Using stale values in async code without the functional form.
- Storing derived data in state.
- Calling hooks conditionally.


---

# 6. Form Handling in React


## 6.1 Two approaches

|  | Controlled component | Uncontrolled component |
|---|---|---|
| Who holds the value? | React state | The DOM itself |
| How to read it | From the state variable | Via ref or FormData on submit |
| Updates | onChange updates state on every keystroke | No React updates while typing |
| Validation | Easy, live validation | Usually on submit |
| When to use | Most forms (recommended) | Simple forms, file inputs, integrating non-React code |


## 6.2 Controlled input

```jsx
function NameForm() {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();               // stop the page reload
    alert("Hello " + name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input
        id="name"
        type="text"
        value={name}                              // value comes from state
        onChange={(e) => setName(e.target.value)} // state follows the input
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```


## 6.3 Different input types

| Input | Bind with | Read from |
|---|---|---|
| text, email, password, number, date | value | e.target.value |
| textarea | value (not children) | e.target.value |
| select | value on the select tag | e.target.value |
| checkbox | checked | e.target.checked |
| radio | checked={state === option} | e.target.value |
| file | uncontrolled only | e.target.files[0] |

**textarea, select, checkbox, radio**

```jsx
const [bio, setBio] = useState("");
<textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />

const [city, setCity] = useState("jammu");
<select value={city} onChange={(e) => setCity(e.target.value)}>
  <option value="jammu">Jammu</option>
  <option value="delhi">Delhi</option>
</select>

const [agree, setAgree] = useState(false);
<input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />

const [gender, setGender] = useState("");
<input type="radio" value="male" checked={gender === "male"}
       onChange={(e) => setGender(e.target.value)} /> Male
<input type="radio" value="female" checked={gender === "female"}
       onChange={(e) => setGender(e.target.value)} /> Female
```


## 6.4 Handling multiple inputs with one handler

Give every input a **name** attribute equal to its key in the state object, and use **computed property names**.

```jsx
function SignupForm() {
  const [form, setForm] = useState({
    username: "", email: "", password: "", subscribe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,   // [name] = computed key
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" value={form.username} onChange={handleChange} />
      <input name="email" type="email" value={form.email} onChange={handleChange} />
      <input name="password" type="password" value={form.password}
             onChange={handleChange} />
      <label>
        <input name="subscribe" type="checkbox" checked={form.subscribe}
               onChange={handleChange} /> Subscribe
      </label>
      <button type="submit">Sign up</button>
    </form>
  );
}
```


## 6.5 Validation and error messages

```jsx
function LoginForm() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!values.email) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(values.email)) err.email = "Email is invalid";
    if (values.password.length < 6) err.password = "Minimum 6 characters";
    return err;
  };

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length === 0) {
      console.log("Valid, submit to server", values);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input name="email" value={values.email} onChange={handleChange} />
      {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}

      <input name="password" type="password" value={values.password}
             onChange={handleChange} />
      {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}

      <button type="submit">Login</button>
    </form>
  );
}
```


## 6.6 Uncontrolled forms

```jsx
// Option 1: useRef
function Uncontrolled() {
  const nameRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(nameRef.current.value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} defaultValue="Guest" />   {/* defaultValue, not value */}
      <button>Send</button>
    </form>
  );
}

// Option 2: FormData (no state or refs needed)
function WithFormData() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log(data);         // { email: "...", password: "..." }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" />
      <input name="password" type="password" />
      <button>Send</button>
    </form>
  );
}

// File input is always uncontrolled
<input type="file" onChange={(e) => console.log(e.target.files[0])} />
```


## 6.7 Resetting a form and disabling the button

```jsx
const initial = { name: "", email: "" };
const [form, setForm] = useState(initial);
const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  await fakeApiCall(form);
  setForm(initial);               // reset
  setSubmitting(false);
};

<button type="submit" disabled={submitting}>
  {submitting ? "Saving..." : "Save"}
</button>
```

> **COMMON MISTAKE:** Set a controlled input's value to "" (not undefined or null). Switching from undefined to a string makes React warn: 'changing an uncontrolled input to be controlled'.

> **TIP:** For big forms consider libraries: React Hook Form (performance, easy validation), Formik, and schema validators like Yup or Zod.


---

# 7. Two-Way Data Binding in React


## 7.1 Definition

**Two-way data binding** means the UI and the data model stay synchronized in both directions: when the **model changes**, the **view updates**, and when the user **edits the view** (types in an input), the **model updates**.


## 7.2 React is one-way by design

React has **one-way (unidirectional) data flow**: data flows from parent to child via props and from state to UI. React has no built-in directive like Angular's **[(ngModel)]** or Vue's **v-model**. Instead, you **simulate** two-way binding with two pieces:

- **value** (or checked) = state: data flows **state to input**.
- **onChange** = handler that calls setState: data flows **input to state**.

**Simulated two-way binding**

```jsx
function TwoWay() {
  const [text, setText] = useState("");

  return (
    <div>
      <input
        type="text"
        value={text}                               // model -> view
        onChange={(e) => setText(e.target.value)}  // view -> model
      />
      <p>You typed: {text}</p>                    {/* updates live */}
      <button onClick={() => setText("")}>Clear</button>
      {/* clearing via state also clears the input = model -> view */}
    </div>
  );
}
```


## 7.3 The cycle, step by step

- 1. User types a character.
- 2. onChange fires and gives the new value in e.target.value.
- 3. setText(newValue) updates state.
- 4. React re-renders the component.
- 5. The input is rendered again with value={text} (the new value).


## 7.4 Reusable custom hook for binding

```jsx
function useInput(initial = "") {
  const [value, setValue] = useState(initial);
  const bind = {
    value,
    onChange: (e) => setValue(e.target.value),
  };
  const reset = () => setValue(initial);
  return [value, bind, reset];
}

function Demo() {
  const [name, nameBind, resetName] = useInput("");
  const [email, emailBind] = useInput("");

  return (
    <>
      <input {...nameBind} placeholder="Name" />     {/* spread value + onChange */}
      <input {...emailBind} placeholder="Email" />
      <p>{name} / {email}</p>
      <button onClick={resetName}>Reset name</button>
    </>
  );
}
```


## 7.5 Two-way binding between parent and child

```jsx
function Child({ value, onChange }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}

function Parent() {
  const [title, setTitle] = useState("Hello");
  return (
    <>
      <Child value={title} onChange={setTitle} />
      <h2>{title}</h2>
    </>
  );
}
```


## 7.6 Comparison with other frameworks

| Framework | Syntax | How it works |
|---|---|---|
| React | value + onChange | Explicit: you write both directions |
| Angular | [(ngModel)]="name" | Built-in directive, automatic |
| Vue | v-model="name" | Built-in directive, automatic |


### Why React chose one-way flow

- Easier to debug: data changes happen in one predictable place.
- Better performance control and easier testing.
- Avoids hidden cascading updates.


---

# 8. localStorage and sessionStorage


## 8.1 Web Storage API

**Web Storage** is a browser feature (not React-specific) that stores data as **key-value pairs of strings** on the user's device. There are two kinds: **localStorage** and **sessionStorage**. Storage size is about 5 MB per origin.

| Feature | localStorage | sessionStorage |
|---|---|---|
| Lifetime | Stays until deleted by code or user | Cleared when the tab is closed |
| Scope | Shared by all tabs/windows of the same origin | Only that one tab |
| Survives page refresh | Yes | Yes |
| Survives browser restart | Yes | No |
| Capacity | About 5 MB | About 5 MB |
| Sent to server | No (unlike cookies) | No |
| Typical use | Theme, language, cart, tokens (with caution) | Multi-step form progress, temporary data |


## 8.2 Methods

| Method | Description |
|---|---|
| setItem(key, value) | Save a value (converted to string) |
| getItem(key) | Read a value, returns null if the key does not exist |
| removeItem(key) | Delete one item |
| clear() | Delete everything for this origin |
| key(index) | Get key name at an index |
| length | Number of stored items |

```jsx
// localStorage
localStorage.setItem("username", "Aman");
const name = localStorage.getItem("username");   // "Aman"
localStorage.removeItem("username");
localStorage.clear();

// sessionStorage (same API)
sessionStorage.setItem("step", "2");
console.log(sessionStorage.getItem("step"));     // "2"
```


## 8.3 Storing objects and arrays

Storage keeps only **strings**. Convert with **JSON.stringify** before saving and **JSON.parse** after reading.

```jsx
const user = { name: "Aman", age: 21 };
localStorage.setItem("user", JSON.stringify(user));

const saved = JSON.parse(localStorage.getItem("user"));   // object again
console.log(saved.name);

// Numbers/booleans come back as strings:
localStorage.setItem("count", 5);
typeof localStorage.getItem("count");    // "string"
Number(localStorage.getItem("count"));   // 5
```


## 8.4 Using localStorage in React: persisting state

Pattern: **read** once with lazy initial state, **write** inside useEffect whenever the value changes.

**Remember the theme after refresh**

```jsx
function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"      // read once
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);               // write on change
    document.body.className = theme;
  }, [theme]);

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Current: {theme}
    </button>
  );
}
```

**Persist an array of todos**

```jsx
function Todos() {
  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("todos")) || [];
    } catch {
      return [];                       // corrupted data fallback
    }
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // ... add / remove via setTodos
}
```


## 8.5 Reusable custom hook: useLocalStorage

```jsx
import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("Could not save to localStorage", err);
    }
  }, [key, value]);

  return [value, setValue];
}

// Usage - works exactly like useState but persists
const [name, setName] = useLocalStorage("name", "");
const [cart, setCart] = useLocalStorage("cart", []);
```

To make it **sessionStorage**, replace **localStorage** with **sessionStorage** in the hook (or accept the storage object as a parameter).


## 8.6 Syncing across tabs: the storage event

```jsx
useEffect(() => {
  const onStorage = (e) => {
    if (e.key === "theme") setTheme(e.newValue);
  };
  window.addEventListener("storage", onStorage);   // fires in OTHER tabs only
  return () => window.removeEventListener("storage", onStorage);
}, []);
```


## 8.7 Cookies vs localStorage vs sessionStorage

|  | Cookies | localStorage | sessionStorage |
|---|---|---|---|
| Size | About 4 KB | About 5 MB | About 5 MB |
| Sent with every HTTP request | Yes | No | No |
| Expiry | Set manually | Never (manual delete) | Tab close |
| Accessible by JS | Yes (unless HttpOnly) | Yes | Yes |


## 8.8 Best practices and security

- **Never store sensitive data** (passwords, card details). Any JavaScript on the page, including through an XSS attack, can read storage.
- For auth tokens, prefer **HttpOnly secure cookies** set by the server.
- Always wrap JSON.parse in try/catch.
- Storage is **synchronous**, so avoid storing huge data (blocks the main thread).
- It may be unavailable (private mode, blocked by user, quota exceeded) - handle errors.
- Do not read storage during server-side rendering (window is undefined on the server); read it inside useEffect or guard with **typeof window !== "undefined"**.


---

# 9. API Calling in React: fetch and Axios


## 9.1 What is an API call?

An **API (Application Programming Interface)** lets your React app talk to a server to get or send data, usually as **JSON** over **HTTP**. React has no built-in HTTP library; you use the browser's **fetch** or a library such as **Axios**.


### HTTP methods (CRUD)

| Method | Purpose | CRUD |
|---|---|---|
| GET | Read / fetch data | Read |
| POST | Create new data (send body) | Create |
| PUT | Replace an existing item entirely | Update |
| PATCH | Update part of an item | Update |
| DELETE | Remove an item | Delete |


### Common HTTP status codes

| Code | Meaning |
|---|---|
| 200 OK / 201 Created | Success |
| 204 No Content | Success, nothing to return (often after DELETE) |
| 400 Bad Request | Invalid data sent |
| 401 / 403 | Unauthorized / Forbidden |
| 404 Not Found | Resource does not exist |
| 500 Internal Server Error | Server crashed |


## 9.2 Promises and async/await (quick refresher)

API calls are **asynchronous**: they return a **Promise** (a value that arrives later). Handle it with **.then().catch()** or **async/await** with try/catch.

```jsx
// Promise chain
fetch(url)
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

// async / await (cleaner)
async function load() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  } finally {
    console.log("always runs");
  }
}
```


## 9.3 Using fetch (built into the browser, nothing to install)


### GET request inside React with loading and error state

```jsx
import { useState, useEffect } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("HTTP error " + res.status);  // IMPORTANT
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
    return () => controller.abort();         // cleanup: cancel on unmount
  }, []);                                    // [] = run once after first render

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name} - {u.email}</li>
      ))}
    </ul>
  );
}
```

> **COMMON MISTAKE:** fetch only rejects on network failure. A 404 or 500 response does NOT throw, so you must check res.ok (or res.status) yourself. Also res.json() is itself a Promise - await it.


### POST, PUT, PATCH, DELETE with fetch

```jsx
const API = "https://jsonplaceholder.typicode.com/posts";

// POST - create
const createPost = async (post) => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),                 // must stringify manually
  });
  return res.json();
};

// PUT - replace
await fetch(API + "/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: 1, title: "New", body: "Text", userId: 1 }),
});

// PATCH - partial update
await fetch(API + "/1", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Only title changes" }),
});

// DELETE
await fetch(API + "/1", { method: "DELETE" });

// Sending an auth token
fetch(API, { headers: { Authorization: "Bearer " + token } });

// Query parameters
fetch(API + "?userId=1&_limit=5");
```


## 9.4 Using Axios

**Axios** is a popular third-party, promise-based HTTP client for the browser and Node.js. It adds convenience on top of fetch.


### Installation

**Install in your React project folder (where package.json is)**

```jsx
# using npm
npm install axios

# using yarn
yarn add axios

# using pnpm
pnpm add axios

# CDN (plain HTML, no build tool)
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

**Then import it in any file**

```jsx
import axios from "axios";
```


### Why use Axios instead of fetch?

- Automatic JSON parsing: the data is in **response.data** (no res.json() step).
- Automatically stringifies the request body for objects.
- **Rejects on 4xx / 5xx** status codes, so catch blocks work as expected.
- Built-in **interceptors**, **timeout**, base URL, default headers.
- Upload/download progress tracking and request cancellation.
- Consistent behaviour across browsers and Node.


### GET request

```jsx
import { useState, useEffect } from "react";
import axios from "axios";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("https://jsonplaceholder.typicode.com/posts", {
        params: { _limit: 10 },               // becomes ?_limit=10
        signal: controller.signal,
      })
      .then((response) => setPosts(response.data))     // data is already parsed
      .catch((err) => {
        if (!axios.isCancel(err)) setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return posts.map((p) => <h4 key={p.id}>{p.title}</h4>);
}
```


### Same thing with async/await

```jsx
useEffect(() => {
  const getPosts = async () => {
    try {
      const { data } = await axios.get("https://jsonplaceholder.typicode.com/posts");
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  getPosts();
}, []);
```


### POST, PUT, PATCH, DELETE with Axios

```jsx
const API = "https://jsonplaceholder.typicode.com/posts";

// POST: axios.post(url, body, config)
const { data } = await axios.post(API, { title: "Hello", body: "World", userId: 1 });

// PUT
await axios.put(API + "/1", { id: 1, title: "Updated", body: "...", userId: 1 });

// PATCH
await axios.patch(API + "/1", { title: "Only title" });

// DELETE
await axios.delete(API + "/1");

// With headers (auth token)
await axios.get(API, { headers: { Authorization: "Bearer " + token } });

// Generic form
await axios({ method: "post", url: API, data: { title: "X" }, timeout: 5000 });
```


### The response object

| Property | Contains |
|---|---|
| response.data | The parsed response body (your JSON) |
| response.status | HTTP status code, e.g. 200 |
| response.statusText | e.g. "OK" |
| response.headers | Response headers |
| response.config | Config used for the request |


### Axios error handling

```jsx
try {
  await axios.get("/api/secret");
} catch (error) {
  if (error.response) {
    // Server replied with 4xx/5xx
    console.log(error.response.status);   // 404
    console.log(error.response.data);     // server error body
  } else if (error.request) {
    // Request was sent but no response (network down, CORS, timeout)
    console.log("No response from server");
  } else {
    // Something went wrong while setting up the request
    console.log(error.message);
  }
}
```


### Axios instance (recommended for real projects)

```jsx
// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = "Bearer " + token;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// Usage anywhere:
// import api from "./api/axios";
// const { data } = await api.get("/users");     // calls baseURL + "/users"
```


## 9.5 fetch vs Axios

| Feature | fetch | Axios |
|---|---|---|
| Installation | Built in, none needed | npm install axios |
| JSON parsing | Manual: await res.json() | Automatic: response.data |
| Request body | Manual JSON.stringify + header | Automatic for objects |
| HTTP errors (404/500) | Does not throw; check res.ok | Throws automatically |
| Timeout | Needs AbortController | Built-in `timeout` option |
| Interceptors | Not available | Built-in |
| Upload progress | Not supported (simple) | Supported |
| Query params | Build URL string manually | `params` option |
| Bundle size | 0 KB | About 13 KB (minified+gzip) |


## 9.6 Where to call APIs in React

- **On page load:** inside **useEffect** with an appropriate dependency array.
- **On user action:** directly inside an event handler (button click, form submit) - no useEffect needed.
- **Never** call it directly in the component body: it would run on every render and create an infinite loop (fetch, set state, re-render, fetch...).

**API call on button click (form submit)**

```jsx
function AddPost() {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.post("https://jsonplaceholder.typicode.com/posts",
                                        { title, userId: 1 });
      alert("Created with id " + data.id);
      setTitle("");
    } catch (err) {
      alert("Failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button disabled={saving}>{saving ? "Saving..." : "Add"}</button>
    </form>
  );
}
```


## 9.7 Reusable custom hook for fetching

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    axios
      .get(url, { signal: controller.signal })
      .then((res) => setData(res.data))
      .catch((err) => { if (!axios.isCancel(err)) setError(err.message); })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);                                  // re-fetch when url changes

  return { data, loading, error };
}

// Usage
const { data: users, loading, error } = useFetch("https://jsonplaceholder.typicode.com/users");
```


## 9.8 Best practices for API calls

- Always manage three states: **loading, error, data**.
- Cancel or ignore outdated requests in the cleanup function (avoids race conditions and 'state update on unmounted component' problems).
- Keep API URLs in environment variables: Vite uses **import.meta.env.VITE_API_URL** (Create React App uses **process.env.REACT_APP_API_URL**).
- Centralize requests in an **api** folder or Axios instance.
- Use **Promise.all** to run independent requests in parallel.
- Handle **CORS** errors on the server (or use a dev proxy); the browser blocks cross-origin requests the server does not allow.
- For larger apps use **TanStack Query (React Query)** or SWR: caching, retries, refetching, pagination built in.

```jsx
// Parallel requests
const [users, posts] = await Promise.all([
  axios.get("/users"),
  axios.get("/posts"),
]);
```


---

# 10. useEffect in Detail


## 10.1 Definition

**useEffect** is a hook that lets a component run **side effects** - work that happens **outside** of rendering and changes something beyond the component - after React has rendered and updated the DOM.


### What is a side effect?

- Fetching data from an API
- Subscribing to events (window resize, keyboard) or WebSockets
- Timers: setTimeout, setInterval
- Directly changing the DOM (document.title)
- Reading/writing localStorage
- Logging, analytics


## 10.2 Syntax

```jsx
import { useEffect } from "react";

useEffect(() => {
  // 1. SETUP code: runs after render

  return () => {
    // 2. CLEANUP code (optional): runs before next effect and on unmount
  };
}, [dependencies]);   // 3. DEPENDENCY ARRAY (optional)
```


## 10.3 The three dependency-array forms

| Form | When the effect runs | Typical use |
|---|---|---|
| useEffect(fn) | After EVERY render | Rare; syncing something with every render |
| useEffect(fn, []) | Once, after the first render (mount) | Initial API call, one-time subscriptions |
| useEffect(fn, [a, b]) | After first render and whenever a or b changes | Re-fetch when an id changes, sync title with state |

```jsx
// 1) No array: every render
useEffect(() => {
  console.log("rendered");
});

// 2) Empty array: only on mount
useEffect(() => {
  console.log("mounted");
}, []);

// 3) With dependencies: on mount + when count changes
useEffect(() => {
  document.title = "Count: " + count;
}, [count]);
```


## 10.4 Component lifecycle mapped to useEffect

| Class lifecycle | useEffect equivalent |
|---|---|
| componentDidMount | useEffect(() => {...}, []) |
| componentDidUpdate | useEffect(() => {...}, [deps]) |
| componentWillUnmount | The cleanup function: return () => {...} |

```jsx
useEffect(() => {
  console.log("Mounted (componentDidMount)");
  return () => console.log("Unmounted (componentWillUnmount)");
}, []);
```


## 10.5 The cleanup function

Return a function from the effect to **undo** what the effect did. React runs cleanup (1) **before running the effect again** due to changed dependencies, and (2) when the component **unmounts**. This prevents memory leaks and duplicate listeners.

```jsx
// Timer
useEffect(() => {
  const id = setInterval(() => setSeconds((s) => s + 1), 1000);
  return () => clearInterval(id);
}, []);

// Event listener
useEffect(() => {
  const onResize = () => setWidth(window.innerWidth);
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, []);

// Subscription / WebSocket
useEffect(() => {
  const socket = new WebSocket("wss://example.com/live");
  socket.onmessage = (m) => setMessages((prev) => [...prev, m.data]);
  return () => socket.close();
}, []);
```


## 10.6 Order of execution

- 1. Component function runs (render).
- 2. React updates the DOM.
- 3. Browser paints the screen.
- 4. useEffect runs (after paint, so it does not block the UI).
- 5. On the next change: the **old cleanup runs first**, then the new effect runs.

```jsx
useEffect(() => {
  console.log("effect for count =", count);
  return () => console.log("cleanup for count =", count);
}, [count]);
// count 0 -> 1: logs "effect for count = 0" (mount)
//               then "cleanup for count = 0", then "effect for count = 1"
```


## 10.7 Fetching data inside useEffect

```jsx
function User({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let ignore = false;                       // guards against race conditions

    async function load() {
      const res = await fetch("https://jsonplaceholder.typicode.com/users/" + userId);
      const data = await res.json();
      if (!ignore) setUser(data);             // ignore outdated responses
    }
    load();

    return () => { ignore = true; };          // cleanup
  }, [userId]);                               // re-run when userId changes

  return <p>{user ? user.name : "Loading..."}</p>;
}
```

> **COMMON MISTAKE:** The effect callback itself cannot be async (useEffect(async () => ...) is wrong, because an async function returns a Promise, not a cleanup function). Define an async function inside and call it.


## 10.8 Dependency array rules

- Include **every reactive value** used inside the effect: props, state, and variables/functions defined in the component body.
- Do not lie to React by omitting dependencies to 'run once' - it creates **stale closures** (the effect sees old values). Fix the code instead.
- Setter functions from useState and the ref object from useRef are stable; you may omit them.
- Values declared **outside** the component are not dependencies.
- Objects, arrays and functions created in the component body are **new on every render**, so putting them in the array makes the effect run every time. Move them inside the effect, outside the component, or memoize with useMemo/useCallback.
- Install and respect the **exhaustive-deps** ESLint rule.

**Common infinite-loop traps**

```jsx
// Infinite loop: effect changes state, state is a dependency
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);          // triggers re-render, effect runs again...
}, [count]);

// Infinite loop: object dependency recreated every render
const options = { page: 1 };
useEffect(() => { fetchData(options); }, [options]);   // runs every render!
// Fix: depend on primitives instead
useEffect(() => { fetchData({ page }); }, [page]);
```


## 10.9 Multiple effects: separate concerns

```jsx
function Profile({ id }) {
  // Effect 1: data
  useEffect(() => { /* fetch user by id */ }, [id]);

  // Effect 2: title
  useEffect(() => { document.title = "Profile " + id; }, [id]);

  // Effect 3: analytics once
  useEffect(() => { console.log("Profile viewed"); }, []);
}
// Use several small effects rather than one big one.
```


## 10.10 Practical examples


### Debounced search

```jsx
function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) { setResults([]); return; }
    const timer = setTimeout(() => {
      fetch("https://dummyjson.com/products/search?q=" + query)
        .then((r) => r.json())
        .then((d) => setResults(d.products));
    }, 500);                         // wait 500ms after the user stops typing
    return () => clearTimeout(timer); // cancel previous timer on each keystroke
  }, [query]);

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>{results.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
    </>
  );
}
```


### Window size tracker

```jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return width;
}
```


### Stopwatch

```jsx
function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;                       // nothing to set up
    const id = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <>
      <h2>{time}s</h2>
      <button onClick={() => setRunning(!running)}>{running ? "Stop" : "Start"}</button>
      <button onClick={() => { setRunning(false); setTime(0); }}>Reset</button>
    </>
  );
}
```


## 10.11 React Strict Mode: effects run twice in development

In development, **StrictMode** intentionally mounts, unmounts and remounts every component once to expose missing cleanup. So your mount effect (and API call) may run **twice** in dev. This does **not** happen in production. The fix is to write proper cleanup (abort the request, remove the listener), not to remove StrictMode.


## 10.12 useEffect vs useLayoutEffect

|  | useEffect | useLayoutEffect |
|---|---|---|
| Runs | After the browser paints | After DOM update, before paint |
| Blocks painting | No | Yes (synchronous) |
| Use for | Fetch, timers, subscriptions (99% of cases) | Measuring layout, preventing visual flicker |


## 10.13 You might not need an effect

- **Calculating data from props/state:** just compute it during render (or useMemo).
- **Handling user events:** put logic in the event handler (e.g. submit a form, send a POST request on click).
- **Resetting state when a prop changes:** use a **key** on the component.
- **Chains of effects** that set state to trigger other effects: restructure into one event handler or derived values.

```jsx
// Unnecessary effect
const [first, setFirst] = useState("A");
const [last, setLast] = useState("B");
const [full, setFull] = useState("");
useEffect(() => setFull(first + " " + last), [first, last]);

// Just calculate
const full2 = first + " " + last;
```


## 10.14 Common mistakes with useEffect

- Forgetting the dependency array (effect runs every render, often an infinite loop with setState).
- Missing dependencies (stale values) or adding unstable objects/functions.
- Making the effect callback async.
- Forgetting cleanup for intervals, listeners, subscriptions.
- Using useEffect for logic that belongs in an event handler.
- Not handling race conditions in fetch (outdated response overwrites newer one).


---

# 11. Quick Revision Cheat Sheet

| Topic | Remember |
|---|---|
| Function components | Capitalized function returning JSX; props are read-only; pass functions as props to send data up |
| Virtual DOM | React diffs a JS copy of the DOM and updates only what changed; use key in lists; use useRef for direct DOM access |
| Events | camelCase (onClick); pass function reference; SyntheticEvent; e.preventDefault() for forms; arrow wrapper to pass arguments |
| Hooks | Start with use; call at top level only; only in components or custom hooks |
| useState | const [v, setV] = useState(init); updates are async snapshots; use setV(prev => ...) when depending on old state; never mutate objects/arrays |
| Forms | Controlled: value + onChange; checkbox uses checked; preventDefault on submit; [e.target.name]: value for many inputs |
| Two-way binding | Not built in; value={state} + onChange={set state} |
| Web storage | localStorage = persistent, sessionStorage = per tab; strings only (JSON.stringify/parse); never store secrets |
| fetch | Built in; check res.ok; await res.json(); stringify body and set headers |
| Axios | npm install axios; response.data; throws on 4xx/5xx; interceptors; axios.create({ baseURL }) |
| useEffect | Runs after render; [] = once, [x] = when x changes, none = every render; return cleanup; never make callback async |


## Mini project ideas to practice

- Counter + Todo list with localStorage persistence (useState, events, storage).
- Signup form with validation (controlled inputs, form handling).
- User directory fetching from jsonplaceholder with search box (fetch/Axios, useEffect).
- Stopwatch and dark mode toggle (useEffect cleanup, localStorage).
- Weather or news app using a public API (Axios instance, env variables).


## Project setup (Vite)

```jsx
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm install axios        # when you need Axios
npm run dev              # starts dev server (usually http://localhost:5173)
```

*Good luck with your studies. Practise each example by typing it yourself - that is the fastest way to learn React.*
