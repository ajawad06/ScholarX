import {
  ArrowRight,
  GraduationCap,
  Globe2,
  LibraryBig,
  Settings,
  UserRoundCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { num: "35+", label: "Partner Universities" },
  { num: "12", label: "Countries" },
  { num: "100%", label: "Online Applications" },
];

const roles = [
  {
    icon: GraduationCap,
    title: "Students",
    text: "Discover exchange programs and scholarships, apply online with your documents, and track every application from one dashboard.",
  },
  {
    icon: UserRoundCheck,
    title: "Instructors",
    text: "Review applications from your assigned departments, inspect submitted documents, and approve or reject with a single click.",
  },
  {
    icon: Settings,
    title: "Administrators",
    text: "Manage partner universities, exchange programs, scholarships, and faculty records across the entire portal.",
  },
];

export function Home() {
  return (
    <section className="page">
      <div className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <Globe2 size={14} style={{ marginRight: 6 }} /> NUST Exchange Portal
          </p>
          <h1>
            Exchange and scholarship applications in one focused workspace.
          </h1>
          <p>
            A single, streamlined home for international exchange and
            scholarship opportunities at NUST. From discovering programs to the
            final decision, with documents and statuses all in one place.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/catalog">
              <LibraryBig size={18} /> View Catalog
            </Link>
            <Link className="button ghost" to="/login">
              Portal Login <ArrowRight size={18} />
            </Link>
          </div>

          <div className="hero-stats">
            {stats.map((s) => (
              <div className="stat-chip" key={s.label}>
                <span className="stat-num">{s.num}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="hero-artwork-inline">
            <img
              src="/uploads/world-map.png"
              alt="Global Exchange Map"
              className="hero-img"
            />
          </div>
        </div>
      </div>

      <div className="section-head">
        <p className="eyebrow">Built for everyone</p>
      </div>

      <div className="feature-grid">
        {roles.map(({ icon: Icon, title, text }) => (
          <article className="feature-card" key={title}>
            <div className="feature-icon">
              <Icon size={26} />
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
