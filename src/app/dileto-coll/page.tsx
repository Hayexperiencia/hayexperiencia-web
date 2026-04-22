import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

const DiletoCollPage: NextPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>Dileto Coll | Agencia Boutique de Marketing Digital</title>
        <meta
          name="description"
          content="Especialistas en contenido de alto valor comercial para marcas de moda en Medellín. Llevamos tu marca al siguiente nivel."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Dileto Coll</h1>
          <p className="text-xl text-gray-600">
            Agencia Boutique de Marketing Digital & Generación de Contenido de Alto Valor Comercial
          </p>
        </header>

        <section className="bg-white rounded-lg shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Transformamos marcas de moda en Medellín
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
            Dirigida por <strong>Diana María Ramírez Gómez</strong>, Dileto Coll es una agencia boutique enfocada en crear estrategias de contenido que no solo generan engagement, sino que impulsan la facturación. Nos especializamos en el vibrante sector de la moda, ayudando a marcas a conectar con su audiencia y a construir una presencia digital sólida y rentable.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Casos de Éxito</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Bona Calzature</h3>
              <p className="text-gray-700 mb-4">
                Llevamos la estrategia digital de <a href="https://bona.com.co" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Bona.com.co</a>, consolidando su presencia online y convirtiendo el contenido en un pilar fundamental de su crecimiento comercial.
              </p>
              <span className="text-sm font-medium bg-green-100 text-green-800 py-1 px-3 rounded-full">E-commerce de Calzado</span>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Distribuidora Centro Japón</h3>
              <p className="text-gray-700 mb-4">
                Construimos su comunidad en redes sociales desde cero, alcanzando más de <strong>200,000 seguidores</strong> con un alto nivel de engagement. Nuestro contenido se traduce directamente en resultados de negocio.
              </p>
              <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-3 rounded-full">Redes Sociales</span>
            </div>
          </div>
        </section>

        <section className="text-center mt-16 bg-white rounded-lg shadow-xl p-10">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">¿Listo para llevar tu marca al siguiente nivel?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Contacta a Gabriel Ramírez para una consulta.
          </p>
          <div className="space-y-3">
            <p className="text-xl font-medium text-gray-900">
              <strong>Email:</strong> gerencia@hayexperiencia.com
            </p>
            <p className="text-xl font-medium text-gray-900">
              <strong>Celular:</strong> 3043270606
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DiletoCollPage;
