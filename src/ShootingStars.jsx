import React, { useEffect, useState } from 'react';
import './ShootingStars.css';

export function ShootingStars() {
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    // Generamos un array de meteoritos con posiciones y retrasos aleatorios
    const meteorCount = 15;
    const generated = Array.from({ length: meteorCount }).map((_, i) => ({
      id: i,
      top: Math.random() * 100, // posición vertical inicial en %
      left: Math.random() * 100, // posición horizontal inicial en %
      delay: Math.random() * 5,  // retraso de la animación
      duration: 3 + Math.random() * 4, // velocidad de caída (entre 3s y 7s)
    }));
    setMeteors(generated);
  }, []);

  return (
    <div className="meteor-shower-container">
      {meteors.map((m) => (
        <span
          key={m.id}
          className="meteor"
          style={{
            top: `${m.top}%`,
            left: `${m.left}%`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
          }}
        />
      ))}
    </div>
  );
}