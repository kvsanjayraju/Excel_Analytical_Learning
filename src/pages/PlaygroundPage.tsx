import { Grid } from '../components/Grid';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PlaygroundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-500 hover:text-slate-900">
                <ArrowLeft />
            </Link>
            <h1 className="font-bold text-lg">Spreadsheet Playground</h1>
        </div>
        <div className="text-sm text-slate-500">
            Experiment with values and simple formulas (=A1+B1)
        </div>
      </header>

      <main className="flex-1 p-8 overflow-auto flex justify-center items-start">
        <div className="bg-white p-1 rounded-lg shadow-xl">
            <Grid
                initialState={{}}
                readOnly={false}
            />
        </div>
      </main>
    </div>
  );
};
