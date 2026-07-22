# Sample Data for FBGL Ministry Website

This document explains the sample dataset extracted from `UPF_Membership_Partnership_Data_Mandalam_Wise (1).xlsx` and populated into the database.

## 🚀 Quick Start

### Option 1: Database Seeder (MongoDB)
Run the backend database seeder to reset and populate all profiles, projects, and blog posts:
```bash
cd backend
node seed.js
```

### Option 2: Supabase Command Line Script
Set environment variables and populate Supabase:
```bash
export REACT_APP_SUPABASE_URL="your_supabase_url"
export REACT_APP_SUPABASE_ANON_KEY="your_supabase_anon_key"
node populate-sample-data.js
```

## 📊 Sample Data Summary

### 👥 Accounts & Profiles (61 Total Users)

All user accounts have been created with:
- **Default Password**: `asdf1234`
- **Username**: Member's Email Address

#### 🔑 Admin User (1 Account)
- `admin@fbglministry.org` / `asdf1234`

#### 👑 Board Members (2 Sample Accounts)
- **Sample Board Member 1**: `boardmember1@fbglministry.org` / `asdf1234` (Founder & President)
- **Sample Board Member 2**: `boardmember2@fbglministry.org` / `asdf1234` (Vice President)

#### 👔 Area Manager (1 Account)
- **Mude Rajesh**: `mude.rajesh.rajahmundry@fbglministry.org` / `asdf1234` (ID: `FBGL-AP-EG-AM-01`)

#### 📋 Project Manager (1 Account)
- **Panta Satyanarayana**: `panta.satyanarayana.rajahmundry@fbglministry.org` / `asdf1234` (ID: `FBGL-AP-EG-PM-01`)

#### 🤝 Social Workers (56 Accounts across 17 Mandals)
Accounts created for all team members extracted from the Excel sheets (IDs: `FBGL-AP-EG-SW-01` to `FBGL-AP-EG-SW-56`):
- Atreyapuram Mandal
- Devipatnam Mandal
- GKM Mandal
- Gandepalli Mandal
- Gangavaram Mandal
- Gokavaram Mandal
- Korukonda Mandal
- Kothapeta Mandal
- Kovvuru Mandal
- Mandapeta Mandal
- Nidamarru Mandal
- Purushothapatnam Mandal
- Rajahmundry Mandal
- Rajahmundry Rural Mandal
- Rajanagaram Mandal
- Seethanagaram Mandal

### 🎯 Sample Projects (3 Projects)
1. **Sample Project 1: Rural Education & Skill Support** (Category: Education)
2. **Sample Project 2: Women Empowerment & Vocational Training** (Category: Economy)
3. **Sample Project 3: Community Health & Clean Water Initiative** (Category: Social)

### 📝 Sample Blog Posts (2 Posts)
1. **Sample Blog Post 1: Transforming Communities Across East Godavari**
2. **Sample Blog Post 2: Community Health Camp and Water Awareness Success**

---
*Note: All data has been prepared according to FBGL ID format and role hierarchy.*
