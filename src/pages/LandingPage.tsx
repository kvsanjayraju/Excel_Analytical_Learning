import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Grid, Zap, Layers } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="text-2xl font-bold tracking-tight">ExcelLearning</div>
        <div className="flex gap-4">
          <Link to="/map" className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900">Map</Link>
          <Link to="/playground" className="px-4 py-2 font-medium text-slate-600 hover:text-slate-900">Playground</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900"
          >
            Understand Excel<br/>
            <span className="text-blue-600">to its core.</span>
          </motion.h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
            Forget passive videos. Master spreadsheets by peeling back the layers—from the grid coordinate system to the flow of formulas.
          </p>

          <div className="flex gap-4">
            <Link to="/map" className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-transform hover:scale-105 flex items-center gap-2">
              Start Learning <ArrowRight size={20}/>
            </Link>
          </div>
        </div>

        <div className="relative">
           {/* Abstract visualization */}
           <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 mt-12">
                  <div className="p-6 bg-white rounded-2xl shadow-xl border border-slate-100">
                    <Grid className="w-8 h-8 text-blue-500 mb-4" />
                    <h3 className="font-bold text-lg">The Grid</h3>
                    <p className="text-slate-500 text-sm">Why rows & columns matter.</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl shadow-xl border border-slate-100">
                    <Zap className="w-8 h-8 text-yellow-500 mb-4" />
                    <h3 className="font-bold text-lg">Live Formulas</h3>
                    <p className="text-slate-500 text-sm">See data flow like electricity.</p>
                  </div>
              </div>
              <div className="space-y-6">
                  <div className="p-6 bg-white rounded-2xl shadow-xl border border-slate-100">
                    <Layers className="w-8 h-8 text-purple-500 mb-4" />
                    <h3 className="font-bold text-lg">Deep Models</h3>
                    <p className="text-slate-500 text-sm">Build mental models that stick.</p>
                  </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};
