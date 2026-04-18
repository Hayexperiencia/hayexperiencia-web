import { FC } from 'react';

const CicloTotalPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          CicloTotal: Impacto Positivo en los Territorios del Oriente Antioqueño
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Transformando residuos en oportunidades, construyendo un futuro más sostenible para nuestra región.
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-8 mb-16 text-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-green-600">5,500+</h2>
          <p className="text-gray-700 mt-2">Toneladas de residuos gestionadas mensualmente</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-green-600">184</h2>
          <p className="text-gray-700 mt-2">Colaboradores comprometidos con el medio ambiente</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-green-600">5 Municipios</h2>
          <p className="text-gray-700 mt-2">Con cobertura directa en el Oriente Antioqueño</p>
        </div>
      </section>

      <section className="mb-12">
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuestra Misión en el Oriente</h2>
          <p className="text-gray-700 leading-relaxed">
            Desde nuestra llegada al Oriente Antioqueño en 2012, en CicloTotal nos hemos dedicado a implementar un modelo de economía circular eficiente. No solo recolectamos y procesamos materiales como papel, vidrio, metales y plásticos, sino que también generamos empleo y promovemos una cultura de reciclaje en la comunidad. Cada tonelada que apartamos de los rellenos sanitarios es un paso hacia un ecosistema más sano y un futuro próspero para todos.
          </p>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Únete al Movimiento con "Ruta Reciclo"</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Facilitamos el reciclaje para ti. Con nuestra aplicación "Ruta Reciclo", puedes programar la recolección gratuita de tu material aprovechable desde tu hogar o negocio. Descárgala y empieza a ser parte del cambio.
        </p>
        <div className="flex justify-center space-x-4">
          {/* Enlaces a las tiendas de apps irían aquí */}
          <a href="#" className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300">
            Disponible en App Store
          </a>
          <a href="#" className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300">
            Disponible en Google Play
          </a>
        </div>
      </section>
    </div>
  );
};

export default CicloTotalPage;
