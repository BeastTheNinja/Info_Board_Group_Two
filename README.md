# Template Boilerplate 🚀

A comprehensive, modern web development boilerplate featuring the **7-1 SCSS architecture** and **modular JavaScript structure**. Perfect for learning modern web development patterns and building scalable projects.

## ✨ Features

### 🎨 SCSS Architecture (7-1 Pattern)
- **Abstracts**: Variables, mixins, and functions
- **Base**: Reset, typography, and base styles
- **Components**: Reusable UI components (buttons, forms, cards)
- **Layout**: Header, footer, navigation, and grid system
- **Pages**: Page-specific styles (ready for expansion)
- **Themes**: Theme variations (ready for expansion)
- **Vendors**: Third-party library styles (ready for expansion)

### 🧩 Modular JavaScript Structure
- **ES6 Modules**: Modern import/export syntax
- **Component-Based**: Modal, Navigation, Form components
- **Utility Functions**: DOM manipulation, validation, helpers
- **Service Layer**: LocalStorage and future API integration
- **Global App Object**: Centralized module management

### 🛠️ Built-in Components
- **Responsive Navigation** with mobile menu support
- **Modal System** with alert/confirm/prompt dialogs
- **Form Validation** with real-time feedback
- **Grid System** with flexbox utilities
- **Button Components** with multiple variants and states
- **Card Components** with various layouts and themes

### 📱 Modern Features
- **Responsive Design** with mobile-first approach
- **Accessibility** features (ARIA attributes, focus management)
- **Performance Optimized** (debounce, throttle utilities)
- **Cross-browser Compatible** with modern CSS reset
- **Type-safe Validation** for forms and user input

## 📁 Project Structure

```
Template_Boiler/
├── index.html                 # Main HTML file
├── assets/
│   ├── css/
│   │   ├── main.css          # Compiled CSS output
│   │   └── main.css.map      # Source map for debugging
│   └── js/
│       ├── main.js           # Main application entry point
│       ├── utils/            # Utility modules
│       │   ├── dom.js        # DOM manipulation utilities
│       │   ├── helpers.js    # General helper functions
│       │   └── validation.js # Form validation utilities
│       ├── components/       # Reusable UI components
│       │   ├── Modal.js      # Modal dialog component
│       │   ├── Navigation.js # Navigation component
│       │   ├── Form.js       # Form validation component
│       │   └── FormSimple.js # Simplified form component
│       ├── modules/          # Feature modules
│       │   └── localstorage.js # LocalStorage utilities
│       └── services/         # API and data services (ready for expansion)
├── scss/                     # SCSS source files (7-1 Architecture)
│   ├── main.scss            # Main SCSS entry point
│   ├── abstracts/           # Variables, mixins, functions
│   │   ├── _variables.scss  # Color palette, typography, spacing
│   │   ├── _mixins.scss     # Reusable mixins
│   │   └── _functions.scss  # SCSS utility functions
│   ├── base/                # Base and reset styles
│   │   ├── _reset.scss      # Modern CSS reset
│   │   ├── _typography.scss # Typography styles
│   │   └── _base.scss       # Base element styles
│   ├── layout/              # Layout components
│   │   ├── _header.scss     # Header styles
│   │   ├── _footer.scss     # Footer styles
│   │   ├── _navigation.scss # Navigation styles
│   │   └── _grid.scss       # Grid system and utilities
│   ├── components/          # UI components
│   │   ├── _buttons.scss    # Button styles and variants
│   │   ├── _forms.scss      # Form controls and validation
│   │   └── _cards.scss      # Card component styles
│   ├── pages/               # Page-specific styles
│   ├── themes/              # Theme variations
│   └── vendors/             # Third-party styles
├── LICENSE                  # MIT License
└── README.md               # This documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser with ES6 module support
- SCSS compiler (optional, for style modifications)
- Code editor with syntax highlighting

### Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Template_Boiler.git
   cd Template_Boiler
   ```

