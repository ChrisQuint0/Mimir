// Static demo data for front-end pseudo-generation
// 15 modules spread across 30 days for a "Learn React" bootcamp

export const DEMO_BOOTCAMP = {
  id: "demo-bootcamp-1",
  title: "Master Modern React",
  goal: "Learn React from fundamentals to advanced patterns including hooks, context, performance optimization, and building production-ready applications",
  duration_days: 30,
  current_day: 1,
  caption: "A comprehensive React bootcamp designed for developers who want to master modern React development patterns and best practices.",
  published_at: new Date().toISOString(),
};

export const DEMO_SYLLABUS = {
  days: [
    // Module 1: Foundations (Days 1-2)
    {
      day: 1,
      title: "Module 1: React Fundamentals (Learn)",
      description: "Introduction to React, JSX, and component basics. Set up your development environment and create your first components.",
      topics: ["What is React?", "JSX syntax", "Components and Props", "Development environment setup"],
    },
    {
      day: 2,
      title: "Module 1: React Fundamentals (Practice)",
      description: "Hands-on practice with React components, props, and JSX. Build simple UI components and understand component composition.",
      topics: ["Building reusable components", "Props drilling", "Component composition patterns", "Practice exercises"],
    },
    // Module 2: State & Events (Days 3-4)
    {
      day: 3,
      title: "Module 2: State & Event Handling (Learn)",
      description: "Learn about component state, event handling, and how to make your components interactive.",
      topics: ["useState hook", "Event handlers", "Controlled components", "Form inputs"],
    },
    {
      day: 4,
      title: "Module 2: State & Event Handling (Practice)",
      description: "Build interactive forms and dynamic UI components using state and event handlers.",
      topics: ["Interactive forms", "State updates", "Event patterns", "Mini-project: Todo list"],
    },
    // Module 3: Component Lifecycle (Days 5-7)
    {
      day: 5,
      title: "Module 3: Effects & Lifecycle (Learn)",
      description: "Understand component lifecycle with useEffect. Learn side effects, data fetching, and cleanup.",
      topics: ["useEffect hook", "Dependency arrays", "Cleanup functions", "Side effects"],
    },
    {
      day: 6,
      title: "Module 3: Effects & Lifecycle (Practice)",
      description: "Practice data fetching, subscriptions, and effect cleanup in real-world scenarios.",
      topics: ["API integration", "Async operations", "Cleanup patterns", "Effect best practices"],
    },
    {
      day: 7,
      title: "Module 3: Effects & Lifecycle (Review & Project)",
      description: "Consolidate your knowledge by building a data-fetching application with proper lifecycle management.",
      topics: ["Project: Weather app", "Review lifecycle concepts", "Debug common issues", "Performance tips"],
    },
    // Module 4: Lists & Keys (Days 8-9)
    {
      day: 8,
      title: "Module 4: Lists & Conditional Rendering (Learn)",
      description: "Master rendering lists, using keys effectively, and conditional rendering patterns.",
      topics: ["Rendering lists", "Keys and reconciliation", "Conditional rendering", "Map and filter"],
    },
    {
      day: 9,
      title: "Module 4: Lists & Conditional Rendering (Practice)",
      description: "Build dynamic lists and implement various conditional rendering patterns.",
      topics: ["Dynamic data rendering", "Conditional UI patterns", "List performance", "Practice: Product catalog"],
    },
    // Module 5: Advanced Hooks (Days 10-12)
    {
      day: 10,
      title: "Module 5: Advanced Hooks (Learn)",
      description: "Explore useReducer, useCallback, useMemo, and useRef for complex state and performance optimization.",
      topics: ["useReducer", "useCallback", "useMemo", "useRef"],
    },
    {
      day: 11,
      title: "Module 5: Advanced Hooks (Practice)",
      description: "Apply advanced hooks to optimize performance and manage complex state logic.",
      topics: ["Complex state management", "Memoization techniques", "Ref use cases", "Performance optimization"],
    },
    {
      day: 12,
      title: "Module 5: Advanced Hooks (Deep Dive)",
      description: "Deep dive into when and why to use each advanced hook with real-world examples.",
      topics: ["Hook patterns", "Performance profiling", "Common pitfalls", "Best practices"],
    },
    // Module 6: Context API (Days 13-15)
    {
      day: 13,
      title: "Module 6: Context API (Learn)",
      description: "Learn the Context API for state management across components without prop drilling.",
      topics: ["Context API basics", "Provider pattern", "useContext hook", "Global state"],
    },
    {
      day: 14,
      title: "Module 6: Context API (Practice)",
      description: "Implement theme switching and user authentication state with Context API.",
      topics: ["Theme context", "Auth context", "Multiple contexts", "Context composition"],
    },
    {
      day: 15,
      title: "Module 6: Context API (Project)",
      description: "Build a multi-theme application with global state management using Context API.",
      topics: ["Project: Theme system", "Context patterns", "Performance considerations", "Testing contexts"],
    },
    // Module 7: React Router (Days 16-17)
    {
      day: 16,
      title: "Module 7: React Router (Learn)",
      description: "Master client-side routing with React Router for building multi-page applications.",
      topics: ["React Router setup", "Routes and navigation", "URL parameters", "Nested routes"],
    },
    {
      day: 17,
      title: "Module 7: React Router (Practice)",
      description: "Build a multi-page application with navigation, dynamic routes, and protected routes.",
      topics: ["Navigation components", "Protected routes", "Route guards", "Practice: Blog routing"],
    },
    // Module 8: Forms & Validation (Days 18-19)
    {
      day: 18,
      title: "Module 8: Forms & Validation (Learn)",
      description: "Learn form handling, validation strategies, and form libraries like React Hook Form.",
      topics: ["Form state management", "Validation patterns", "React Hook Form", "Error handling"],
    },
    {
      day: 19,
      title: "Module 8: Forms & Validation (Practice)",
      description: "Build complex forms with validation, error messages, and proper user feedback.",
      topics: ["Multi-step forms", "Custom validators", "Async validation", "Form UX patterns"],
    },
    // Module 9: API Integration (Days 20-21)
    {
      day: 20,
      title: "Module 9: API Integration (Learn)",
      description: "Master API integration with fetch, axios, and modern data fetching libraries.",
      topics: ["REST APIs", "Fetch vs Axios", "Error handling", "Loading states"],
    },
    {
      day: 21,
      title: "Module 9: API Integration (Practice)",
      description: "Build a data-driven application with full CRUD operations and proper error handling.",
      topics: ["CRUD operations", "Optimistic updates", "Error boundaries", "Practice: API dashboard"],
    },
    // Module 10: State Management (Days 22-24)
    {
      day: 22,
      title: "Module 10: State Management Libraries (Learn)",
      description: "Explore state management solutions: Redux, Zustand, and when to use them.",
      topics: ["Redux basics", "Zustand", "State management patterns", "When to use libraries"],
    },
    {
      day: 23,
      title: "Module 10: State Management Libraries (Practice)",
      description: "Implement global state management with Zustand in a real application.",
      topics: ["Store setup", "Actions and reducers", "Async actions", "DevTools integration"],
    },
    {
      day: 24,
      title: "Module 10: State Management (Integration Project)",
      description: "Build a shopping cart with global state management and persist data.",
      topics: ["Project: Shopping cart", "State persistence", "Complex state logic", "Testing state"],
    },
    // Module 11: Performance (Days 25-26)
    {
      day: 25,
      title: "Module 11: Performance Optimization (Learn)",
      description: "Learn React performance optimization techniques: memoization, code splitting, lazy loading.",
      topics: ["React.memo", "Code splitting", "Lazy loading", "Performance profiling"],
    },
    {
      day: 26,
      title: "Module 11: Performance Optimization (Practice)",
      description: "Apply performance optimization techniques to improve application performance.",
      topics: ["Optimization strategies", "Bundle analysis", "Lazy components", "Virtual scrolling"],
    },
    // Module 12: Testing (Days 27-28)
    {
      day: 27,
      title: "Module 12: Testing React Apps (Learn)",
      description: "Learn testing strategies with Jest and React Testing Library.",
      topics: ["Unit testing", "Integration testing", "React Testing Library", "Testing patterns"],
    },
    {
      day: 28,
      title: "Module 12: Testing React Apps (Practice)",
      description: "Write comprehensive tests for components, hooks, and user interactions.",
      topics: ["Component tests", "Hook testing", "Async testing", "Test coverage"],
    },
    // Module 13: Advanced Patterns (Day 29)
    {
      day: 29,
      title: "Module 13: Advanced React Patterns (Learn & Practice)",
      description: "Master advanced patterns: render props, higher-order components, compound components.",
      topics: ["Render props", "HOCs", "Compound components", "Custom hooks patterns"],
    },
    // Module 14: Production & Deployment (Day 30)
    {
      day: 30,
      title: "Module 14: Production Build & Deployment (Project)",
      description: "Final review and deploy your React application to production. Best practices and next steps.",
      topics: ["Production build", "Deployment strategies", "Environment variables", "Final project review"],
    },
  ],
};

