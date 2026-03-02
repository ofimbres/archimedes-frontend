import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { getOAuthRedirectUrl } from '../libs/authApi';
import './Landing.css';

/**
 * Kid-Friendly Landing Page - Vibrant and engaging design for elementary/middle school
 */
const Landing: React.FC = () => {
  return (
    <div className="landing-container d-flex align-items-center">
      {/* Floating Shapes for Fun */}
      <div className="floating-shapes">
        <div className="shape shape-circle shape-1"></div>
        <div className="shape shape-triangle shape-2"></div>
        <div className="shape shape-square shape-3"></div>
        <div className="shape shape-circle shape-4"></div>
        <div className="shape shape-triangle shape-5"></div>
      </div>
      
      <Container className="landing-content">
        <Row className="justify-content-center text-center">
          <Col lg={8} md={10}>
            {/* Logo with Fun Animation */}
            <img 
              src="archimedes-logo.jpg" 
              alt="Archimedes Logo" 
              className="landing-logo pulse-gentle"
            />
            
            {/* Main Content */}
            <h1 className="landing-title">
              Welcome to Archimedes! 🚀
            </h1>
            <p className="landing-subtitle">
              Discover the amazing world of math and science with fun, interactive exercises designed just for you!
            </p>
            
            {/* Action Buttons */}
            <div className="landing-buttons d-flex justify-content-center flex-wrap gap-2">
              <a
                href={getOAuthRedirectUrl()}
                className="landing-btn-signin"
              >
                Sign in with Google
              </a>
              <Link to="/signin" className="landing-btn-signin">
                🔐 Sign In (email)
              </Link>
              <Link to="/signup" className="landing-btn-signup">
                ✨ Start Learning
              </Link>
            </div>
            
            {/* Fun Facts or Features */}
            <div className="row mt-4">
              <div className="col-md-4 mb-3">
                <div className="text-kid-primary">
                  <h3>🧮 Math Adventures</h3>
                  <p>Solve puzzles and explore numbers!</p>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="text-kid-green">
                  <h3>🎓 Self-Learning Journey</h3>
                  <p>Learn at your own pace and discover new things!</p>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="text-kid-orange">
                  <h3>🎯 Fun Challenges</h3>
                  <p>Level up your learning skills!</p>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="landing-footer">
              <small>
                © {new Date().getFullYear()} Archimedes Learning Platform - Made with ❤️ for young learners
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Landing;
