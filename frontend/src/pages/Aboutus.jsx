import React, { useState, useEffect } from 'react';
import '/index.css';

const AboutPage = () => {
  const developers = [
    { name: 'PABBU SAKETH', role: 'S20230010169', email: 'saketh.p23@iiits.in', image: 'https://placehold.co/150x150/E0F2F1/1A4A40?text=PS', github: 'https://github.com/saketh169', linkedin: 'https://www.linkedin.com/in/saketh-pabbu-14342a291', portfolio: 'https://sakethpabbu-e-portfoilo.onrender.com' },
    { name: 'NERELLA VENKATA SRI RAM', role: 'S20230010164', email: 'venkatasriram.n23@iiits.in', image: 'https://placehold.co/150x150/E0F2F1/1A4A40?text=NVSR', github: '#', linkedin: '#', portfolio: '#' },
    { name: 'INALA SYAMA SRI SAI', role: 'S20230010104', email: 'syamasrisai.i23@iiits.in', image: 'https://placehold.co/150x150/E0F2F1/1A4A40?text=ISSS', github: '#', linkedin: '#', portfolio: '#' },
    { name: 'NULAKAJODU MAANAS ANAND', role: 'S20230010166', email: 'maanasanand.n23@iiits.in', image: 'https://placehold.co/150x150/E0F2F1/1A4A40?text=NMAA', github: '#', linkedin: '#', portfolio: '#' },
    { name: 'NITTA PRADEEP', role: 'S20230010165', email: 'pradeep.n23@iiits.in', image: 'https://placehold.co/150x150/E0F2F1/1A4A40?text=NP', github: '#', linkedin: '#', portfolio: '#' },
  ];

  const TestimonialsCarousel = () => {
    const [current, setCurrent] = useState(0);
    const testimonials = [
      {
        id: 1,
        name: 'Rahul Sharma',
        text: 'NutriConnect has been a game-changer for me. The personalized diet plans and expert consultations helped me achieve my fitness goals. Highly recommended!',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFvDoY9f33tMM-TI3-8615aaivmuBWat6qMg&s',
      },
      {
        id: 2,
        name: 'Priya Patel',
        text: 'I love how easy it is to connect with dietitians on NutriConnect. The platform is user-friendly, and the advice I received was spot on. Thank you!',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkYFUiwKTIUcEuJdF-QdBYWOIAPD7s9vcFGQ&s',
      },
      {
        id: 3,
        name: 'Anil Kumar',
        text: 'As a fitness enthusiast, NutriConnect has been a great tool for tracking my progress and getting tailored nutrition advice. It\'s a must-try!',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7kBZmGJXF2s0bYIAfHvl9isebHGjohtF4Eg&s',
      },
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
      }, 3000); // Changed to 3 seconds for faster rotation
      return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
      <section id="testimonials" className="py-20 px-4 md:px-8 bg-gradient-to-r from-green-50 to-teal-50 min-h-[400px] animate-fade-in-up animate-delay-[300ms]">
        <div className="max-w-4xl mx-auto text-center h-full flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">
            What Our Users Say
          </h2>
          <div className="relative">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-slide-in-right">
              <div className="flex justify-center mb-4">
                <img src={testimonials[current].image} alt={testimonials[current].name} className="w-24 h-24 rounded-full object-cover shadow-md" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">{testimonials[current].name}</h3>
              <p className="text-lg text-gray-600 italic leading-relaxed">
                "{testimonials[current].text}"
              </p>
            </div>
            <button
              onClick={() => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors z-10"
            >
              <i className="fas fa-chevron-left text-xl text-gray-700"></i>
            </button>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % testimonials.length)}
              className="absolute -right-10 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors z-10"
            >
              <i className="fas fa-chevron-right text-xl text-gray-700"></i>
            </button>
          </div>
        </div>
      </section>
    );
  };

  const FAQs = () => {
    const faqs = [
      { question: "How can I submit my own success story?", answer: "We'd love to hear from you! Please reach out to our team via the Contact Us page, and we'll guide you through the process of sharing your story." },
      { question: "Are these testimonials from real users?", answer: "Yes, all testimonials and success stories featured on our platform are from real NutriConnect users who have given us permission to share their experiences." },
      { question: "How are you able to provide these results?", answer: "Our platform connects you with certified dietitians and nutritionists who create personalized plans and provide ongoing support to help you achieve your goals." },
    ];

    const [openFAQ, setOpenFAQ] = useState(null);

    const toggleFAQ = (index) => {
      setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
      <section id="faqs" className="py-20 px-4 md:px-8 bg-gray-50 min-h-[400px] animate-fade-in-up animate-delay-[400ms]">
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3
                  className="text-xl font-semibold text-gray-700 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <i
                    className={`fas fa-chevron-down transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}
                  ></i>
                </h3>
                {openFAQ === index && <p className="text-gray-600 mt-4 leading-relaxed">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <main className="flex-1 animate-fade-in">
      <section id="about-intro" className="py-20 px-4 md:px-8 bg-gradient-to-b from-green-50 to-white min-h-[400px] animate-slide-up">
        <div className="max-w-6xl mx-auto h-full text-center flex flex-col justify-center">
          <h2 className="text-5xl font-extrabold text-gray-800 mb-4">About NutriConnect</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            NutriConnect was founded with a mission to bridge the gap between nutrition experts and individuals seeking a healthier life. Our platform is a comprehensive ecosystem designed to empower everyone on their wellness journey.
          </p>
        </div>
      </section>
      
      <section id="team" className="py-20 px-4 md:px-8 bg-white min-h-[400px] animate-fade-in-up animate-delay-[200ms]">
        <div className="max-w-6xl mx-auto h-full flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Meet Our Project Team</h2>
          <div className="space-y-10">
            {developers.map((dev, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center gap-8 px-4 md:px-8 py-10 bg-gray-50 rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ flexDirection: index % 2 === 0 ? 'row' : 'row-reverse' }}
              >
                <div className="w-48 h-48 rounded-full overflow-hidden shrink-0 shadow-md">
                  <img src={dev.image} alt={dev.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left flex-1 space-y-2">
                  <h3 className="text-3xl font-bold text-gray-700">{dev.name}</h3>
                  <p className="text-xl text-gray-500 font-medium mb-1">Role: {dev.role}</p>
                  <p className="text-md text-gray-500 font-medium mb-4">Email: {dev.email}</p>
                  <div className="flex justify-center md:justify-start space-x-4 mt-4">
                    <a href={dev.github} className="text-gray-500 hover:text-gray-800 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-github text-2xl"></i>
                    </a>
                    <a href={dev.linkedin} className="text-gray-500 hover:text-gray-800 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-linkedin text-2xl"></i>
                    </a>
                    <a href={dev.portfolio} className="text-gray-500 hover:text-gray-800 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                      <i className="fas fa-globe text-2xl"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <TestimonialsCarousel />
      <FAQs />
      
      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-slide-up {
            animation: slideUp 0.6s ease-out;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-fade-in {
            animation: fadeIn 0.6s ease-in-out;
          }
          @keyframes fadeInUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out;
          }
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slide-in-right {
            animation: slideInRight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .animate-delay-[200ms] { animation-delay: 200ms; }
          .animate-delay-[300ms] { animation-delay: 300ms; }
          .animate-delay-[400ms] { animation-delay: 400ms; }
        `}
      </style>
    </main>
  );
};

export default AboutPage;