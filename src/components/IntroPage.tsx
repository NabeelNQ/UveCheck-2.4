
import React from 'react';

interface IntroPageProps {
  onStart: () => void;
}

const guidelines = [
    { title: "Argentina – National Clinical Practice Guidelines for JIA (2011)", href: "https://www.reumatologia.org.ar/recursos/guia_artritis_idiopatica_2011.pdf" },
    { title: "Czech Republic & Slovakia – SHARE Initiative Adaptation (2020)", href: "https://doi.org/10.31348/2020/7" },
    { title: "Germany – Nationwide study with proposed guideline modifications (2007)", href: "https://doi.org/10.1093/rheumatology/kem053" },
    { title: "MIWGUC (Multinational Group) – Practical global approach (2024)", href: "https://doi.org/10.1136/bjo-2023-324406" },
    { title: "Nordic Countries – Nordic screening guideline (2022)", href: "https://doi.org/10.1111/aos.15299" },
    { title: "Portugal – Joint Ophthalmology & Paediatric Rheumatology guidelines (2021)", href: "https://arpopenrheumatology.com/article/view/15556" },
    { title: "Spain – Treatment recommendations for JIA-associated uveitis (2014)", href: "https://doi.org/10.1007/s11926-014-0437-4" },
    { title: "United States & Pakistan – ACR/Arthritis Foundation guideline (2019)", href: "https://doi.org/10.1002/acr.23871" },
];


const IntroPage: React.FC<IntroPageProps> = ({ onStart }) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-10 animate-fade-in text-left">
      <header className="text-center mb-8">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900">UveCheck</h1>
        <p className="text-gray-600 text-lg mt-2">Predict the risk of uveitis in children</p>
      </header>

      <section className="space-y-4 text-gray-700 text-base">
        <p>
          UveCheck is a specialized health screening app designed to support the early detection of uveitis in children with juvenile idiopathic arthritis (JIA).
        </p>
        <p>
          By applying advanced algorithms to key risk factors, the app generates personalized screening recommendations. It equips healthcare professionals with actionable insights, enabling timely clinical decisions and improving patient outcomes.
        </p>
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Guideline-Driven, Globally Informed</h2>
        <p className="mb-6 text-gray-700 text-base">UveCheck integrates evidence-based recommendations from leading global guidelines:</p>
        <ul className="space-y-4 text-base">
          {guidelines.map(({ title, href }) => (
            <li key={title}>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-start text-gray-700 hover:text-black transition-colors duration-200 group">
                  <span className="text-xl mr-3">👉</span>
                  <span className="group-hover:underline">{title}</span>
                </a>
              ) : (
                <div className="flex items-start text-gray-700">
                  <span className="text-xl mr-3">👉</span>
                  <span>{title}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-gray-700 text-base">
            This multi-regional foundation makes UveCheck adaptable to diverse healthcare systems while maintaining scientific rigor and clinical reliability.
        </p>
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Why UveCheck?</h2>
        <ul className="space-y-3 text-gray-700 text-base">
          <li className="flex items-center"><span className="text-green-500 mr-3">✅</span> <strong>Evidence-based</strong> – Built on international best practices</li>
          <li className="flex items-center"><span className="text-green-500 mr-3">✅</span> <strong>Personalized</strong> – Tailored screening recommendations per child</li>
          <li className="flex items-center"><span className="text-green-500 mr-3">✅</span> <strong>Proactive</strong> – Helps prevent avoidable vision loss</li>
        </ul>
        <p className="mt-4 font-semibold text-gray-800 text-base">
            Stay informed. Stay proactive. Strengthen uveitis care with UveCheck.
        </p>
      </section>

      <div className="pt-4 mt-8 flex justify-center">
        <button
          onClick={onStart}
          className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white font-bold py-3 px-10 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default IntroPage;
