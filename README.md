# TaskFlow SaaS Landing Page

A premium, fully responsive, and accessible SaaS landing page called **TaskFlow**. Built using semantic HTML5, modern CSS3 (with CSS variables, grid, flexbox, and dynamic dark mode), and clean Vanilla JavaScript (ES6).

## Directory Structure

```text
frontend-task/
├── index.html          # Main HTML5 semantic structure
├── css/
│   ├── style.css       # Core styling & design system variables
│   └── responsive.css  # Mobile and tablet responsiveness rules
├── js/
│   └── app.js          # Theme toggling, API loading state, and form validation
├── images/             # Image directory
├── README.md           # Project documentation
└── .gitignore          # Git ignore files
```

## Features

- **Dynamic Dark/Light Mode:** Full integration with the system preference and a toggle button. Zero theme flash (FOUC) on load using a small inline blocking script.
- **Async Article Loading:** Retrieves 6 posts from the JSONPlaceholder API with custom loading, success, and error states.
- **Client-Side Form Validation:** Dynamic inline error handling for the Contact Form with accessibility checks (`aria-invalid`, `aria-describedby`) and success feedback.
- **Premium Styling:** Built with a minimal Stripe/Linear-like design aesthetic, subtle custom shadows, squircle corners, and keyboard-navigable interactive controls.
- **Responsive Layout:** Adapts seamlessly from mobile (<768px) and tablet (<1024px) screens to full desktop viewports using CSS Grid and Flexbox.
