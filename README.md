# 🩺 Organ Donation Platform (Blockchain-Powered dApp)

![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-blue)
![Smart%20Contracts](https://img.shields.io/badge/Smart%20Contracts-Solidity-orange)
![Frontend](https://img.shields.io/badge/Frontend-Bootstrap%205-purple)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 📌 Overview

The **Organ Donation Platform** is a **blockchain-powered decentralized application (dApp)** designed to create a **transparent, secure, and trustless ecosystem** for organ donation.

Traditional organ donation systems often suffer from:

* ❌ Lack of transparency
* ❌ Data tampering risks
* ❌ Inefficient donor-recipient matching

This platform solves these problems using:

* 🔗 **Ethereum Blockchain**
* 📜 **Smart Contracts**
* 🤖 **Machine Learning**

---

## 🚀 Key Features

### 🔗 Blockchain Transparency

* All donor, patient, and pledge data is stored on-chain
* Immutable and tamper-proof records
* Fully auditable system

### 🛡️ Secure Donor-Recipient Matching

* Matches based on:

  * Blood group
  * Organ type
  * Compatibility factors

### 🤖 ML-Based Transplant Success Predictor

* Logistic Regression model
* Predicts transplant success probability
* Helps in better medical decision-making

### 💬 AI Chatbot Integration

* Guides users through:

  * Registration
  * Organ donation process
  * FAQs

### 🌍 Multi-Language Support

* English 🇬🇧
* Hindi 🇮🇳
* Improves accessibility for wider audience

### 🌓 Dark & Light Mode

* Glassmorphism UI
* Smooth theme switching

### 📊 Impact Dashboard

* Real-time statistics:

  * Total donors
  * Total patients
  * Successful matches

---

## 🛠️ Tech Stack

| Layer                 | Technologies                                  |
| --------------------- | --------------------------------------------- |
| **Blockchain**        | Ethereum, Solidity                            |
| **Development Tools** | Truffle Suite, Ganache                        |
| **Frontend**          | HTML5, CSS3, Bootstrap 5, JavaScript, Web3.js |
| **Backend**           | Node.js, Express.js                           |
| **Machine Learning**  | Logistic Regression                           |
| **Localization**      | Custom i18n                                   |

---

## 🧠 System Architecture

```text
User (Browser + MetaMask)
        ↓
Frontend (HTML/CSS/JS + Web3.js)
        ↓
Smart Contracts (Solidity)
        ↓
Ethereum Blockchain (Ganache Local Network)
        ↓
Backend (Node.js) + ML Model
```

---

## ⚙️ Installation & Setup

### 📌 Prerequisites

Make sure you have:

* Node.js (LTS)
* Truffle
* Ganache
* MetaMask

Install Truffle:

```bash
npm install -g truffle
```

---

### 🧩 Steps to Run the Project

#### 1. Clone Repository

```bash
git clone https://github.com/your-username/organ-donation-platform.git
cd organ-donation-platform
```

#### 2. Install Dependencies

```bash
cd app
npm install
```

#### 3. Setup Ganache

* Open Ganache
* Create New Workspace
* Add `truffle-config.js`
* Save

#### 4. Deploy Smart Contracts

```bash
truffle compile
truffle migrate
```

#### 5. Connect MetaMask

* Import Ganache account
* Connect to Localhost Network

#### 6. Start Application

```bash
cd app
npm run dev
```

#### 7. Open in Browser

```
http://localhost:8080
```

---



## 📜 Smart Contract Details

### 📄 Contract: `DonorContract.sol`

### Functionalities:

* 🧾 Register Donors & Patients
* 🤝 Organ Matching Logic
* 📌 Pledge Management
* ✅ Verification System

---

## 🤖 Machine Learning Module

* Algorithm: **Logistic Regression**
* Input Features:

  * Age
  * Blood group
  * Organ type
  * Health parameters
* Output:

  * Success Probability (%)

---

## 📂 Project Structure

```text
organ-donation-platform/
│
├── contracts/          # Solidity smart contracts
├── migrations/         # Truffle migrations
├── app/                # Frontend + Backend
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── test/               # Contract testing
├── truffle-config.js
└── README.md
```

---

## 🔐 Security Features

* Blockchain immutability
* MetaMask authentication
* Secure transaction signing
* No centralized data storage

---

## 🌱 Future Enhancements

* 🔗 Integration with real hospital databases
* 📱 Mobile application
* 🤖 Advanced AI matching
* 🌐 IPFS for decentralized storage
* 🧾 Government verification integration

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo
# Create new branch
git checkout -b feature/YourFeature

# Commit changes
git commit -m "Added new feature"

# Push
git push origin feature/YourFeature
```

Then open a Pull Request 🚀

---




## ❤️ Acknowledgment

This project is built with the vision of creating a **transparent, decentralized, and life-saving organ donation ecosystem** using blockchain technology.

---

## ⭐ Support

If you like this project:

* ⭐ Star the repository
* 🍴 Fork it
* 📢 Share it

---

**Made with ❤️ for a Better Future**
