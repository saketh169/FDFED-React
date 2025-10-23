import React from 'react'
import { useState } from 'react'


const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    query: ''
  })
  const [submittedData, setSubmittedData] = useState(null)

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    setSubmittedData(formData)
    setFormData({ name: '', email: '', role: '', query: '' })
  }

  return (
    <main className='flex-1 py-5 px-4 md:px-8 bg-gray-50'>
      <div className='max-w-6xl mx-auto text-center'>
        <h1 className='text-4xl font-bold text-[#1E6F5C] mb-4'>Get In Touch</h1>
        <p className='text-lg text-gray-700 max-w-2xl mx-auto mb-12'>
          We'd love to hear from you. Send us a message, and we'll get back to
          you as soon as possible.
        </p>
      </div>

      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 items-start'>
        {/* Contact Form */}
        <div className='bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#28B463]'>
          <h2 className='text-2xl font-bold text-[#2C3E50] mb-6 text-center'>
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <input
                type='text'
                name='name'
                placeholder='Full Name'
                value={formData.name}
                onChange={handleChange}
                className='w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#28B463] focus:border-transparent transition-all'
                required
              />
            </div>
            <div>
              <input
                type='email'
                name='email'
                placeholder='Email Address'
                value={formData.email}
                onChange={handleChange}
                className='w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#28B463] focus:border-transparent transition-all'
                required
              />
            </div>
            <div>
              <select
                name='role'
                value={formData.role}
                onChange={handleChange}
                className='w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#28B463] focus:border-transparent transition-all text-gray-500'
                required
              >
                <option value='' disabled>
                  Select Your Role
                </option>
                <option value='User'>User</option>
                <option value='Dietitian'>Dietitian</option>
                <option value='Certifying Organization'>
                  Certifying Organization
                </option>
                <option value='Corporate Partner'>Corporate Partner</option>
              </select>
            </div>
            <div>
              <textarea
                name='query'
                placeholder='Your Message'
                rows='5'
                value={formData.query}
                onChange={handleChange}
                className='w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#28B463] focus:border-transparent transition-all'
                required
              ></textarea>
            </div>
            <button
              type='submit'
              className='w-full bg-[#28B463] text-white py-3 rounded-full font-semibold hover:bg-[#1E6F5C] transition-all duration-300'
            >
              Send Message
            </button>
          </form>
        </div>
        {/* Contact Details Box */}
        <div className='bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#28B463] flex flex-col justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-[#2C3E50] mb-6 text-center'>
              Contact Information
            </h2>
            <p className='text-gray-700 text-center mb-8'>
              Feel free to reach out to us directly via our contact details
              below.
            </p>
            <div className='space-y-4 text-left text-gray-700'>
              <div className='flex items-center'>
                <i className='fas fa-envelope mr-3 text-[#28B463] text-2xl'></i>
                <span className='text-lg'>nutriconnect6@gmail.com</span>
              </div>
              <div className='flex items-center'>
                <i className='fas fa-phone mr-3 text-[#28B463] text-2xl'></i>
                <span className='text-lg'>+91 70757 83143</span>
              </div>
              <div className='flex items-center'>
                <i className='fas fa-map-marker-alt mr-3 text-[#28B463] text-2xl'></i>
                <span className='text-lg'>
                  45 Wellness Avenue, Greenfield, CA 93927
                </span>
              </div>
            </div>
          </div>

          <div className='mt-8 text-center'>
            <h3 className='text-lg font-semibold text-[#1E6F5C] mb-4'>
              Follow Us
            </h3>
            <div className='flex justify-center gap-4'>
              <a
                target='_blank'
                href='https://www.facebook.com/profile.php?id=61572485733709'
                className='w-12 h-12 flex items-center justify-center text-[#28B463] bg-white rounded-full hover:bg-[#28B463] hover:text-white border border-[#28B463] hover:border-transparent transition-all duration-300'
              >
                <i className='fab fa-facebook-f text-xl'></i>
              </a>
              <a
                target='_blank'
                href='https://www.instagram.com/nutriconnect2025'
                className='w-12 h-12 flex items-center justify-center text-[#28B463] bg-white rounded-full hover:bg-[#28B463] hover:text-white border border-[#28B463] hover:border-transparent transition-all duration-300'
              >
                <i className='fab fa-instagram text-xl'></i>
              </a>
              <a
                target='_blank'
                href='https://x.com/NutriC21?t=ngy3BuReV6VcrXl3WXrCvg&s=09'
                className='w-12 h-12 flex items-center justify-center text-[#28B463] bg-white rounded-full hover:bg-[#28B463] hover:text-white border border-[#28B463] hover:border-transparent transition-all duration-300'
              >
                <i className='fab fa-twitter text-xl'></i>
              </a>
              <a
                target='_blank'
                href='https://www.linkedin.com/in/nutri-connect-a0b77434'
                className='w-12 h-12 flex items-center justify-center text-[#28B463] bg-white rounded-full hover:bg-[#28B463] hover:text-white border border-[#28B463] hover:border-transparent transition-all duration-300'
              >
                <i className='fab fa-linkedin-in text-xl'></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Submitted Message Box - Full Width */}
      {submittedData && (
        <div className='max-w-6xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#28B463]'>
          <h2 className='text-2xl font-bold text-[#2C3E50] mb-6 text-center'>
            Your Message Has Been Sent!
          </h2>
          <div className='space-y-4 text-left text-gray-700'>
            <p className='border-b border-gray-200 pb-2'>
              <span className='font-semibold text-[#1E6F5C]'>Name:</span>{' '}
              {submittedData.name}
            </p>
            <p className='border-b border-gray-200 pb-2'>
              <span className='font-semibold text-[#1E6F5C]'>Email:</span>{' '}
              {submittedData.email}
            </p>
            <p className='border-b border-gray-200 pb-2'>
              <span className='font-semibold text-[#1E6F5C]'>Role:</span>{' '}
              {submittedData.role}
            </p>
            <p>
              <span className='font-semibold text-[#1E6F5C]'>Message:</span>{' '}
              {submittedData.query}
            </p>
          </div>
        </div>
      )}

      {/* Map Section */}
      <div className='max-w-6xl mx-auto mt-16 rounded-2xl overflow-hidden shadow-lg border-4 border-[#28B463] text-center'>
        <h2 className='text-4xl font-bold text-[#1E6F5C] pt-8 mb-4'>
          Our Location
        </h2>
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3878.674466059435!2d80.0240734745556!3d13.55555050180794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4d773f1e0f8721%3A0xadb0842ffc2719e4!2sIndian%20Institute%20of%20Information%20Technology%2C%20Sri%20City%2C%20Chittoor!5e0!3m2!1sen!2sin!4v1760941438387!5m2!1sen!2sin'
          width='100%'
          height='450'
          allowfullscreen=''
          loading='lazy'
          referrerpolicy='no-referrer-when-downgrade'
          className='rounded-b-2xl'
        ></iframe>
      </div>
    </main>
  )
}

export default ContactPage
