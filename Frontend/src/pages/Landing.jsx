import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Activity, Users, FileText } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { theme, variants } from '../styles/theme';

export default function Landing() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Active Tenders', value: '1,200+', icon: FileText },
    { label: 'Registered Companies', value: '850+', icon: Users },
    { label: 'Transparency Score', value: '98%', icon: Shield },
    { label: 'Daily Activities', value: '5k+', icon: Activity },
  ];

  const features = [
    {
      title: 'Transparent Bidding',
      description: 'Real-time tracking of all government tenders and bid submissions with complete audit trails.',
      icon: Shield,
    },
    {
      title: 'Smart Analytics',
      description: 'Advanced data visualization for spending patterns, vendor performance, and budget utilization.',
      icon: Activity,
    },
    {
      title: 'Citizen Oversight',
      description: 'Empowering citizens to monitor projects and file complaints directly to government auditors.',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 -z-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-100/50 to-transparent blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial="initial"
            animate="animate"
            variants={variants.staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={variants.fadeIn}>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-8 border border-blue-200">
                <Shield className="w-4 h-4 mr-2" />
                Official Government Portal
              </span>
            </motion.div>
            
            <motion.h1 
              variants={variants.fadeIn}
              className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-8"
            >
              Transparency in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Public Procurement
              </span>
            </motion.h1>
            
            <motion.p 
              variants={variants.fadeIn}
              className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              WatchOut connects citizens, companies, and government auditors in a unified platform for transparent tender management and accountability.
            </motion.p>
            
            <motion.div 
              variants={variants.fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="group"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-4"
              >
                <div className="p-3 bg-blue-50 rounded-2xl mb-4 text-blue-600">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why WatchOut?</h2>
            <p className="text-lg text-slate-600">
              Built with advanced security and transparency features to ensure fair practices in government spending.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="h-full border-t-4 border-t-blue-500"
              >
                <div className="p-3 bg-blue-50 rounded-xl w-fit mb-6 text-blue-600">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 -z-10" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10" />
        
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to transform public procurement?
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of companies and citizens ensuring transparency in government projects today.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl"
          >
            Create Free Account
          </Button>
        </div>
      </section>
    </div>
  );
}
