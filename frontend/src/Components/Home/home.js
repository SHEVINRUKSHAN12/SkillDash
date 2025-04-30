import React, { useState, useEffect } from 'react';
import plumbingImage from '../../assets/images/plumbing.jpg';
import gardenImage from '../../assets/images/garden.jpg';
import electricalImage from '../../assets/images/electrical.jpg';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: plumbingImage,
      title: "Professional Plumbing Services",
      desc: "Expert plumbers at your service 24/7"
    },
    {
      image: gardenImage,
      title: "Lawn & Garden Maintenance",
      desc: "Keep your garden looking pristine"
    },
    {
      image: electricalImage,
      title: "Electrical Services",
      desc: "Licensed electricians for all your needs"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]); // Added slides.length as a dependency

  const containerStyle = {
    padding: '0', // Remove padding
    margin: '0', // Remove margin
    width: '100%'
  };

  const carouselStyle = {
    position: 'relative',
    height: '650px',
    overflow: 'hidden',
    marginBottom: '1 rem',
    marginTop: '0', // Align with top
    width: '100%', // Full width
    margin: '0' // Remove auto margins
  };

  const slideStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    transition: 'opacity 0.5s ease-in-out',
    opacity: 0,
    padding: '0' // Remove padding
  };

  const activeSlideStyle = {
    ...slideStyle,
    opacity: 1
  };

  const slideContentStyle = {
    position: 'absolute',
    bottom: '20%',
    left: '10%',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  };

  const contentSectionStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    textAlign: 'center'
  };

  const featureBoxStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
    marginTop: '2rem'
  };

  const featureItemStyle = {
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div style={containerStyle}>
      <div style={carouselStyle}>
        {slides.map((slide, index) => (
          <div key={index} style={index === currentSlide ? activeSlideStyle : slideStyle}>
            <img src={slide.image} alt={slide.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            <div style={slideContentStyle}>
              <h2 style={{fontSize: '2.5rem', marginBottom: '1rem'}}>{slide.title}</h2>
              <p style={{fontSize: '1.2rem'}}>{slide.desc}</p>
            </div>
          </div>
        ))}
        <div style={{position: 'absolute', bottom: '20px', width: '100%', display: 'flex', justifyContent: 'center', gap: '10px'}}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: currentSlide === index ? '#007bff' : 'white',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>

      <div style={contentSectionStyle}>
        <h2 style={{fontSize: '2rem', color: '#333', marginBottom: '1rem'}}>Why Choose SkillDash?</h2>
        <p style={{color: '#666', marginBottom: '2rem'}}>Connect with skilled professionals for all your home service needs</p>
        
        <div style={featureBoxStyle}>
          <div style={featureItemStyle}>
            <h3 style={{color: '#007bff', marginBottom: '1rem'}}>Verified Professionals</h3>
            <p style={{color: '#666'}}>All service providers are thoroughly vetted and verified</p>
          </div>
          <div style={featureItemStyle}>
            <h3 style={{color: '#007bff', marginBottom: '1rem'}}>Real-time Updates</h3>
            <p style={{color: '#666'}}>Track your service request status in real-time</p>
          </div>
          <div style={featureItemStyle}>
            <h3 style={{color: '#007bff', marginBottom: '1rem'}}>Secure Platform</h3>
            <p style={{color: '#666'}}>Safe and secure platform for all transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
