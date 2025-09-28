# Person Directory Web Application

A secure, full-featured web application for managing personal contacts with photo uploads, emergency contact information, structured addresses, and unique public sharing links.

## Features

### 🔐 Authentication & Security
- Secure user registration and login with Supabase Auth
- Email/password authentication with proper validation
- Row-level security (RLS) ensuring users can only access their own data
- Secure session management

### 👥 Person Management
- Complete CRUD operations for person entries
- Structured data storage:
  - Full name
  - Photo upload with thumbnails
  - Emergency contact (name + phone)
  - Complete address (street, city, state, postal code, country)
- Server and client-side validation
- Form error handling and user feedback

### 🔗 Public Sharing
- Unique, unguessable public sharing links for each person
- Read-only public access without authentication required
- Secure UUID-based share IDs
- Public links work independently of user accounts

### 📱 User Experience
- Fully responsive design (mobile-first)
- Clean, modern interface with Tailwind CSS
- Pagination for large datasets (12 items per page)
- Real-time search and filtering
- Loading states and error handling
- Image upload with preview functionality

### 🖼️ File Management
- Photo upload to Supabase Storage
- Automatic thumbnail generation
- Fallback avatar generation for users without photos
- Secure file storage with public URLs

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, authentication, storage)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 16+ installed
- A Supabase account and project

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo>
cd person-directory

# Install dependencies
npm install
```

### 2. Supabase Configuration

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Create a `.env` file based on `.env.example`:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

1. In your Supabase project dashboard, go to the SQL Editor
2. Run the migration file `supabase/migrations/create_persons_table.sql`
3. This will create the `persons` table with proper RLS policies

### 4. Storage Setup

1. In Supabase, go to Storage
2. Create a new bucket called `person-photos`
3. Set the bucket to public
4. Configure RLS policies for the storage bucket to allow authenticated users to upload

### 5. Run the Application

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthForm.tsx    # Login/signup form
│   ├── Layout.tsx      # App layout wrapper
│   ├── PersonCard.tsx  # Person display card
│   ├── PersonForm.tsx  # Add/edit person form
│   ├── PersonDirectory.tsx # Main directory view
│   ├── PublicPersonView.tsx # Public sharing view
│   ├── Pagination.tsx  # Pagination component
│   ├── ShareModal.tsx  # Share link modal
│   └── DeleteModal.tsx # Delete confirmation modal
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── hooks/             # Custom React hooks
│   └── usePersons.ts  # Person data management
├── lib/               # Utility libraries
│   ├── supabase.ts    # Supabase client
│   └── database.types.ts # TypeScript types
└── App.tsx            # Main app component
```

## API Endpoints & Database Schema

### Database Tables

#### `persons`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `name` (Text, Required)
- `photo_url` (Text, Optional)
- `emergency_contact_name` (Text, Required)
- `emergency_contact_phone` (Text, Required)
- `address_street` (Text, Required)
- `address_city` (Text, Required)
- `address_state` (Text, Required)
- `address_postal_code` (Text, Required)
- `address_country` (Text, Default: 'United States')
- `public_share_id` (Text, Unique, Auto-generated)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Security Policies

- Users can only view, create, update, and delete their own persons
- Public read access available via `public_share_id`
- Row-level security enabled on all tables

## Deployment

### Netlify/Vercel Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your preferred hosting service

3. Set environment variables in your hosting platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. Configure redirects for client-side routing:

For Netlify, create `public/_redirects`:
```
/*    /index.html   200
```

For Vercel, create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Security Considerations

- All sensitive operations require authentication
- Row-level security prevents data leakage between users
- Public sharing links are UUID-based and unguessable
- File uploads are scanned and stored securely
- Client and server-side validation prevent malicious input

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details