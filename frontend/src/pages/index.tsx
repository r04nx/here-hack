import { Button } from "@/components/ui/button";
import { ArrowRight, Map, Navigation, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1494783367193-149034c05e8f?q=80&w=2070&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">
              Navigate the Future with RoadFusion
            </h1>
            <p className="text-xl mb-8">
              Experience intelligent navigation powered by real-time data and advanced analytics. 
              Transform your journey with precise location technology.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link to="/login">Try Now <ArrowRight className="ml-2" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-16">
            Why Choose RoadFusion?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Map className="w-10 h-10" />}
              title="Precise Location Services"
              description="High-precision mapping and location services for accurate navigation and asset tracking."
              image="https://images.unsplash.com/photo-1548345680-f5475ea5df84?q=80&w=2073&auto=format&fit=crop"
            />
            <FeatureCard
              icon={<Zap className="w-10 h-10" />}
              title="Real-time Updates"
              description="Live traffic updates, road conditions, and dynamic routing for optimal journey planning."
              image="https://images.unsplash.com/photo-1573108724029-4c46571d6490?q=80&w=2069&auto=format&fit=crop"
            />
            <FeatureCard
              icon={<Shield className="w-10 h-10" />}
              title="Secure & Reliable"
              description="Enterprise-grade security with reliable performance for mission-critical operations."
              image="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2032&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-muted/50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Transform Your Business with Location Intelligence
              </h2>
              <p className="text-lg mb-8 text-muted-foreground">
                From fleet management to urban planning, RoadFusion provides the tools and insights 
                you need to make data-driven decisions.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-2">
                  <Navigation className="text-primary" />
                  <span>Advanced fleet tracking and management</span>
                </li>
                <li className="flex items-center gap-2">
                  <Navigation className="text-primary" />
                  <span>Smart city infrastructure planning</span>
                </li>
                <li className="flex items-center gap-2">
                  <Navigation className="text-primary" />
                  <span>Emergency response optimization</span>
                </li>
              </ul>
            </div>
            <div className="relative rounded-lg overflow-hidden h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1553547274-0df401ae03c9?q=80&w=2071&auto=format&fit=crop"
                alt="Smart city visualization"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 text-primary-foreground overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-primary/90" />
        </div>
        <div className="container relative z-10 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of organizations already using RoadFusion to transform their operations
            with intelligent location services.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/login">Start Your Journey</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, image }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div className="group relative rounded-lg overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={image} alt={title} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative z-10 p-6 text-white min-h-[320px] flex flex-col justify-end">
        <div className="text-primary-foreground mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-white/80">{description}</p>
      </div>
    </div>
  );
}
