import { useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// --- 1. Configuración de Gráficas (Chart.js) ---
// Es necesario registrar los componentes que usaremos en la visualización matemática
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = "http://127.0.0.1:8000";

function App() {
  // --- 2. Estados de la Aplicación (React Hooks) ---
  const [file, setFile] = useState(None);
  const [previewUrl, setPreviewUrl] = useState(None);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(None);
  const [error, setError] = useState(None);

  // --- 3. Manejadores de Eventos ---

  // Cuando el usuario selecciona un archivo
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        setFile(selectedFile);
        // Crear URL temporal para previsualizar la imagen
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setResult(None); // Limpiar resultados anteriores
        setError(None);
    }
  };

  // Cuando el usuario hace clic en "Analizar"
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
        setError("Por favor selecciona una imagen primero.");
        return;
    }

    setLoading(true);
    setError(None);

    // Crear el formulario de datos para enviar el archivo binario
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Conexión con el Backend (Llamada asíncrona)
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err) {
      console.error("Error conectando al backend:", err);
      setError("Error al analizar la imagen. Asegúrate que el backend esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  // --- 4. Preparación de Datos para la Gráfica ---
  const chartData = result ? {
    labels: Object.keys(result.analisis_detallado),
    datasets: [
      {
        label: 'Probabilidad (%)',
        data: Object.values(result.analisis_detallado).map(val => val * 100),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // Colores distintos para cada barra
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Distribución de Probabilidades Emocionales' },
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 100
        }
    }
  };


  // --- 5. Renderizado de la Interfaz (JSX + Tailwind CSS) ---
  return (
    <div className="min-h-screen p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-indigo-700">
          Sistema de Percepción Emocional Infantil
        </h1>
        <p className="text-gray-600 mt-2">
          Análisis de dibujos mediante Inteligencia Artificial y Computación Visual.
        </p>
      </header>

      <main className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:flex">
        
        {/* Sección Izquierda: Subida y Previsualización */}
        <div className="md:w-1/2 p-8 border-r border-gray-100 bg-gray-50">
            <h2 className="text-2xl font-semibold mb-6">1. Cargar Dibujo</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Haz clic para subir</span> o arrastra la imagen</p>
                            <p className="text-xs text-gray-500">JPG, PNG (Max. 5MB)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                </div>

                {previewUrl && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                        <img src={previewUrl} alt="Vista previa" className="w-full h-48 object-cover rounded-lg shadow-sm" />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !file}
                    className={`w-full py-3 px-4 text-white font-bold rounded-lg transition duration-200 ${
                        loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Procesando con IA...
                        </span>
                    ) : 'Analizar Emociones'}
                </button>
            </form>
            {error && <p className="mt-4 text-red-500 text-sm text-center font-medium">{error}</p>}
        </div>

        {/* Sección Derecha: Resultados y Gráficas */}
        <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-semibold mb-6">2. Resultados del Análisis</h2>
            
            {!result && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    <p>Sube una imagen para ver el diagnóstico computacional.</p>
                </div>
            )}

            {result && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-center">
                        <h3 className="text-sm uppercase tracking-wider font-bold text-indigo-500 mb-2">Emoción Predominante</h3>
                        <p className="text-4xl font-extrabold text-gray-900">{result.emocion_detectada}</p>
                        <p className="text-indigo-700 font-medium mt-2">
                            Certeza del modelo: {(result.confianza * 100).toFixed(1)}%
                        </p>
                    </div>

                    <div className="mt-8">
                        <Bar data={chartData} options={chartOptions} />
                        <p className="text-xs text-gray-500 mt-4 text-center">
                            *Este análisis es una herramienta de apoyo basada en percepción computacional y no sustituye un diagnóstico psicológico profesional.
                        </p>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}

export default App;
