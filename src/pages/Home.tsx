import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Users, BarChart3, Shield, Zap, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
const features = [
  {
    icon: Users,
    title: "Team Management",
    desc: "Organize teams, assign roles, and track member activity across projects effortlessly.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    desc: "Real-time dashboards and detailed reports to keep stakeholders informed.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "Role-based access control, audit logs, and data encryption at rest and in transit.",
  },
  {
    icon: Zap,
    title: "Real-time Collaboration",
    desc: "Instant messaging, live task updates, and seamless calendar integration.",
  },
];

const testimonials = [
  {
    name: "Jennifer Wright",
    role: "VP Engineering, Acme Corp",
    quote:
      "TeamCollab transformed how our engineering teams coordinate across time zones. Productivity is up 40%.",
    avatar: "/img/jennifer.jpg",
  },
  {
    name: "Robert Chang",
    role: "Product Director, Nexus Inc",
    quote:
      "The reporting and analytics features give us visibility we never had before. Essential for our quarterly planning.",
    avatar: "/img/robert.jpg",
  },
  {
    name: "Maria Santos",
    role: "CTO, DataFlow Systems",
    quote:
      "We evaluated 12 tools before choosing TeamCollab. The enterprise features and UX were unmatched.",
    avatar: "/img/maria.jpg",
  },
];

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero */}
      <section className="relative overflow-hidden text-primary-foreground bg-[url('/img/2.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 opacity-30 bg-black/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-2xl animate-[fadeIn_0.8s_ease-out]">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Where teams build{" "}
              <span className="text-white/90">great things together</span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80 max-w-xl">
              Streamline project management, enhance communication, and deliver
              results faster with the collaboration platform built for
              enterprise teams.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate(user ? "/dashboard" : "/login")}
                className="font-semibold"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">
              Everything your team needs
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for enterprise collaboration at scale.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-1"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">
              Trusted by industry leaders
            </h2>
            <p className="mt-4 text-muted-foreground">
              See what our customers have to say.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-warning text-warning"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-6 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
