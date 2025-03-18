import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import ViewData from './pages/ViewData.jsx';
import DetailedView from './pages/DetailedView';
import InputForm from './pages/InputForm.jsx';
import Login from './pages/Login';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navbar from './components/layout/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
    return (
        <div className="app">
            <Provider store={store}>
                <Navbar />
                <main className="container">
                    <Routes>
                        <Route path="/" element={<ViewData />} />
                        <Route path="/admin" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/add" element={
                            <PrivateRoute>
                                <InputForm />
                            </PrivateRoute>
                        } />
                        <Route path="/edit/:id" element={
                            <PrivateRoute>
                                <InputForm />
                            </PrivateRoute>
                        } />
                        <Route path="/view/:id" element={<DetailedView />} />
                    </Routes>
                </main>
            </Provider>
        </div>
    );
}

export default App;
