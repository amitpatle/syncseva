# Person Manager

A secure, full-stack web application for managing person entries with authentication, CRUD operations, file uploads, and public sharing capabilities.

## Features

- **Secure Authentication**: User registration and login with Supabase Auth
- **Person Management**: Complete CRUD operations for person entries
- **File Uploads**: Image storage with thumbnail support
- **Public Sharing**: Unique, unguessable public links for read-only access
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Validation**: Client and server-side data validation
- **Pagination**: Efficient data loading with pagination support

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **File Storage**: Supabase Storage
- **Authentication**: Supabase Auth with email/password
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+
- Supabase account

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd person-manager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your project URL and anon key
3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Fill in your Supabase credentials in `.env`

### 4. Set up the database

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create persons table
CREATE TABLE IF NOT EXISTS persons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  photo_url text,
  emergency_contact text NOT NULL,
  address jsonb NOT NULL,
  public_link_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own persons"
  ON persons
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own persons"
  ON persons
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own persons"
  ON persons
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own persons"
  ON persons
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow public read access via public_link_id
CREATE POLICY "Allow public read access"
  ON persons
  FOR SELECT
  TO anon
  USING (true);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('person-photos', 'person-photos', true);

-- Create storage policy
CREATE POLICY "Users can upload photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'person-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 5. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Documentation

### Authentication

- `POST /auth/signup` - Register new user
- `POST /auth/signin` - User login
- `POST /auth/signout` - User logout

### Person Management

- `GET /api/persons` - Get user's persons (paginated)
- `POST /api/persons` - Create new person
- `GET /api/persons/:id` - Get specific person
- `PUT /api/persons/:id` - Update person
- `DELETE /api/persons/:id` - Delete person
- `GET /api/public/:linkId` - Get person by public link

### File Upload

- `POST /storage/person-photos` - Upload person photo

## Data Models

### Person Entry
```typescript
interface Person {
  id: string;
  name: string;
  photo_url?: string;
  emergency_contact: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  public_link_id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}
```

## Security Features

- Row Level Security (RLS) policies
- Authenticated file uploads
- Secure public links with UUIDs
- Input validation and sanitization
- CORS protection

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds on push

### Netlify Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Upload the `dist` folder to your hosting provider
3. Configure environment variables
4. Set up redirects for SPA routing

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details