export const DEMO_LESSON_CONTENT = `# Introduction to React

Welcome to your first step in mastering React! Today, we'll explore what makes React one of the most popular JavaScript libraries for building user interfaces.

## What is React?

React is a **declarative, component-based JavaScript library** developed by Meta (formerly Facebook) for building interactive user interfaces. Instead of manipulating the DOM directly, you describe what your UI should look like, and React handles the updates efficiently.

### Why React?

1. **Component-Based Architecture**: Build encapsulated components that manage their own state
2. **Declarative**: Design simple views for each state, and React efficiently updates the right components
3. **Learn Once, Write Anywhere**: Use React for web, mobile (React Native), and even VR

## JSX: JavaScript + XML

JSX is a syntax extension that looks like HTML but works in JavaScript. It makes React code more readable and expressive.

\`\`\`jsx
function Welcome() {
  return <h1>Hello, React!</h1>;
}
\`\`\`

Under the hood, JSX transforms to regular JavaScript:

\`\`\`javascript
function Welcome() {
  return React.createElement('h1', null, 'Hello, React!');
}
\`\`\`

## Your First Component

Components are the building blocks of React applications. Here's a simple functional component:

\`\`\`jsx
function Greeting(props) {
  return (
    <div className="greeting">
      <h1>Welcome, {props.name}!</h1>
      <p>Ready to learn React?</p>
    </div>
  );
}

// Usage
<Greeting name="Developer" />
\`\`\`

### Component Rules

- Component names must start with a capital letter
- Components must return a single parent element
- Use \`className\` instead of \`class\` for CSS classes
- Embed JavaScript expressions with curly braces \`{}\`

## Props: Passing Data

Props (properties) allow you to pass data from parent to child components. They're **read-only** and help make components reusable.

\`\`\`jsx
function UserCard(props) {
  return (
    <div className="card">
      <img src={props.avatar} alt={props.name} />
      <h2>{props.name}</h2>
      <p>{props.bio}</p>
    </div>
  );
}

// Usage with different data
<UserCard 
  name="Alice" 
  avatar="/alice.jpg" 
  bio="Frontend Developer" 
/>
\`\`\`

## Development Environment Setup

To start building React apps, you'll need:

1. **Node.js** (v18 or higher recommended)
2. **Package manager**: npm or yarn
3. **Code editor**: VS Code is popular
4. **Create React App** or **Vite** for project setup

### Quick Start with Vite

\`\`\`bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
\`\`\`

## Key Takeaways

- React is a **component-based library** for building UIs
- **JSX** combines JavaScript and HTML-like syntax
- **Components** are reusable building blocks that accept **props**
- React uses a **virtual DOM** for efficient updates
- Modern React uses **functional components** with hooks

## Next Steps

In the next module, you'll practice building components and working with props. Get ready to make your components interactive with state and event handlers!

**Practice Tip**: Try creating 3-4 simple components on your own before moving forward. The more you code, the more natural React will feel.`;

