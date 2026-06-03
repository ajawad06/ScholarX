import {
  ArrowRight,
  GraduationCap,
  LibraryBig,
  Settings,
  UserRoundCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">NUST Exchange Portal</p>
        <h1>Exchange and scholarship applications in one focused workspace.</h1>
        <p>
          Students can discover opportunities and apply. Instructors can review
          pending applications. Admins can manage programs, scholarships,
          students, and faculty records.
        </p>
        <div className="hero-actions">
          <Link className="button primary" to="/catalog">
            <LibraryBig size={18} /> View Catalog
          </Link>
          <Link className="button ghost" to="/login">
            Portal Login <ArrowRight size={18} />
          </Link>
        </div>
        <div className="hero-artwork-inline">
          <img
            src="/uploads/world-map.png"
            alt="Global Exchange Map"
            className="hero-img"
          />
        </div>
      </div>
    </section>
  );
}
