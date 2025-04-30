import React from 'react';
import { Link } from 'react-router-dom';
// ...existing code...

function HomeNav() {
  // ...existing code...
  return (
    <nav>
      {/* ...existing code... */}
      <Link to="/customer-login">
        <button>Customer Login</button>
      </Link>
      <Link to="/service-provider-login">
        <button>Service Provider Login</button>
      </Link>
      {/* ...existing code... */}
    </nav>
  );
}

export default HomeNav;
