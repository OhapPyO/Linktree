import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ZapIcon,
  Palette,
  BarChart3,
  Shield,
  Users,
  Smartphone,
  Star,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
const features = [
  {
    title: "Fully Customizable",
    description:
      "Customize your link page with a custom domain, custom short code, and more.",
    icon: <Palette className="w-8 h-8" />,
  },
  {
    title: "Advanced Analytics",
    description:
      "See detailed insights into your link traffic, including click counts, referrer information, and more.",
    icon: <BarChart3 className="w-8 h-8" />,
  },
  {
    title: "Lightning Fast",
    description:
      "Our platform is built to be fast and efficient, so you can get your link up and running in no time.",
    icon: <ZapIcon className="w-8 h-8" />,
  },
  {
    title: "Mobile Optimized",
    description:
      "Your link page look per on every device, from deskt computers to mobile phones to desktops",
    icon: <Smartphone className="w-8 h-8" />,
  },
  {
    title: "Secure and Reliable",
    description:
      "Your links are protected with end-to-end encryption and a secure infrastructure, so you can trust your links to be safe and reliable.",
    icon: <Shield className="w-8 h-8" />,
  },
  {
    title: "Team Collaboration",
    description:
      "Collaborate with your team to create and manage your links, and track your team's traffic in real-time.",
    icon: <Users className="w-8 h-8" />,
  },
];
const testimonials = [
  {
    name: "John Doe",
    role: "creator",
    content:
      "I love this platform because it's so easy to use and it's so fast.",
    rating: 5,
  },
  {
    name: "Mike Chen",
    role: "Small Business Owner",
    content:
      " I've been using this platform for my business for a few months now and it's been a game changer. It's so easy to use and it's so fast.",
    rating: 5,
  },
  {
    name: "Emma Davis",
    role: "Artist",
    content:
      " I've been using this platform for my art for a few months now and it's been a game changer. It's so easy to use and it's so fast.",
    rating: 4,
  },
];
export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <Header isFixed={true} />
      {/* Hero Section */}
      <section className="px-4 py-20 lg:px-8 lg:py-32">
        <div className="max-w-7xl mx-auto ">
          <div className="text-center space-y-8">
            <div className="space-y-6"></div>
            <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl leading-tight">
              One link,
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {" "}
                unlimited possibilities
              </span>
            </h1>
            <p className="text-xl text-gray-600 sm:text-2xl lg:text-3xl max-w-3xl mx-auto">
              Create a single link that redirects to multiple destinations,
              perfect for sharing a single URL across multiple platforms.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"></div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 text-lg h-auto px-8 py-6"
              >
                <Link href="/dashboard">
                  <span className="font-medium">Start Building Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className=" border-purple-600 text-purple-600
                 hover:bg-purple-600 hover:text-white text-lg h-auto px-8 py-6"
              >
                <Link href="#features">See How It Works</Link>
              </Button>
            </div>
            <div className="pt-12">
              <p className="text-sm te-gr500 mb-4">Trusted by 100,000+ users</p>
              <div className="flex justify-center items-center gap-8">
                <div className="text-2xl font-bold text-gray-400">Creator</div>
                <div className="text-2xl font-bold text-gray-400">Business</div>
                <div className="text-2xl font-bold text-gray-400">
                  Influencer
                </div>
                <div className="text-2xl font-bold text-gray-400">Artist</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="px-4 py-20 lg:px-8 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl leading-tight">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 sm:text-2xl lg:text-3xl max-w-2xl mx-auto">
              From creating a single link to multiple destinations to tracking
              your traffic, we&apos;ve got you covered.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm 
              border  border-white/20 p-8 rounded-2xl shadow-xl shadow-gray-200/50 hover:shadow-2xl 
              transition-all  duration-300"
              >
                <div className=" text-purple-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* social proof section */}
      <section className="px-4 py-20 lg:px-8 lg:py-32 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Love by creators
            </h2>
            <p className="text-xl text-gray-600">
              See What Our Users Are Saying about our platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm 
              border  border-white/20 p-8 rounded-2xl shadow-xl shadow-gray-200/50 hover:shadow-2xl 
              transition-all  duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="px-4 lg:px-8 py-26 ">
        <div className="max-w-7xl mx-auto">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 
              hover:from-blue-600 hover:to-purple-700 text-white
           p-12 rounded-3xl text-center shadow-2xl "
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready To Get Started?{" "}
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Create a single link that redirects to multiple destinations,
              perfect for sharing a single URL across multiple platforms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-purple-600 hove:bg-gray-100 text-lg px-8 py-6 h-auto font-semibold"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  Create Your First Link
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4"></CheckCircle>
                Free To Start
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4"></CheckCircle>
                No Credit Card Required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4"></CheckCircle>
                Setup in 15 seconds
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 px-4 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="text-2xl font-bold text-gray-900">Linkify</div>
              <p className="text-gray-600">
                The easiest way to create a single link that redirects to
                multiple destinations, perfect for sharing a single URL across
                multiple platforms.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <div className="space-y-2 text-gray-600">
                <div>Features</div>
                <div>Pricing</div>
                <div>Analytics</div>
                <div>Integrations</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <div className="space-y-2 text-gray-600">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <div className="space-y-2 text-gray-600">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>Cookie Settings</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
            <div className="space-y-2 text-gray-600">
              <div>Facebook</div>
              <div>Twitter</div>
              <div>Instagram</div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
            <p className="text-gray-600 text-center">
              &copy; {new Date().getFullYear()} Linkify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