export const DEMO_ACTIVITIES = [
  {
    id: "demo-activity-1",
    question: "Create a \`Button\` component that accepts a \`label\` prop and an \`onClick\` prop. The button should display the label text and call the onClick function when clicked.",
    answer: `\`\`\`jsx
function Button(props) {
  return (
    <button onClick={props.onClick} className="btn">
      {props.label}
    </button>
  );
}

// Usage example:
function App() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return <Button label="Click Me" onClick={handleClick} />;
}
\`\`\`

**Explanation**: This component accepts two props: \`label\` for the button text and \`onClick\` for the click handler. When the button is clicked, it calls the function passed via props. This pattern makes the button reusable across your application.`,
    order_index: 0,
    revealed: false,
  },
  {
    id: "demo-activity-2",
    question: "Build a \`ProfileCard\` component that displays a user's name, email, and profile picture. Accept these as props and render them in a styled card layout.",
    answer: `\`\`\`jsx
function ProfileCard(props) {
  return (
    <div className="profile-card">
      <img 
        src={props.profilePicture} 
        alt={props.name}
        className="profile-img"
      />
      <h2>{props.name}</h2>
      <p className="email">{props.email}</p>
    </div>
  );
}

// Usage:
<ProfileCard 
  name="Sarah Johnson"
  email="sarah@example.com"
  profilePicture="https://i.pravatar.cc/150?img=5"
/>
\`\`\`

**Why this works**: The component destructures props to access name, email, and profilePicture. Using semantic HTML and className attributes, we can style this card with CSS. This pattern is perfect for displaying user information throughout your app.`,
    order_index: 1,
    revealed: false,
  },
  {
    id: "demo-activity-3",
    question: "Create a \`ProductList\` component that receives an array of products as a prop. Each product has \`id\`, \`name\`, and \`price\`. Render the list using \`.map()\` and proper keys.",
    answer: `\`\`\`jsx
function ProductList(props) {
  return (
    <div className="product-list">
      <h2>Our Products</h2>
      <ul>
        {props.products.map(product => (
          <li key={product.id} className="product-item">
            <span className="name">{product.name}</span>
            <span className="price">\${product.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Usage:
const products = [
  { id: 1, name: "Laptop", price: 999 },
  { id: 2, name: "Mouse", price: 29 },
  { id: 3, name: "Keyboard", price: 79 },
];

<ProductList products={products} />
\`\`\`

**Key points**: 
1. Use \`.map()\` to transform the array into JSX elements
2. Each element needs a unique \`key\` prop (use product.id)
3. Keys help React identify which items changed for efficient updates`,
    order_index: 2,
    revealed: false,
  },
  {
    id: "demo-activity-4",
    question: "Explain the difference between props and state in React. When would you use each, and why are props read-only?",
    answer: `**Props vs State:**

**Props (Properties):**
- Passed FROM parent TO child components
- **Read-only** (immutable in child component)
- Used for component configuration and data flow
- Think of props like function parameters

**State:**
- Managed WITHIN a component
- **Mutable** (can be changed with setState or useState)
- Used for dynamic data that changes over time
- Causes re-render when updated

**Why Props Are Read-Only:**

Props are immutable to maintain **unidirectional data flow** - data flows down from parent to child. This makes your app predictable and easier to debug. If children could modify props, you'd have data flowing in multiple directions, making it hard to track where changes originate.

**Example:**
\`\`\`jsx
// Parent manages state, passes data via props
function Parent() {
  const [count, setCount] = useState(0);
  
  return <Child count={count} onIncrement={() => setCount(count + 1)} />;
}

// Child receives props, cannot modify them directly
function Child(props) {
  // props.count = 5; // ❌ This won't work (read-only)
  return (
    <div>
      <p>Count: {props.count}</p>
      <button onClick={props.onIncrement}>Increment</button>
    </div>
  );
}
\`\`\`

The parent owns the state, and the child communicates changes back through callback props. This pattern keeps your data flow clear and manageable.`,
    order_index: 3,
    revealed: false,
  },
];

// Helper to get lesson content for a specific day
export function getDemoLesson(dayNumber: number) {
  const syllabusDay = DEMO_SYLLABUS.days.find(d => d.day === dayNumber);
  
  return {
    id: `demo-lesson-${dayNumber}`,
    bootcamp_id: DEMO_BOOTCAMP.id,
    day_number: dayNumber,
    title: syllabusDay?.title || `Day ${dayNumber}`,
    content: DEMO_LESSON_CONTENT,
    created_at: new Date().toISOString(),
  };
}

// Helper to get activities for a specific lesson
export function getDemoActivities(lessonId: string) {
  return DEMO_ACTIVITIES;
}
