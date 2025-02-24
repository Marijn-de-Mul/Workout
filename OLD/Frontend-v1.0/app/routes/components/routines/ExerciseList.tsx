import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const ExerciseList = ({ routine }) => {
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: '/api/Exercise',
            method: 'GET',
            authorization: Cookies.get('authToken'),
            body: null,
            contentType: 'application/json',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const exercises = data.$values ? data.$values.filter(exercise => exercise.routineId === routine.id) : [];
          setExercises(exercises);
        } else {
          setError('Failed to fetch exercises.');
        }
      } catch (error) {
        setError('Failed to fetch exercises.');
      }
    };

    fetchExercises();
  }, [routine.id]);

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '16px', color: 'green' }}>
        {routine.name}
      </h2>
      <p style={{ textAlign: 'center', color: '#7D7D7D', marginBottom: '32px' }}>
        {routine.description}
      </p>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {exercises.map((exercise) => (
          <div key={exercise.id} style={{ marginBottom: '16px', backgroundColor: 'white', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ color: 'black' }}>{exercise.name}</h3>
            <p style={{ color: '#7D7D7D' }}>{exercise.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;