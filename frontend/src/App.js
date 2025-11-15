import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import OurTeam from './pages/OurTeam';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import './App.css';

function App() {
  return (
    <Router>
    <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<OurTeam />} />
            <Route path="/team/:type/:id" element={<OurTeam />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donate />} />
          </Routes>
        </main>
        <Footer />
    </div>
    </Router>
  );
}

export default App;
