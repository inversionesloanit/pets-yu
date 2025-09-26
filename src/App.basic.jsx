import React from 'react';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '1rem' 
        }}>
          Pets Yu
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#6b7280' 
        }}>
          Accesorios premium para mascotas
        </p>
      </div>
    </div>
  );
}

export default App;
