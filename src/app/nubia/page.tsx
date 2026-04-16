
import { type NextPage } from "next";

const NubiaPage: NextPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-800 dark:text-white sm:text-[5rem]">
          Un Mensaje para la Tía <span className="text-primary">Nubia</span>
        </h1>
        <p className="max-w-2xl text-xl text-gray-600 dark:text-gray-300">
          En Hay Experiencia, valoramos a cada miembro de nuestro equipo. Tía Nubia, tu dedicación y arduo trabajo no pasan desapercibidos.
        </p>
        <p className="max-w-2xl text-xl text-gray-600 dark:text-gray-300">
          Queremos agradecerte por todo lo que haces. Eres una parte fundamental de esta familia y te apreciamos inmensamente.
        </p>
        <p className="mt-8 text-2xl font-bold text-gray-700 dark:text-gray-200">
          ¡Gracias por ser una integrante tan importante de Hay Experiencia!
        </p>
      </div>
    </main>
  );
};

export default NubiaPage;

