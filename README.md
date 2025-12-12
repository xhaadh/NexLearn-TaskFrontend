# NexLearn – Frontend Machine Test (Next.js + TypeScript)

---

## 🚀 Tech Stack

- **Next.js 14+ (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Axios** (API calls + Interceptors)
- **React Context API** (Authentication & global state)
- **LocalStorage + SessionStorage** (persistent auth & exam result)
- **Next/Image** (optimized assets)

---

## 📌 Features Implemented

### 🔐 Authentication (with OTP)

- Login screen for entering phone number  
- OTP verification screen  
- JWT-based login with **access token + refresh token stored in localStorage**  
- Axios interceptor attaches token automatically  
- Auto-redirect to `/login` if token is invalid or cleared  
- Logout clears all tokens & redirects to login  

### 🏠 Home Page (`/`)

- Fetches exam metadata from API:
  - Total questions  
  - Total marks  
  - Total time  
  - Instructions (HTML rendered with `dangerouslySetInnerHTML`)
- Pixel-perfect UI based on Figma
- Responsive layout for mobile + desktop  

### 📝 MCQ Test Page (`/mcq`)

Fully functional exam engine:

- Fetches all MCQs from API  
- Supports questions with:
  - Options
  - Images
  - Comprehension paragraphs
- Timer countdown (auto-submit when time ends)
- Mark for Review / Unmark
- Navigation (Previous / Next)
- Final question → "Submit" button
- Right-side question sheet with color indicators:
  - Answered
  - Not Answered
  - Marked For Review  

### 📊 Results Page (`/result`)

- Displays:
  - Score
  - Correct / Wrong / Not attended
  - Total questions
- UI matches Figma

---

## 🗂 Folder Structure
src/
├── app/
│ ├── (auth)/
│ │ ├── login/
│ │ └── verify/
│ │ └── create-profile/
│ ├── (root)/
│ │ ├── page.tsx → Home
│ │ ├── mcq/page.tsx → Exam page
│ │ └── result/page.tsx → Result page
│ └── layout.tsx → Global layout
│
├── components/
│ ├── Button.tsx
│ ├── Navbar.tsx
│ ├── Modal.tsx
│ ├── SmallConfirmModal.tsx
│ ├── Legends.tsx
│ └── RequireAuth.tsx
│
├── lib/
│ ├── axios.ts → Axios instance + interceptors
│ ├── api.ts → API helper functions
│ └── AuthContext.tsx → Auth provider + token handling
├── context/
│ └── AuthContext.tsx → Auth provider + token handling
│   
│
└── public/
├── frame.png
├── india.png
├── OBJECTS.png
└── other assets...

## Run development server
npm run dev

Application will be available at:

http://localhost:3000