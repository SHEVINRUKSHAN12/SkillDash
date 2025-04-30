import React from 'react';
import { Link } from 'react-router-dom';
// ...existing code...

function Navbar() {
  // ...existing code...
  return (
    <nav>
      {/* Ensure no <Router> is here */}
      <ul>
        {/* ...existing code... */}
        <li>
          <Link to="/customer-register">Customer Register</Link>
        </li>
        <li>
          <Link to="/sprovider-register">Register - Service Provider</Link>
        </li>
        {/* ...existing code... */}
      </ul>
    </nav>
  );
}

export default Navbar;
