import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="container text-center py-4">
      <div className="mb-3">
        <a
          href="https://facebook.com"
          className="text-dark mx-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook size={24} />
        </a>
        <a
          href="https://twitter.com"
          className="text-dark mx-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter size={24} />
        </a>
        <a
          href="https://linkedin.com"
          className="text-dark mx-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin size={24} />
        </a>
      </div>
      <p>&copy; 2026 Leon</p>
    </footer>
  );
}
