import React from 'react';
import { IoMdCheckmarkCircle, IoMdHome, IoMdBriefcase, IoMdRestaurant, IoMdSchool } from 'react-icons/io';
import './Donate.css';

const Donate = () => {
  return (
    <div className="donate-page">
      <div className="container">
        <h1>Support Our Mission</h1>
        <p className="donate-subtitle">
          Your generous contribution helps us transform lives through Social, Economic & Educational empowerment
        </p>

        <div className="donate-content">
          <div className="donate-appeal">
            <h2>Make a Difference Today</h2>
            <p>
              At FIRST BORN GOSPEL LIFE MINISTRIES, we believe in the power of collective action
              to bring about lasting change. Your donation, no matter how small, can make a
              significant impact in the lives of those we serve.
            </p>

            <div className="donation-usage">
              <h3>How Your Donation is Used</h3>
              <div className="usage-grid">
                <div className="usage-card">
                  <IoMdSchool className="usage-icon" />
                  <h4>Education Programs</h4>
                  <p>Supporting education for underprivileged children through scholarships, school supplies, and tutoring programs.</p>
                </div>
                <div className="usage-card">
                  <IoMdRestaurant className="usage-icon" />
                  <h4>Feeding Programs</h4>
                  <p>Providing nutritious meals to families and children in need through our community feeding initiatives.</p>
                </div>
                <div className="usage-card">
                  <IoMdHome className="usage-icon" />
                  <h4>Community Development</h4>
                  <p>Building stronger communities through infrastructure development, health awareness, and social welfare programs.</p>
                </div>
                <div className="usage-card">
                  <IoMdBriefcase className="usage-icon" />
                  <h4>Economic Empowerment</h4>
                  <p>Enabling financial independence through skill development, micro-enterprise support, and vocational training.</p>
                </div>
              </div>
            </div>

            <div className="become-partner">
              <h3>Become a Partner</h3>
              <p>
                Join our community of recurring donors and make a lasting impact. Monthly or
                annual contributions help us plan and execute long-term projects that create
                sustainable change in our communities.
              </p>
              <ul>
                <li><IoMdCheckmarkCircle style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Consistent support for ongoing programs</li>
                <li><IoMdCheckmarkCircle style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Priority updates on project progress</li>
                <li><IoMdCheckmarkCircle style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Recognition as a ministry partner</li>
                <li><IoMdCheckmarkCircle style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Tax-deductible donations</li>
              </ul>
            </div>
          </div>

          <div className="donation-form-section">
            <h2>Donate Now</h2>

            <div className="payment-methods">
              <h3>Quick Donate via PayPal</h3>
              <a
                href="http://paypal.me/vkraju"
                target="_blank"
                rel="noopener noreferrer"
                className="paypal-button"
                style={{
                  display: 'inline-block',
                  padding: '1rem 2rem',
                  background: '#0070ba',
                  color: 'white',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(0, 112, 186, 0.3)',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  width: '100%'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#005ea6';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 112, 186, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#0070ba';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 112, 186, 0.3)';
                }}
              >
                💳 Donate via PayPal
              </a>
              <p className="payment-note">
                Secure payment processing. All donations are tax-deductible.
              </p>
            </div>

            <div className="bank-details">
              <h3>Bank Transfer Details</h3>
              <div className="bank-info">
                <p><strong>Bank Name:</strong> STATE BANK OF INDIA</p>
                <p><strong>Branch Address:</strong><br />
                  FCRA Cell, 4th Floor<br />
                  New Delhi Main Branch<br />
                  11 Sansad Marg<br />
                  New Delhi 110 001
                </p>
                <p><strong>Account Name:</strong> FIRST BORN GOSPEL LIFE MINISTRIES</p>
                <p><strong>Account Number:</strong> 39964143309</p>
                <p><strong>IFSC Code:</strong> SBIN0000691</p>
                <p><strong>SWIFT Code:</strong> SBININBB104</p>
                <p><strong>Purpose:</strong> Support for Social Work or Education</p>
                <p><strong>Contact:</strong> +91 7382106748</p>
              </div>
              <p className="bank-note" style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#f0f9ff',
                borderLeft: '4px solid #0070ba',
                borderRadius: '4px',
                fontSize: '0.9rem',
                color: '#666'
              }}>
                💡 Please mention the purpose of your donation when making a bank transfer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
