# ZEB: The Premium Digital Art Ecosystem 🎨✨

**Stellar-Powered. AI-Protected. Institutional-Grade.**

ZEB is a state-of-the-art digital art marketplace built on the **Stellar Network** and **Soroban Smart Contracts**. It combines the speed of decentralized finance with a premium, high-fidelity user experience and an integrated AI similarity engine to ensure artwork authenticity.

---

## 🚀 Vision
ZEB is designed for creators who demand zero-compromise security and buyers who value verified ownership. By bridging the gap between high-end design and blockchain transparency, ZEB sets a new standard for NFT marketplaces.

## ✨ Key Features

### 🛡️ One-Click Wallet Authentication
*   **Sign-in with Wallet**: A "Google-style" seamless login experience using the Freighter extension.
*   **Zero Password**: Security is anchored in your Stellar public key.

### 🧠 Similarity Engine
*   **Gemini/CLIP Protected**: Every upload is analyzed for visual similarity against the existing vault.
*   **Authorship Integrity**: Prevents duplicate or derivative works from being registered on-chain.

### 🏺 Live Auction House
*   **Real-Time Bidding**: Dynamic auction engine powered by Soroban smart contracts.
*   **Verified Ownership**: Direct wallet-to-wallet transfers with automated settlement.

### 🏛️ Institutional Admin Suite
*   **Review Center**: Manual flagging and resolution of similarity disputes.
*   **Revenue Analytics**: Real-time tracking of registration fees, transfer cuts, and bidding volume.

---

## 🛠️ Tech Stack

### Frontend & Admin
*   **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
*   **Styling**: Vanilla CSS with a custom-engineered **Slate/Cyan/White** design system.
*   **Storage**: cloudinary

### Backend
*   **Runtime**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
*   **Similarity Engine**: Custom Python/Node bridge for visual embedding.

### Blockchain
*   **Net**: [Stellar Testnet](https://stellar.org/)
*   **Contracts**: [Soroban](https://soroban.stellar.org/) (Rust)
*   **Wallet**: [Freighter](https://www.freighter.app/)

---

## 📦 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or Atlas)
- [Freighter Wallet](https://www.freighter.app/) extension installed.

### 2. Backend Setup
```bash
cd zeb-backend
npm install
# Create .env based on .env.example
npm start
```

### 3. Frontend Setup
```bash
cd zeb-frontend
npm install
npm run dev
```

### 4. Admin Dashboard Setup
```bash
cd zeb-admin
npm install
npm run dev
```

---

## 🌐 Deployment

### Frontend (Next.js)
The ZEB frontend is optimized for **Vercel** but can be deployed to any Node.js environment.

1.  **Vercel (Recommended)**: 
    - Connect your GitHub repository.
    - Set `NEXT_PUBLIC_STELLAR_NETWORK=TESTNET`.
    - Set `NEXT_PUBLIC_BACKEND_URL` to your production API.
2.  **Manual Build**:
    ```bash
    cd zeb-frontend
    npm run build
    npm run start
    ```

### Backend (Node/Express)
Deploy the backend to any VPS (DigitalOcean, AWS) or Render:
- Ensure `MONGO_URI` and `FREIGHTER_NETWORK` environment variables are set.
- Run `npm start` or use a process manager like **PM2**.


## 🤝 Contribution
Contributions are welcome! Please ensure all UI changes adhere to the **Perfect Design System** (Zero-gradient, 10px uppercase tracking, bold typography).

---

**Built with ❤️ for the Stellar Ecosystem.**

