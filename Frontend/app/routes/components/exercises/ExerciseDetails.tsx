import React from 'react';

const ExerciseDetails = ({ exercise, routine, error }) => {
  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '16px', color: 'green' }}>
        {exercise.name}
      </h2>
      <p style={{ textAlign: 'center', color: '#7D7D7D', marginBottom: '32px' }}>
        {exercise.description}
      </p>
      <h3 style={{ textAlign: 'center', marginBottom: '16px', color: 'green' }}>
        Routine: {routine ? routine.name : 'N/A'}
      </h3>
      <p style={{ textAlign: 'center', color: '#7D7D7D', marginBottom: '32px' }}>
        {routine ? routine.description : 'N/A'}
      </p>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </div>
  );
};

export default ExerciseDetails;