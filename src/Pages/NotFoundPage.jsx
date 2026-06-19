import "./NotFoundPage.css";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="notfound">
      <h1>404</h1>

      <h2>Page Not Found</h2>

      <p>
        Sorry, the page you are looking for does not exist.
      </p>

      <Link to="/" className="home-btn">
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFoundPage;