import React, { useState } from 'react';
import { Heart, CreditCard, Building, Users, BookOpen, CheckCircle } from 'lucide-react';
import '../styles/pages/donate.css';

const Donate = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  const donationCategories = [
    {
      id: 'general',
      title: 'General Fund',
      description: 'Support our overall ministry operations and programs',
      icon: <Heart className="w-6 h-6" />
    },
    {
      id: 'education',
      title: 'Education Programs',
      description: 'Help provide quality education and learning opportunities',
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      id: 'social',
      title: 'Social Development',
      description: 'Support community development and social programs',
      icon: <Users className="w-6 h-6" />
    },
    {
      id: 'economic',
      title: 'Economic Empowerment',
      description: 'Help create sustainable livelihoods and economic opportunities',
      icon: <Building className="w-6 h-6" />
    }
  ];

  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  const handleDonation = async () => {
    setIsProcessing(true);
    
    // Simulate PayPal integration
    setTimeout(() => {
      setIsProcessing(false);
      setDonationSuccess(true);
    }, 2000);
  };

  const bankDetails = {
    accountName: 'FIRST BORN GOSPEL LIFE MINISTRIES',
    accountNumber: '1234567890',
    ifscCode: 'SBIN0001234',
    bankName: 'State Bank of India',
    branch: 'Main Branch'
  };

  if (donationSuccess) {
    return (
      <div className="donate-success">
        <div className="donate-success-content">
          <div className="donate-success-card">
            <CheckCircle className="donate-success-icon" />
            <h2 className="donate-success-title">Thank You!</h2>
            <p className="donate-success-description">
              Your donation has been received. Your support helps us transform lives and build stronger communities.
            </p>
            <button
              onClick={() => {
                setDonationSuccess(false);
                setDonationAmount('');
                setSelectedCategory('general');
              }}
              className="donate-success-btn"
            >
              Make Another Donation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="donate-page">
      <div className="donate-container">
        {/* Header */}
        <div className="donate-header">
          <h1 className="donate-title">Support Our Mission</h1>
          <p className="donate-description">
            Your generous donation helps us continue our work of transforming lives through 
            social development, economic empowerment, and educational support programs.
          </p>
        </div>

        <div className="donate-content">
          {/* Donation Form */}
          <div className="donate-form">
            <h2 className="donate-form-title">Make a Donation</h2>
            
            {/* Donation Category */}
            <div className="donate-form-section">
              <label className="donate-form-label">
                Choose Donation Category
              </label>
              <div className="donate-categories">
                {donationCategories.map((category) => (
                  <label
                    key={category.id}
                    className={`donate-category ${
                      selectedCategory === category.id ? 'donate-category-selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={selectedCategory === category.id}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="donate-category-input"
                    />
                    <div className="donate-category-content">
                      <div className="donate-category-icon">
                        {category.icon}
                      </div>
                      <div className="donate-category-info">
                        <h3 className="donate-category-title">{category.title}</h3>
                        <p className="donate-category-description">{category.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Donation Amount */}
            <div className="donate-form-section">
              <label className="donate-form-label">
                Donation Amount (₹)
              </label>
              
              {/* Preset Amounts */}
              <div className="donate-amounts">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setDonationAmount(amount.toString())}
                    className={`donate-amount-btn ${
                      donationAmount === amount.toString() ? 'donate-amount-btn-selected' : ''
                    }`}
                  >
                    ₹{amount.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <input
                type="number"
                placeholder="Enter custom amount"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="donate-amount-input"
                min="1"
              />
            </div>

            {/* PayPal Button */}
            <button
              onClick={handleDonation}
              disabled={!donationAmount || isProcessing}
              className="donate-paypal-btn"
            >
              {isProcessing ? (
                <div className="donate-paypal-spinner"></div>
              ) : (
                <>
                  <CreditCard className="donate-paypal-icon" />
                  Donate with PayPal
                </>
              )}
            </button>

            <p className="donate-paypal-note">
              Secure payment processing by PayPal
            </p>
          </div>

          {/* Bank Transfer Details */}
          <div className="donate-bank">
            <h2 className="donate-bank-title">Bank Transfer</h2>
            <p className="donate-bank-description">
              You can also make a direct bank transfer to our account:
            </p>

            <div className="donate-bank-details">
              <h3 className="donate-bank-details-title">Account Details</h3>
              <div className="donate-bank-details-list">
                <div className="donate-bank-detail">
                  <span className="donate-bank-detail-label">Account Name:</span>
                  <span className="donate-bank-detail-value">{bankDetails.accountName}</span>
                </div>
                <div className="donate-bank-detail">
                  <span className="donate-bank-detail-label">Account Number:</span>
                  <span className="donate-bank-detail-value">{bankDetails.accountNumber}</span>
                </div>
                <div className="donate-bank-detail">
                  <span className="donate-bank-detail-label">IFSC Code:</span>
                  <span className="donate-bank-detail-value">{bankDetails.ifscCode}</span>
                </div>
                <div className="donate-bank-detail">
                  <span className="donate-bank-detail-label">Bank Name:</span>
                  <span className="donate-bank-detail-value">{bankDetails.bankName}</span>
                </div>
                <div className="donate-bank-detail">
                  <span className="donate-bank-detail-label">Branch:</span>
                  <span className="donate-bank-detail-value">{bankDetails.branch}</span>
                </div>
              </div>
            </div>

            <div className="donate-bank-note">
              <h4 className="donate-bank-note-title">Important Note</h4>
              <p className="donate-bank-note-text">
                Please include your name and contact information in the transfer description 
                so we can send you a receipt and keep you updated on how your donation is used.
              </p>
            </div>
          </div>
        </div>

        {/* How Donations Are Used */}
        <div className="donate-impact">
          <h2 className="donate-impact-title">
            How Your Donations Make a Difference
          </h2>
          
          <div className="donate-impact-grid">
            <div className="donate-impact-item">
              <div className="donate-impact-icon donate-impact-icon-red">
                <Heart className="donate-impact-icon-svg" />
              </div>
              <h3 className="donate-impact-item-title">Feeding Programs</h3>
              <p className="donate-impact-item-description">
                Provide nutritious meals to families and children in need
              </p>
            </div>
            
            <div className="donate-impact-item">
              <div className="donate-impact-icon donate-impact-icon-blue">
                <BookOpen className="donate-impact-icon-svg" />
              </div>
              <h3 className="donate-impact-item-title">Education Sponsorship</h3>
              <p className="donate-impact-item-description">
                Support children's education through school fees and supplies
              </p>
            </div>
            
            <div className="donate-impact-item">
              <div className="donate-impact-icon donate-impact-icon-green">
                <Users className="donate-impact-icon-svg" />
              </div>
              <h3 className="donate-impact-item-title">Community Development</h3>
              <p className="donate-impact-item-description">
                Build infrastructure and programs that strengthen communities
              </p>
            </div>
          </div>
        </div>

        {/* Become a Partner */}
        <div className="donate-partner">
          <h2 className="donate-partner-title">Become a Monthly Partner</h2>
          <p className="donate-partner-description">
            Join our community of monthly supporters and help us plan for long-term impact. 
            Your consistent support enables us to make sustainable changes in communities.
          </p>
          <button className="donate-partner-btn">
            Set Up Monthly Giving
          </button>
        </div>
      </div>
    </div>
  );
};

export default Donate;
