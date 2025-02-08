import React from 'react';
import MobileNavbar from './components/MobileNavbar';
import ProtectedRoute from './components/ProtectedRoute';

const Exercises = () => {
    return (
        <ProtectedRoute>
            <div
                style={{
                    maxWidth: '400px',
                    margin: '0 auto',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    justifyContent: 'space-between',
                    backgroundColor: '#f9f9f9',
                }}
            >
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        paddingBottom: '60px',
                    }}
                >
                    <h1 style={{ textAlign: 'center', marginBottom: '16px', color: 'green' }}>
                        Exercises
                    </h1>
                    <p style={{ textAlign: 'center', color: '#7D7D7D', marginBottom: '32px' }}>
                        Your exercise routines and details...
                    </p>

                    <div style={{ textAlign: 'center', marginBottom: '16px', backgroundColor: 'white', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                        <h2 style={{ color: 'green' }}>Exercise 1</h2>
                        <p style={{ color: '#7D7D7D' }}>Description of exercise 1...</p>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '16px', backgroundColor: 'white', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                        <h2 style={{ color: 'green' }}>Exercise 2</h2>
                        <p style={{ color: '#7D7D7D' }}>Description of exercise 2...</p>
                    </div>

                    <div style={{ textAlign: 'center', backgroundColor: 'white', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                        <h2 style={{ color: 'green' }}>Exercise 3</h2>
                        <p style={{ color: '#7D7D7D' }}>Description of exercise 3...</p>
                    </div>
                </div>

                <MobileNavbar />
            </div>
        </ProtectedRoute>
    );
};

export default Exercises;