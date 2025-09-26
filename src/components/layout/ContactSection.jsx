import { useState } from 'react'; // Importar useState
import { Phone, Mail, MapPin } from 'lucide-react';

function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar el error para el campo actual al escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del correo no es válido';
    }
    if (!formData.subject.trim()) newErrors.subject = 'El asunto es requerido';
    if (!formData.message.trim()) newErrors.message = 'El mensaje es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false); // Resetear el estado de éxito
    if (validateForm()) {
      setIsSubmitting(true);
      // Simular envío de formulario
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Formulario enviado:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true); // Indicar éxito
      setFormData({ name: '', email: '', subject: '', message: '' }); // Limpiar formulario
      setErrors({}); // Limpiar errores
    }
  };

  return (
    <section id="contact" className="mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Contáctanos</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Estamos aquí para ayudarte con cualquier pregunta sobre nuestros productos o servicios. 
            No dudes en contactarnos para obtener más información.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin size={24} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Dirección</h3>
                <p className="text-gray-700">Av. Central #123, Ciudad de Panamá, Panamá</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone size={24} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Teléfono</h3>
                <p className="text-gray-700">+507 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail size={24} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Correo Electrónico</h3>
                <p className="text-gray-700">info@petsyu.com</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
            {submitSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">¡Éxito!</strong>
                <span className="block sm:inline"> Tu mensaje ha sido enviado.</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                  placeholder="Tu nombre"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby="name-error"
                />
                {errors.name && <p id="name-error" className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Correo</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                  placeholder="tu@email.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby="email-error"
                />
                {errors.email && <p id="email-error" className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
              <input 
                type="text" 
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                placeholder="Asunto de tu mensaje"
                aria-invalid={errors.subject ? "true" : "false"}
                aria-describedby="subject-error"
              />
              {errors.subject && <p id="subject-error" className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
              <textarea 
                id="message"
                name="message"
                rows={4} 
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                placeholder="Escribe tu mensaje aquí..."
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby="message-error"
              ></textarea>
              {errors.message && <p id="message-error" className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>
            <button 
              type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
