import React, { useState } from 'react';
import './Donate.css';

const Donate = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [selectedProject, setSelectedProject] = useState('general');

  const handleAmountClick = (amount) => {
    setDonationAmount(amount.toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would integrate with Razorpay, PayPal, or bank transfer
    console.log('Donation:', {
      amount: donationAmount,
      type: donationType,
      project: selectedProject
    });
    alert('Thank you for your donation! Payment integration will be added here.');
  };

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
                  <div className="usage-icon">📚</div>
                  <h4>Education Programs</h4>
                  <p>Supporting education for underprivileged children through scholarships, school supplies, and tutoring programs.</p>
                </div>
                <div className="usage-card">
                  <div className="usage-icon">🍽️</div>
                  <h4>Feeding Programs</h4>
                  <p>Providing nutritious meals to families and children in need through our community feeding initiatives.</p>
                </div>
                <div className="usage-card">
                  <div className="usage-icon">🏠</div>
                  <h4>Community Development</h4>
                  <p>Building stronger communities through infrastructure development, health awareness, and social welfare programs.</p>
                </div>
                <div className="usage-card">
                  <div className="usage-icon">💼</div>
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
                <li>✅ Consistent support for ongoing programs</li>
                <li>✅ Priority updates on project progress</li>
                <li>✅ Recognition as a ministry partner</li>
                <li>✅ Tax-deductible donations</li>
              </ul>
            </div>
          </div>

          <div className="donation-form-section">
            <h2>Make a Donation</h2>
            <form className="donation-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Donation Type</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="donationType"
                      value="one-time"
                      checked={donationType === 'one-time'}
                      onChange={(e) => setDonationType(e.target.value)}
                    />
                    One-Time Donation
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="donationType"
                      value="recurring"
                      checked={donationType === 'recurring'}
                      onChange={(e) => setDonationType(e.target.value)}
                    />
                    Recurring Donation
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Select Project (Optional)</label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="form-select"
                >
                  <option value="general">General Fund</option>
                  <option value="education">Education Programs</option>
                  <option value="social">Social Development</option>
                  <option value="economy">Economic Empowerment</option>
                  <option value="feeding">Feeding Programs</option>
                </select>
              </div>

              <div className="form-group">
                <label>Donation Amount *</label>
                <div className="amount-buttons">
                  <button type="button" className="amount-btn" onClick={() => handleAmountClick(500)}>₹500</button>
                  <button type="button" className="amount-btn" onClick={() => handleAmountClick(1000)}>₹1,000</button>
                  <button type="button" className="amount-btn" onClick={() => handleAmountClick(2500)}>₹2,500</button>
                  <button type="button" className="amount-btn" onClick={() => handleAmountClick(5000)}>₹5,000</button>
                  <button type="button" className="amount-btn" onClick={() => handleAmountClick(10000)}>₹10,000</button>
                </div>
                <input
                  type="number"
                  placeholder="Or enter custom amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  min="100"
                  required
                  className="amount-input"
                />
              </div>

              <button type="submit" className="btn-donate">Donate Now</button>
            </form>

            <div className="payment-methods">
              <h3>Payment Methods</h3>
              <div className="payment-icons">
                <div className="payment-icon">💳 Razorpay</div>
                <div className="payment-icon">💳 PayPal</div>
                <div className="payment-icon">🏦 Bank Transfer</div>
              </div>
              <p className="payment-note">
                Secure payment processing. All donations are tax-deductible under Section 80G of the Income Tax Act.
              </p>
            </div>

            <div className="bank-details">
              <h3>Bank Transfer Details</h3>
              <div className="bank-info">
                <p><strong>Account Name:</strong> FIRST BORN GOSPEL LIFE MINISTRIES</p>
                <p><strong>Account Number:</strong> [Account Number]</p>
                <p><strong>IFSC Code:</strong> [IFSC Code]</p>
                <p><strong>Bank Name:</strong> [Bank Name]</p>
                <p><strong>Branch:</strong> [Branch Name]</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;