2. **Open in browser**
   - Open `index.html` in your web browser
   - Or use a local development server for best experience

3. **Start developing**
   - Modify HTML in `index.html`
   - Edit styles in `scss/` directory
   - Add JavaScript functionality in `assets/js/`
   - Compile SCSS to CSS when making style changes

### SCSS Compilation
To compile SCSS files to CSS:
```bash
# Install Sass globally
npm install -g sass

# Watch for changes and compile automatically
sass --watch scss:assets/css

# Or compile once
sass scss/main.scss assets/css/main.css
```

## 🧩 Component Usage

### Modal Component
```javascript
// Simple alert
App.Modal.alert('Hello World!');

// Confirmation dialog
App.Modal.confirm('Are you sure?', 'Confirm Action', 
  () => console.log('Confirmed'),
  () => console.log('Cancelled')
);

// Custom modal
const modal = new App.Modal({
  size: 'large',
  backdrop: true
});
modal.setTitle('Custom Modal')
     .setContent('<p>Custom content here</p>')
     .show();
```

### Form Validation
```html
<!-- HTML -->
<form data-form-validate>
  <input type="email" name="email" required>
  <input type="password" name="password" minlength="8" required>
  <button type="submit">Submit</button>
</form>
```

### Navigation Component
```javascript
// Custom navigation options
const nav = new App.Navigation({
  mobileBreakpoint: 768,
  smoothScroll: true,
  autoCollapse: true
});
```

### Utility Functions
```javascript
// DOM utilities
const element = App.DOM.$('.my-selector');
App.DOM.addClass(element, 'active');

// Helper functions
const debounced = App.Helpers.debounce(myFunction, 300);
const formatted = App.Helpers.formatCurrency(1234.56);

// Validation
const isValid = App.Validation.isValidEmail('user@example.com');
```

## 🎨 SCSS Features

### Variables System
```scss
// Import variables
@import 'abstracts/variables';

// Use predefined colors
.my-component {
  background-color: $primary-color;
  color: $white;
  padding: spacer(3);
}
```

### Responsive Mixins
```scss
// Responsive design
.my-element {
  @include respond-to(md) {
    font-size: 1.2rem;
  }
  
  @include respond-below(sm) {
    display: none;
  }
}
```

### Button Variants
```scss
// Create custom button
.btn--custom {
  @include button-variant($white, $custom-color, $custom-color);
}
```

## 📱 Responsive Design

The boilerplate includes a comprehensive responsive design system:

- **Mobile-first approach** with progressive enhancement
- **Flexible grid system** with 12-column layout
- **Responsive typography** with fluid scaling
- **Touch-friendly** interface elements
- **Breakpoint system**: xs, sm, md, lg, xl, xxl

## ♿ Accessibility

Built-in accessibility features:
- **ARIA attributes** for screen readers
- **Keyboard navigation** support
- **Focus management** for modals and navigation
- **Color contrast** compliance
- **Semantic HTML** structure

## 🔧 Customization

### Adding New Components
1. Create SCSS file in `scss/components/`
2. Create JS file in `assets/js/components/`
3. Import in respective main files
4. Register component in global App object

### Extending the Color Palette
```scss
// In scss/abstracts/_variables.scss
$brand-primary: #your-color;
$brand-secondary: #your-secondary-color;
```

### Adding New Utility Functions
```javascript
// In assets/js/utils/helpers.js
export const myUtility = (param) => {
  // Your utility function
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **7-1 SCSS Architecture** by Hugo Giraudel
- **Modern CSS Reset** principles
- **ES6 Module System** best practices
- **Accessibility guidelines** from WCAG 2.1

## 📞 Support

For questions or support:
- Open an issue on GitHub
- Check the documentation in code comments
- Review the example implementations

---

**Happy coding!** 🎉 This boilerplate is designed to grow with your project and provide a solid foundation for modern web development.