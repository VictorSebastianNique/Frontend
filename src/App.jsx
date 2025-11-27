import { useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- URL DE PRODUCCIÓN (NUBE) ---
const API_URL = "https://backend-emociones-e4qp.onrender.com/"; 

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setResult(null);
        setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError("Selecciona una imagen primero."); return; }
    
    setLoading(true); 
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Error conectando al servidor. Puede que Render se esté 'despertando', intenta de nuevo en 1 minuto.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? {
    labels: Object.keys(result.analisis_detallado),
    datasets: [{
        label: 'Probabilidad (%)',
        data: Object.values(result.analisis_detallado).map(v => v * 100),
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
    }]
  } : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-indigo-800 mb-8">Análisis Emocional (Versión Cloud)</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row gap-8">
        <div className="flex-1">
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center mb-4 relative bg-gray-50">
                {previewUrl ? <img src={previewUrl} className="h-full object-contain rounded" /> : <p className="text-gray-400">Sube tu dibujo aquí</p>}
                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <button onClick={handleSubmit} disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-400">
                {loading ? 'Analizando...' : 'Procesar'}
            </button>
            {error && <p className="text-red-500 mt-2 text-center text-sm">{error}</p>}
        </div>
        <div className="flex-1 flex flex-col justify-center border-l pl-0 md:pl-8">
            {result ? (
                <>
                    <h2 className="text-4xl font-extrabold text-indigo-600 mb-1">{result.emocion_detectada}</h2>
                    <p className="text-gray-500 mb-6">Certeza: {(result.confianza * 100).toFixed(1)}%</p>
                    <div className="h-64"><Bar data={chartData} options={{ maintainAspectRatio: false }} /></div>
                </>
            ) : <div className="text-center text-gray-400"><p>Los resultados aparecerán aquí</p></div>}
        </div>
      </div>
    </div>
  );
}
export default App;
